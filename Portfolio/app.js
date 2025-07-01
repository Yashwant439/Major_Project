require('dotenv').config();
const express = require("express")
const app = express()
const path = require("path")
const ejsMate = require("ejs-mate");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many contact attempts, please try again later'
});
// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Set up sessions
app.use(session({
    secret: process.env.SECRET || "PhirHeraPheri",
    resave: false,
    saveUninitialized: true
}));

// Flash middleware
app.use(flash());

// Make flash messages accessible in all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get("/",(req,res)=>{
    res.render("pages/home")
})



// Your email route
app.post('/contact',emailLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/#contact');
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error_msg', 'Invalid email format');
        return res.redirect('/#contact');
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASSKEY // Not your real password
        },
        pool: true,
        maxConnections: 1,
        rateDelta: 20000, // 20 seconds between emails
        rateLimit: 5 // max 5 emails per rateDelta
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New message from ${name} - ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        req.flash('success_msg', 'Your message has been sent successfully!');
        res.redirect('/#home'); // redirect to contact section
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to send your message. Please try again later.');
        res.redirect('/#home');
    }
})

app.listen(3000,()=>{
    console.log("app is listening at port 3000")
})