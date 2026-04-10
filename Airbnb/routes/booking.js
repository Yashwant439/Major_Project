const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../public/utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Booking form
router.get("/book", isLoggedIn("You must be logged in to book"), wrapAsync(bookingController.renderBookForm));

// Create booking & initiate payment
router.post("/book", isLoggedIn("You must be logged in to book"), wrapAsync(bookingController.create));

// Verify Razorpay payment
router.post("/verify-payment", isLoggedIn("You must be logged in"), wrapAsync(bookingController.verifyPayment));

// Payment failed callback
router.post("/payment-failed", isLoggedIn("You must be logged in"), wrapAsync(bookingController.paymentFailed));

module.exports = router;