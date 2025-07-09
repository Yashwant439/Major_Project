const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const ExpressError = require("../public/utils/ExpressError.js");
const { sendBookingConfirmation } = require(".././public/utils/email.js");

module.exports.renderBookForm= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404, "https://clipart-library.com/data_images/208821.png");
    }
    res.render("listings/book", { listing });
}

module.exports.create = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404, "https://clipart-library.com/data_images/208821.png");
    }
    
    // total price 
    const nights = Math.ceil((new Date(req.body.checkOut) - new Date(req.body.checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * nights + (0.18*listing.price) ;
    
    // Create booking 
    const booking = new Booking({
        ...req.body,
        listing: id,
        user: req.user._id,
        totalPrice
    });
    await booking.save();
    
    res.render("listings/payment", { booking, listing });
}

module.exports.payment = async (req, res) => {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("listing user");
    
    // Simulate payment processing
    booking.paymentStatus = "completed";
    await booking.save();
    
    //mail bhjne wla
    await sendBookingConfirmation(booking);
    
    req.flash("success", "Booking confirmed! A confirmation has been sent to your email.");
    res.redirect(`/listings/${booking.listing._id}`);
}