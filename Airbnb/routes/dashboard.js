const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const dashboardController = require("../controllers/dashboard.js");

router.get("/dashboard", isLoggedIn("You must be logged in to view dashboard"), wrapAsync(dashboardController.renderDashboard));

module.exports = router;
