require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");
const multer = require("multer");
const ExpressError = require("./public/utils/ExpressError.js");
const { setCommonLocals } = require("./middleware.js");

const dbUrl = process.env.ATLASDB_URL;

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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
        "https://cdn.jsdelivr.net", "https://unpkg.com",
        "https://checkout.razorpay.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'",
        "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://nominatim.openstreetmap.org",
        "https://api.razorpay.com", "https://lux-widget.razorpay.com",
        "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Core middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Custom mongo sanitize (Express 5 compatible - req.query is read-only)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
});

// Mongo session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session configuration
app.use(session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

// Passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Flash messages & current user middleware
app.use(setCommonLocals);

// Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const authRoutes = require("./routes/auth.js");
const bookingRoutes = require("./routes/booking.js");
const wishlistRoutes = require("./routes/wishlist.js");
const dashboardRoutes = require("./routes/dashboard.js");

app.use("/", authRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/listings/:id", bookingRoutes);
app.use("/", wishlistRoutes);
app.use("/", dashboardRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message, err.stack);
  if (err instanceof multer.MulterError) {
    err.statusCode = 400;
    err.message = err.code === "LIMIT_FILE_SIZE"
      ? "Image size should be under 5MB"
      : err.message;
  }
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.code === 11000) {
    err.statusCode = 409;
    err.message = "Duplicate value found. Please use different details.";
  }
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

// Start server
console.log("Google Callback URL:-",process.env.GOOGLE_CALLBACK_URL);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
