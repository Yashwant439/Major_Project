const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/auth");
require("dotenv").config();

// Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      const crypto = require("crypto");
      const randomSuffix = crypto.randomBytes(3).toString("hex");
      
      let emailObj = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `noemail_${randomSuffix}@google.com`;
      let baseUsername = profile.displayName ? profile.displayName.replace(/\s+/g, '').toLowerCase() : emailObj.split('@')[0];
      
      user = new User({
        googleId: profile.id,
        username: `${baseUsername}_${randomSuffix}`,
        email: emailObj
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Session setup
passport.serializeUser((user, done) => {
  if (!user || !user._id) {
    return done(new Error("Invalid user object for serialization"));
  }
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!id) {
      return done(null, null);
    }
    const user = await User.findById(id);
    if (!user) {
      return done(null, null);
    }
    done(null, user);
  } catch (err) {
    console.error("Deserialization error:", err);
    done(null, null);
  }
});
