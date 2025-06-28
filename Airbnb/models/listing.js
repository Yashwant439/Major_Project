
const mongoose= require("mongoose")
const Schema = mongoose.Schema
const Review= require('./review.js')

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [0, 0]
        }
    },
    category: {
    type: String,
    enum: [
      "Trending",
      "Room",
      "Amazing Views",
      "Surfing",
      "Amazing Pools",
      "Beach",
      "Cabins",
      "Mountain",
      "Iconic Cities"
    ],
    default: "Trending",
  },
    

})


listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id: {$in : listing.reviews} })
})


const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing