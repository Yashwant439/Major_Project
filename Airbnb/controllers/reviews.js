const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const ExpressError = require("../public/utils/ExpressError.js")

module.exports.create=async(req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${id}`)
}


module.exports.renderEditReviewForm = async(req,res)=>{
    let {id,reviewId} = req.params
    let listing =await Listing.findById(id)
    let review = await Review.findById(reviewId)
    if (!review) {
            throw new ExpressError("Cannot edit a non-existing review", 404, "https://clipart-library.com/data_images/208821.png");
        }
    // console.log(review)

    res.render("./listings/editReview",{listing,review})
}

module.exports.update =async(req,res)=>{
    let {id,reviewId} = req.params
    let listing =await Listing.findById(id)
    let review = await Review.findById(reviewId)
    if (!req.body.review) {
            throw new ExpressError("Update failed: No data provided", 400, "https://img.freepik.com/free-vector/loading-concept-illustration_114360-1057.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740")
        }
    const updated = await Review.findByIdAndUpdate(reviewId, { ...req.body.review, updatedAt: new Date() },{ new: true })
    if (!updated) {
        throw new ExpressError("Review to update not found", 404, "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-25063.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740");
    }
    req.flash("success","Review Updated!")

    res.redirect(`/listings/${id}`)
}

module.exports.destroy = async(req,res)=>{
    let {id,reviewId} = req.params

    let delReview = await Review.findByIdAndDelete(reviewId)
    let delLi = await Listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewId } })
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`)

    
}