const nodemailer = require("nodemailer");

require("dotenv").config();

export const sendOtpEmail = async (email: string, otp: string) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    secure: false, // true for 465, false for 587/2525
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS,
    },
  });
  // Send email
  await transporter.sendMail({
    from: `"Joint Venture Assets" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });
};
