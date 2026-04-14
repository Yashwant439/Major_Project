const nodemailer = require("nodemailer");

let cachedTransporter = null;

const getTransporter = () => {
    if (cachedTransporter) return cachedTransporter;

    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || 587);
    const user = process.env.EMAIL_USER;
    const pass = (process.env.EMAIL_PASSWORD || "").replace(/\s+/g, "");

    if (!host || !user || !pass) {
        throw new Error("Email service is not configured properly");
    }

    cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure: process.env.EMAIL_SECURE === "true",
        auth: { user, pass },
    });

    return cachedTransporter;
};

const sendBookingConfirmation = async (booking) => {
    try {
        const transporter = getTransporter();

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmed - WanderLust</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #f5f5f5 0%, #efefef 100%);
              padding: 20px 0;
            }
            .wrapper {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #ff385c 0%, #e31c5f 50%, #bd1e59 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -10%;
              width: 300px;
              height: 300px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
            }
            .header h1 { 
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 5px;
              position: relative;
              z-index: 1;
            }
            .header p {
              font-size: 14px;
              opacity: 0.95;
              position: relative;
              z-index: 1;
            }
            .hero-section {
              width: 100%;
              height: 250px;
              background: linear-gradient(135deg, rgba(255,56,92,0.1), rgba(227,28,95,0.05));
              position: relative;
              overflow: hidden;
            }
            .hero-section img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .hero-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(to right, rgba(255,56,92,0.2), transparent);
            }
            .content {
              padding: 40px 30px;
              color: #222;
            }
            .greeting {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 15px;
              color: #ff385c;
            }
            .description {
              color: #666;
              line-height: 1.8;
              margin-bottom: 30px;
              font-size: 15px;
            }
            .property-info {
              background: #f8f8f8;
              border-left: 4px solid #ff385c;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .property-name {
              font-size: 18px;
              font-weight: 700;
              color: #222;
              margin-bottom: 8px;
            }
            .property-location {
              color: #666;
              font-size: 14px;
              margin-bottom: 12px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-item {
              background: #f8f8f8;
              padding: 18px;
              border-radius: 8px;
              transition: all 0.3s ease;
            }
            .detail-item:hover {
              background: #f0f0f0;
              transform: translateY(-2px);
            }
            .detail-label {
              color: #999;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
              margin-bottom: 6px;
            }
            .detail-value {
              font-size: 16px;
              font-weight: 700;
              color: #222;
            }
            .guests-icon { 
              margin-right: 5px; 
              color: #ff385c;
            }
            .price-section {
              background: linear-gradient(135deg, #ff385c 0%, #e31c5f 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              box-shadow: 0 10px 30px rgba(255,56,92,0.2);
            }
            .price-label {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1px;
              opacity: 0.95;
            }
            .price-amount {
              font-size: 28px;
              font-weight: 800;
            }
            .action-section {
              text-align: center;
              margin-bottom: 30px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #ff385c 0%, #e31c5f 100%);
              color: white;
              padding: 14px 40px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 15px;
              box-shadow: 0 10px 25px rgba(255,56,92,0.2);
              transition: all 0.3s ease;
              display: inline-block;
            }
            .cta-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 15px 35px rgba(255,56,92,0.3);
            }
            .info-box {
              background: #f0f8ff;
              border-left: 4px solid #4285f4;
              padding: 18px;
              border-radius: 8px;
              margin-bottom: 30px;
              font-size: 14px;
              color: #333;
              line-height: 1.7;
            }
            .info-box strong {
              color: #222;
              display: block;
              margin-bottom: 8px;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #ddd, transparent);
              margin: 30px 0;
            }
            .footer-section {
              background: #f8f8f8;
              padding: 30px;
              border-top: 1px solid #e0e0e0;
            }
            .footer-content {
              font-size: 13px;
              color: #666;
              line-height: 1.8;
            }
            .footer-logo {
              display: inline-block;
              color: #ff385c;
              font-weight: 700;
              margin-bottom: 10px;
            }
            .socials {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            .social-link {
              display: inline-block;
              width: 32px;
              height: 32px;
              background: #ff385c;
              border-radius: 50%;
              text-align: center;
              line-height: 32px;
              color: white;
              text-decoration: none;
              margin-right: 8px;
              font-size: 14px;
            }
            .social-link:hover {
              background: #e31c5f;
            }
            .copyright {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #e0e0e0;
              color: #999;
              font-size: 12px;
            }
            @media (max-width: 600px) {
              .details-grid { grid-template-columns: 1fr; }
              .price-section { flex-direction: column; text-align: center; }
              .header h1 { font-size: 24px; }
              .content { padding: 25px 20px; }
              .hero-section { height: 180px; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <!-- Header -->
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p>Get ready for an amazing experience</p>
            </div>

            <!-- Hero Image -->
            ${booking.listing.image && booking.listing.image.url ? `
            <div class="hero-section">
              <img src="${booking.listing.image.url}" alt="Property">
              <div class="hero-overlay"></div>
            </div>
            ` : ''}

            <!-- Main Content -->
            <div class="content">
              <p class="greeting">Hello ${booking.user ? booking.user.username : 'Traveler'}! 👋</p>
              <p class="description">
                Your payment has been successfully processed. We're thrilled to welcome you to 
                <strong>${booking.listing.title}</strong> in <strong>${booking.listing.location}</strong>. 
                Get ready for an unforgettable stay!
              </p>

              <!-- Property Details -->
              <div class="property-info">
                <div class="property-name">
                  <i style="color: #ff385c; margin-right: 8px;">📍</i>${booking.listing.title}
                </div>
                <div class="property-location">
                  <i style="color: #ff385c; margin-right: 8px;">🌍</i>${booking.listing.location}, ${booking.listing.country}
                </div>
              </div>

              <!-- Booking Details -->
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-label">📅 Check-in</div>
                  <div class="detail-value">${new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">📅 Check-out</div>
                  <div class="detail-value">${new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">👥 Guests</div>
                  <div class="detail-value"><span class="guests-icon">👤</span>${booking.guests}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">🌙 Nights</div>
                  <div class="detail-value">${Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights</div>
                </div>
              </div>

              <!-- Price Summary -->
              <div class="price-section">
                <div class="price-label">Total Amount Paid</div>
                <div class="price-amount">₹${booking.totalPrice.toLocaleString("en-IN")}</div>
              </div>

              <!-- Info Box -->
              <div class="info-box">
                <strong>📌 What's Next?</strong>
                View your reservation details, contact the host, and manage your booking through your dashboard.
              </div>

              <!-- CTA Button -->
              <div class="action-section">
                <a href="http://localhost:8080/dashboard" class="cta-button">View Reservation →</a>
              </div>

              <p class="description" style="text-align: center; font-style: italic; font-size: 13px; color: #999;">
                📞 Need help? Contact our support team or reach out to your host directly.
              </p>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <div class="footer-logo">✈️ WanderLust</div>
              <div class="footer-content">
                <p>Your trusted platform for booking unique stays worldwide. We're committed to making your travels memorable and hassle-free.</p>
              </div>
              <div class="socials">
                <a href="#" class="social-link" title="Facebook">f</a>
                <a href="#" class="social-link" title="Twitter">𝕏</a>
                <a href="#" class="social-link" title="Instagram">📷</a>
                <a href="#" class="social-link" title="LinkedIn">in</a>
              </div>
              <div class="copyright">
                &copy; ${new Date().getFullYear()} WanderLust. All rights reserved. | 
                <a href="#" style="color: #ff385c; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #ff385c; text-decoration: none;">Terms of Service</a>
              </div>
            </div>
          </div>
        </body>
        </html>
        `;

        const recipient = booking.email || (booking.user && booking.user.email);
        if (!recipient) {
            throw new Error("Booking confirmation email recipient missing");
        }

        await transporter.sendMail({
            from: `"WanderLust" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: recipient,
            subject: `🎉 Confirmed: ${booking.listing.title} | ${new Date(booking.checkIn).toLocaleDateString('en-IN')} to ${new Date(booking.checkOut).toLocaleDateString('en-IN')}`,
            html: htmlTemplate
        });
    } catch (err) {
        console.error("Error sending confirmation email:", err);
    }
};

module.exports = { sendBookingConfirmation };
