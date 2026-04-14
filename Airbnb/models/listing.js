const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 5000,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        filename: String,
    },
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 1000000,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
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
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Compound indexes for better query performance
listingSchema.index({ owner: 1, createdAt: -1 });
listingSchema.index({ category: 1, price: 1 });
listingSchema.index({ location: 'text', title: 'text', description: 'text' });

// 2D sphere index for geospatial queries
listingSchema.index({ geometry: '2dsphere' });

// Cleanup reviews when listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);