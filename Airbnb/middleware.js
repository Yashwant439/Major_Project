const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ExpressError = require("./public/utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
module.exports.isLoggedIn = (customMessage = "You must be logged in") => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl
      req.flash("error", customMessage);
      return res.redirect("/login");
    }
    next();
  };
};


module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next()
}


module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params
  let listing = await Listing.findById(id)
  if(!listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error", "Permission Needed")
    return res.redirect(`/listings/${id}`)
  }
  next()

}



//validate the schema 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    // console.log(error._original.listing)
    if (error) {
        throw new ExpressError(error, 400, "https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527142.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740")
    } else {
        next()
    }

}

//validate Review
module.exports.validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body)
    // console.log(error._original.review)
    if(error){
        throw new ExpressError(error,400,"https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527142.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740")
    }else{
        next()
    }
    
}



module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id ,reviewId} = req.params
  let review = await Review.findById(reviewId)
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You are not the author")
    return res.redirect(`/listings/${id}`)
  }
  next()

}