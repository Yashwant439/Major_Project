const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const wishlistController = require("../controllers/wishlist.js");

router.post("/wishlist/:listingId", isLoggedIn("You must be logged in"), wrapAsync(wishlistController.toggleWishlist));
router.get("/wishlist", isLoggedIn("You must be logged in to view wishlist"), wrapAsync(wishlistController.getWishlist));

module.exports = router;
