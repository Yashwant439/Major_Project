const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require(".././public/utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { renderBookForm, create, payment } = require("../controllers/bookings.js");

//Booking wla page
router.get("/book", isLoggedIn("You must be logged in to book"), wrapAsync(renderBookForm));

//Booking k baad payment
router.post("/book",  wrapAsync(create));

//Payment wla process
router.post("/payment",  wrapAsync(payment));

module.exports = router;