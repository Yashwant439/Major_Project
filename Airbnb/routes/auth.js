const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/auth.js");
const wrapAsync = require("../public/utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const authController = require("../controllers/auths.js")


router
  .route("/register")
  .get(authController.renderRegistrationForm )
  .post(saveRedirectUrl, wrapAsync(authController.handleRegistration))


router
  .route("/login")
  .get(authController.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Invalid username or password"
}), authController.handleLocalLogin)

// Google OAuth
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Google callback
router.get("/auth/google/callback",saveRedirectUrl, passport.authenticate("google", {
  failureRedirect: "/login",
  failureFlash: "Google login failed"
}), authController.handleGoogleLogin);

// Logout
router.get("/logout", authController.logout);

module.exports = router;