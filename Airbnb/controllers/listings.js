const Listing = require("../models/listing.js")
const ExpressError = require("../public/utils/ExpressError.js")
const geocodeLocation = require("../public/utils/geocoder.js");
module.exports.index = async (req, res) => {

    const allListings = await Listing.find({})
    
    res.render("./listings/index.ejs", { allListings })
}

module.exports.renderNewForm= (req, res) => {
    
    res.render("./listings/new.ejs")
}

module.exports.create= async (req, res) => {
    let url = req.file.path
    let filename = req.file.filename
    const { location } = req.body.listing;
    let lat = req.body.listing.lat;
    let lng = req.body.listing.lng;

    let geometry;
    if (lat && lng) {
    geometry = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
    } else {
    geometry = await geocodeLocation(location);
    }
    const newListing = new Listing(req.body.listing)
    newListing.geometry = geometry || { type: "Point", coordinates: [0, 0] };
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    await newListing.save()
    // console.log(newListing)
    req.flash("success","New Listing Created!")
    res.redirect("/listings")

}
module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        throw new ExpressError("Cannot edit a non-existing listing", 404, "https://clipart-library.com/data_images/208821.png");
    }
    let originalImage = listing.image.url
    originalImage = originalImage.replace("/upload","/upload/e_blur:500")
    // console.log(listing)
    res.render("./listings/edit", { listing , originalImage})
}

module.exports.update = async (req, res) => {
    let { id } = req.params
    const { location } = req.body.listing;
    let lat = req.body.listing.lat;
    let lng = req.body.listing.lng;

    let geometry;
    if (lat && lng) {
    geometry = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
    } else {
    geometry = await geocodeLocation(location);
    }
    if (!req.body.listing) {
        throw new ExpressError("Update failed: No data provided", 400, "https://img.freepik.com/free-vector/loading-concept-illustration_114360-1057.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740")
    }
    const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    updated.geometry = geometry || listing.geometry;


    if (req.file) {
    updated.image = {
        url: req.file.path,
        filename: req.file.filename
    };
} else if (req.body.listing.image && req.body.listing.image.url) {
    // User did NOT upload a new image; retain old one
    updated.image = {
        url: req.body.listing.image.url,
        filename: req.body.listing.image.filename
    };
} else {
    // Optional: fallback if no image at all (avoid blank)
    updated.image = {
        url: "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
        filename: "default"
    };
}

    if (!updated) {
        throw new ExpressError("Listing to update not found", 404, "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-25063.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740");
    }
     await updated.save();
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)

}

module.exports.destroy = async (req, res) => {
    let { id } = req.params
    let delListing = await Listing.findByIdAndDelete(id)
    if (!delListing) {
        throw new ExpressError("Listing to delete not found", 404, "https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150570252.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740");
    }
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")
}

module.exports.renderShowForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    }).populate("owner")
    if (!listing) {
        throw new ExpressError("Listing not found", 404, "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740");
    }
    res.render("./listings/show.ejs", { listing })
}