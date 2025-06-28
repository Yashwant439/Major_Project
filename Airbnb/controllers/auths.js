const User = require("../models/auth");

module.exports.renderRegistrationForm = (req, res) => {
  res.render("listings/register.ejs");
}
module.exports.handleRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or email already exists");
      return res.redirect("/register");
    }

    const user = new User({ username, email });
    await User.register(user, password);
    
    req.login(user, (err) => {
      if (err) {
        req.flash("error", "Auto-login failed. Please login manually");
        return res.redirect("/login");
      }
      req.flash("success", "Registration successful!");
      let redirectUrl = res.locals.redirectUrl || "/listings"
      res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render("listings/login.ejs",);
}

module.exports.handleLocalLogin =((req, res) => {
  req.flash("success", "Login successful!");
  let redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl);
})

module.exports.handleGoogleLogin = (req, res) => {
  req.flash("success", "Google login successful!");
  let redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res,next) => {
  req.logout((err) => {
    if(err){return next(err)}
    req.flash("success", "You've been logged out");
    res.redirect("/login");
  });
}