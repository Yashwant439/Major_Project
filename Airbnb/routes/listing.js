const express = require("express")
const router = express.Router()
const wrapAsync = require(".././public/utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const Listing = require("../models/listing.js")
const upload = multer({ storage })

router.get("/search", async (req, res) => {
  const { q } = req.query;
  const listings = await Listing.find({
    title: { $regex: new RegExp(q, "i") }, // Case-insensitive search
  });
  res.render("listings/index", { allListings: listings });
});


router.get("/", async (req, res) => {
  const { category } = req.query;
  let allListings;
  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index", { allListings });
});

router.get("/privacy", (req, res) => {
    res.render("listings/privacy");
});

router.get("/terms", (req, res) => {
    res.render("listings/terms");
});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn("You must be logged in to create a listing"),upload.single('listing[image]'),  validateListing,wrapAsync(listingController.create))



router.get("/new", isLoggedIn("You must be logged in to create a listing"),listingController.renderNewForm)


router
    .route("/:id")    
    .get(wrapAsync(listingController.renderShowForm))
    .put(isLoggedIn("You must be logged in to create a listing"), isOwner,upload.single('listing[image]'),  validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn("You must be logged in to delete this listing"),isOwner, wrapAsync(listingController.destroy))

//edit
router.get("/:id/edit",isLoggedIn("You must be logged in to edit this listing"),isOwner, wrapAsync(listingController.renderEditForm))



module.exports = router
