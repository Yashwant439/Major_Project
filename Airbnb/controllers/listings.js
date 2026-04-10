const Listing = require("../models/listing.js");
const ExpressError = require("../public/utils/ExpressError.js");
const geocodeLocation = require("../public/utils/geocoder.js");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  const allListings = await Listing.find(filter).lean();
  res.render("listings/index.ejs", { allListings, category: category || "" });
};

module.exports.search = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.redirect("/listings");
  }
  const allListings = await Listing.find({
    $or: [
      { title: { $regex: new RegExp(q, "i") } },
      { location: { $regex: new RegExp(q, "i") } },
      { country: { $regex: new RegExp(q, "i") } },
    ],
  }).lean();
  res.render("listings/index.ejs", { allListings, category: "", searchQuery: q });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.create = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const { location } = req.body.listing;
  let lat = req.body.listing.lat;
  let lng = req.body.listing.lng;

  let geometry;
  if (lat && lng) {
    geometry = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
  } else {
    geometry = await geocodeLocation(location);
  }

  const newListing = new Listing(req.body.listing);
  newListing.geometry = geometry || { type: "Point", coordinates: [0, 0] };
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/e_blur:300,w_300");
  res.render("listings/edit", { listing, originalImage });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body.listing;
  let lat = req.body.listing.lat;
  let lng = req.body.listing.lng;

  let geometry;
  if (lat && lng) {
    geometry = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
  } else {
    geometry = await geocodeLocation(location);
  }

  const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (!updated) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  updated.geometry = geometry || updated.geometry;

  if (req.file) {
    updated.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else if (req.body.listing.image && req.body.listing.image.url) {
    updated.image = {
      url: req.body.listing.image.url,
      filename: req.body.listing.image.filename,
    };
  }

  await updated.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  const delListing = await Listing.findByIdAndDelete(id);
  if (!delListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

module.exports.renderShowForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  // Calculate average rating
  let avgRating = 0;
  if (listing.reviews.length > 0) {
    const sum = listing.reviews.reduce((acc, r) => acc + r.rating, 0);
    avgRating = (sum / listing.reviews.length).toFixed(1);
  }
  res.render("listings/show.ejs", { listing, avgRating });
};