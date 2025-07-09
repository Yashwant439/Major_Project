const nodemailer = require("nodemailer");

const sendBookingConfirmation = async (booking) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"WanderLust" <${process.env.EMAIL_FROM}>`,
            to: booking.email,
            subject: "Booking Confirmation",
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Thank you for your booking. Here are your details:</p>
                <ul>
                    <li><strong>Property:</strong> ${booking.listing.title}</li>
                    <li><strong>Dates:</strong> ${booking.checkIn.toDateString()} <strong> to </strong> ${booking.checkOut.toDateString()}</li>
                    <li><strong>Guests:</strong> ${booking.guests}</li>
                    <li><strong>Total Price:</strong> ₹${booking.totalPrice.toLocaleString("en-IN")}</li>
                </ul>
                <p>We look forward to hosting you!</p>
            `
        });
    } catch (err) {
        console.error("Error sending confirmation email:", err);
        // You might want to implement retry logic or notification here
    }
};

module.exports = { sendBookingConfirmation };