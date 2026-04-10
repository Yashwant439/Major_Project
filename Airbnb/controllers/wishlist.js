const User = require("../models/auth.js");
const Listing = require("../models/listing.js");

module.exports.toggleWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(listingId);

    if (idx === -1) {
      user.wishlist.push(listingId);
      await user.save();
      return res.json({ status: "added", message: "Added to wishlist" });
    } else {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ status: "removed", message: "Removed from wishlist" });
    }
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

module.exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("listings/wishlist", { wishlistListings: user.wishlist });
};
