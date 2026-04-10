const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const ExpressError = require("../public/utils/ExpressError.js");
const { sendBookingConfirmation } = require("../public/utils/email.js");
const razorpayInstance = require("../public/utils/razorpay.js");
const crypto = require("crypto");

module.exports.renderBookForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
};

module.exports.create = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const checkIn = new Date(req.body.checkIn);
  const checkOut = new Date(req.body.checkOut);

  if (checkOut <= checkIn) {
    req.flash("error", "Check-out date must be after check-in date");
    return res.redirect(`/listings/${id}/book`);
  }

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const basePrice = listing.price * nights;
  const tax = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + tax;

  const booking = new Booking({
    ...req.body,
    listing: id,
    user: req.user._id,
    totalPrice,
  });
  await booking.save();

  // Create Razorpay order
  try {
    const order = await razorpayInstance.orders.create({
      amount: totalPrice * 100, // in paise
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        listingId: id,
        bookingId: booking._id.toString(),
      },
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.render("listings/payment", {
      booking,
      listing,
      order,
      razorpayKeyId: process.env.TEST_API_KEY,
      nights,
      basePrice,
      tax,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    req.flash("error", "Payment initialization failed. Please try again.");
    return res.redirect(`/listings/${id}/book`);
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.TEST_API_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findById(bookingId).populate("listing user");
      if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/listings");
      }

      booking.paymentStatus = "completed";
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      // Send confirmation email (non-blocking)
      sendBookingConfirmation(booking).catch(err =>
        console.error("Email send failed:", err)
      );

      req.flash("success", "Payment successful! Booking confirmed. A confirmation email has been sent.");
      return res.redirect(`/listings/${booking.listing._id}`);
    } else {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = "failed";
        await booking.save();
      }
      req.flash("error", "Payment verification failed. Please contact support.");
      return res.redirect("/listings");
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    req.flash("error", "Payment processing error. Please contact support.");
    return res.redirect("/listings");
  }
};

module.exports.paymentFailed = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = "failed";
      await booking.save();
    }
  } catch (err) {
    console.error("Error updating failed payment:", err);
  }
  req.flash("error", "Payment failed. Please try again.");
  return res.redirect("/listings");
};