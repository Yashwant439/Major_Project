const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
    index: true,
  },
  razorpayOrderId: {
    type: String,
    sparse: true,
    index: true,
  },
  razorpayPaymentId: {
    type: String,
    sparse: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { timestamps: true });

// Compound index for efficient booking lookups
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ listing: 1, paymentStatus: 1 });

// Validate checkOut is after checkIn
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    throw new Error('Check-out date must be after check-in date');
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);