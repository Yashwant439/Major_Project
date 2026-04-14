const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: /.+\@.+\..+/,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: "Listing",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  lastLogin: Date,
}, { timestamps: true });

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 });

// Plugin for passport local strategy
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
  usernameQueryFields: ['email'], // allow login with email
});

module.exports = mongoose.model("User", userSchema);