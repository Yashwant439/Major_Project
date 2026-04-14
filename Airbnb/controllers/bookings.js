const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const { sendBookingConfirmation } = require("../public/utils/email.js");
const razorpayInstance = require("../public/utils/razorpay.js");
const { calculateBookingPrice, verifyRazorpaySignature } = require("../public/utils/payment.js");

const isRazorpayConfigured = () =>
  Boolean(
    razorpayInstance &&
    razorpayInstance.isConfigured &&
    razorpayInstance.keyId &&
    razorpayInstance.keySecret
  );

const normalizeGuestCount = (value) => Number.parseInt(value, 10);

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
  if (!isRazorpayConfigured()) {
    req.flash("error", "Payment service is not configured. Please contact support.");
    return res.redirect(`/listings/${id}/book`);
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const guests = normalizeGuestCount(req.body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    req.flash("error", "Guest count must be between 1 and 20");
    return res.redirect(`/listings/${id}/book`);
  }

  if (!req.body.name || !req.body.email || !req.body.phone) {
    req.flash("error", "Name, email and phone are required");
    return res.redirect(`/listings/${id}/book`);
  }

  const priceResult = calculateBookingPrice({
    nightlyPrice: listing.price,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
  });
  if (!priceResult.ok) {
    req.flash("error", priceResult.reason);
    return res.redirect(`/listings/${id}/book`);
  }

  const { checkIn, checkOut, nights, basePrice, tax, totalPrice, isCheckInTodayOrFuture } =
    priceResult.value;
  if (!isCheckInTodayOrFuture) {
    req.flash("error", "Check-in date cannot be in the past");
    return res.redirect(`/listings/${id}/book`);
  }

  const booking = new Booking({
    ...req.body,
    guests,
    checkIn,
    checkOut,
    listing: id,
    user: req.user._id,
    totalPrice,
  });

  try {
    await booking.save();

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
      razorpayKeyId: razorpayInstance.keyId,
      nights,
      basePrice,
      tax,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    await Booking.findByIdAndDelete(booking._id).catch((cleanupErr) => {
      console.error("Booking cleanup failed:", cleanupErr);
    });
    req.flash("error", "Payment initialization failed. Please try again.");
    return res.redirect(`/listings/${id}/book`);
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment fields", redirectUrl: "/listings" });
    }

    const booking = await Booking.findById(bookingId).populate("listing user");
    if (!booking) {
      req.flash("error", "Booking not found");
      return res.status(404).json({ success: false, redirectUrl: "/listings" });
    }

    if (!booking.user._id.equals(req.user._id)) {
      return res.status(403).json({ success: false, redirectUrl: "/listings" });
    }

    if (booking.razorpayOrderId && booking.razorpayOrderId !== razorpay_order_id) {
      booking.paymentStatus = "failed";
      await booking.save();
      return res
        .status(400)
        .json({ success: false, message: "Order mismatch", redirectUrl: "/listings" });
    }

    const isSignatureValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: razorpayInstance.keySecret,
    });

    if (isSignatureValid) {
      if (booking.paymentStatus === "completed") {
        return res.json({ success: true, redirectUrl: `/listings/${booking.listing._id}` });
      }

      booking.paymentStatus = "completed";
      booking.razorpayPaymentId = razorpay_payment_id;
      await booking.save();

      // Send confirmation email (non-blocking)
      sendBookingConfirmation(booking).catch(err =>
        console.error("Email send failed:", err)
      );

      req.flash("success", "Payment successful! Booking confirmed. A confirmation email has been sent.");
      return res.json({ success: true, redirectUrl: `/listings/${booking.listing._id}` });
    } else {
      booking.paymentStatus = "failed";
      await booking.save();
      req.flash("error", "Payment verification failed. Please contact support.");
      return res.status(400).json({ success: false, redirectUrl: "/listings" });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    req.flash("error", "Payment processing error. Please contact support.");
    return res.status(500).json({ success: false, redirectUrl: "/listings" });
  }
};

module.exports.paymentFailed = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (booking && booking.user.equals(req.user._id)) {
      booking.paymentStatus = "failed";
      await booking.save();
    }
  } catch (err) {
    console.error("Error updating failed payment:", err);
  }
  req.flash("error", "Payment failed. Please try again.");
  return res.json({ success: false, redirectUrl: "/listings" });
};
