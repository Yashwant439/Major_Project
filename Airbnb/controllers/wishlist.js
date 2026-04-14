const User = require("../models/auth.js");
const Listing = require("../models/listing.js");

module.exports.toggleWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).select("_id");
    if (!listing) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }

    const user = await User.findById(req.user._id).select("wishlist");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const isInWishlist = user.wishlist.some((itemId) => itemId.equals(listing._id));

    if (!isInWishlist) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: listing._id },
      });
      return res.json({ status: "added", message: "Added to wishlist" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: listing._id },
    });
    return res.json({ status: "removed", message: "Removed from wishlist" });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

module.exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/login");
  }
  res.render("listings/wishlist", { wishlistListings: user.wishlist });
};
