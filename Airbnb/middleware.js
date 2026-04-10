const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./public/utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (customMessage = "You must be logged in") => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", customMessage);
      return res.redirect("/login");
    }
    next();
  };
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You don't have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/listings/new");
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("back");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};