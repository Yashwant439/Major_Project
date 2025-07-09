
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const ExpressError = require("./public/utils/ExpressError.js");


const { sendBookingConfirmation } = require("./public/utils/email");


const dbUrl = process.env.ATLASDB_URL
// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust"


// Database connection
mongoose.connect(dbUrl)
.then(() => console.log("DB connected"))
.catch(err => console.log("DB connection error:", err));

// Passport setup
require("./passport-setup.js");

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//mongo session
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SESSION_SECRET ,
  },
  touchAfter: 24*3600 ,
})

store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE ",err)
})

// Session configuration
app.use(session({
  store,
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
}));

// Passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const authRoutes = require("./routes/auth.js");
const bookingRoutes = require("./routes/booking.js");

app.use("/", authRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/listings/:id", bookingRoutes); // Add this line


// 404 handler
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found",404,"https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740"));
});

// Error handler
app.use((err, req, res, next) => {
  let{message,statusCode=500,imgPath= "https://img.freepik.com/free-vector/tiny-people-examining-operating-system-error-warning-web-page-isolated-flat-illustration_74855-11104.jpg?ga=GA1.1.122485610.1750443875&semt=ais_hybrid&w=740"} =err
  res.status(statusCode).render("error.ejs", { message,imgPath });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

