require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');

// ── Rate Limiters ──────────────────────────────────────────
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: 'Too many contact attempts, please try again later'
});

const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: JSON.stringify({ reply: 'Too many requests, slow down a bit!' })
});

// ── View Engine ────────────────────────────────────────────
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Middleware ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // needed for /chat endpoint

// ── Sessions + Flash ───────────────────────────────────────
app.use(session({
    secret: process.env.SECRET || "PhirHeraPheri",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg   = req.flash('error_msg');
    next();
});

// ── Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.render("pages/home");
});

// ── Contact / Email Route ──────────────────────────────────
app.post('/contact', emailLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        req.flash('error_msg', 'All fields are required');
        return res.redirect('/#contact');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash('error_msg', 'Invalid email format');
        return res.redirect('/#contact');
    }

    // Only attempt if credentials are configured
    if (!process.env.EMAIL_USER || !process.env.PASSKEY || process.env.PASSKEY === 'your_gmail_app_password_here') {
        req.flash('error_msg', 'Email service not configured. Please contact directly at yashwantkumarsingh439@gmail.com');
        return res.redirect('/#contact');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSKEY
            }
        });

        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `[Portfolio] ${subject} — from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        });

        req.flash('success_msg', 'Your message has been sent successfully!');
        res.redirect('/#home');
    } catch (err) {
        console.error('Mail error:', err.message);
        req.flash('error_msg', 'Failed to send message. Please email directly at yashwantkumarsingh439@gmail.com');
        res.redirect('/#home');
    }
});

// ── YAVIS — AI Chat Endpoint (Groq) ───────────────────────
app.post('/chat', chatLimiter, async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.json({ reply: "Please type a message first!" });
    }

    if (!process.env.GROQ_API_KEY) {
        return res.json({ reply: "YAVIS is offline right now. Check back soon!" });
    }

    const systemPrompt = `You are YAVIS (Yashwant's AI Virtual Intelligence System) — the personal AI assistant embedded in Yashwant Kumar Singh's developer portfolio.

Your personality: witty, helpful, enthusiastic about tech and building things. You keep answers concise (2–4 sentences max) and conversational.

About Yashwant:
- Full name: Yashwant Kumar Singh
- Role: AI Builder & Full-Stack Web Developer
- Location: New Delhi, India 🇮🇳
- Education: B.Tech Computer Science 2024–2028 | JEE 94th percentile | WBJEE Rank 3060
- Skills: JavaScript, React, Node.js, Express, MongoDB, MySQL, Python, AI APIs, Prompt Engineering, HTML5, CSS3, Tailwind CSS, Bootstrap, Git, Vercel, Render
- Projects: Advanced Diabetes Patient Management System (AI/ML + React + Python), Wanderlust Travel Explorer (Node + MongoDB), CVWizaard Resume Builder (React + Framer Motion), SkyCast Weather App (React + API), E-Commerce Clone (HTML/CSS)
- Internship: GB Pant Institute, Okhla — building React.js pages for Result ERP Portal
- GitHub: github.com/Yashwant439
- LinkedIn: linkedin.com/in/yashwantkumarsingh
- Email: yashwantkumarsingh439@gmail.com
- Philosophy: "I don't care log ky kahenge, I care logs() ky kahenge" 😄
- Currently building: AI Developer Assistant (65%), SaaS Developer Tools Platform (30%)
- Open to: internships, collaborations, hackathons, freelance work

If someone asks something outside portfolio topics, gently redirect them. Keep it fun and real.`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message.trim() }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            let errorText = await response.text();
            try {
                const parsed = JSON.parse(errorText);
                errorText = parsed.error?.message || errorText;
            } catch (e) {}
            throw new Error(`Groq API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Hmm, I didn't catch that. Try asking again!";
        res.json({ reply });

    } catch (err) {
        console.error('YAVIS error:', err.message);
        res.json({ reply: `Connection Error: ${err.message}` });
    }
});

// ── Start Server ───────────────────────────────────────────
app.listen(3000, () => {
    console.log("🚀 Yashwant Labs running at http://localhost:3000");
});