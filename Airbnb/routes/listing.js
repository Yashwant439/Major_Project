const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, validateListingImage } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../public/utils/ExpressError.js");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    cb(new ExpressError("Only image files are allowed", 400));
  },
});

// Search
router.get("/search", wrapAsync(listingController.search));

// Privacy & terms
router.get("/privacy", (req, res) => res.render("listings/privacy"));
router.get("/terms", (req, res) => res.render("listings/terms"));

// Index and Create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn("You must be logged in to create a listing"),
    upload.single("listing[image]"),
    validateListingImage,
    validateListing,
    wrapAsync(listingController.create)
  );

// New form (must be before /:id)
router.get("/new", isLoggedIn("You must be logged in to create a listing"), listingController.renderNewForm);

// Show, Update, Delete
router.route("/:id")
  .get(wrapAsync(listingController.renderShowForm))
  .put(
    isLoggedIn("You must be logged in to edit this listing"),
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(
    isLoggedIn("You must be logged in to delete this listing"),
    isOwner,
    wrapAsync(listingController.destroy)
  );

// Edit form
router.get("/:id/edit", isLoggedIn("You must be logged in to edit this listing"), isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
