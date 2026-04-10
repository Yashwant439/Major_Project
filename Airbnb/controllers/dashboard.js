const User = require("../models/auth.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Review = require("../models/review.js");

module.exports.renderDashboard = async (req, res) => {
  const userId = req.user._id;

  const [user, myListings, myBookings, myReviews] = await Promise.all([
    User.findById(userId).populate("wishlist"),
    Listing.find({ owner: userId }).lean(),
    Booking.find({ user: userId }).populate("listing").sort({ createdAt: -1 }).lean(),
    Review.find({ author: userId }).lean(),
  ]);

  const totalSpent = myBookings
    .filter(b => b.paymentStatus === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  res.render("listings/dashboard", {
    user,
    myListings,
    myBookings,
    myReviews,
    totalSpent,
  });
};
