const express = require("express")
const router = express.Router({ mergeParams: true })//kyu ki humlog params.id bhj rhe h isly post me

const wrapAsync = require(".././public/utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


router
    .route("/:reviewId")
    .put(isLoggedIn("Logg in required"),isReviewAuthor, wrapAsync(reviewController.update))
    .delete(isLoggedIn("You must be logged in to delete this review"),isReviewAuthor, wrapAsync(reviewController.destroy))

   
//create
router.post("/",isLoggedIn("You must be logged in to add a review"), validateReview, wrapAsync(reviewController.create))

//edit
router.get("/:reviewId/edit",isLoggedIn("You must be logged in to edit the review"),isReviewAuthor, wrapAsync(reviewController.renderEditReviewForm))

module.exports = router