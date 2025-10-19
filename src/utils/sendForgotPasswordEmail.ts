import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

require("dotenv").config();

const transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT as unknown as number,
  host: process.env.SMTP_HOST,
  secure: false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

const sendForgotPasswordEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  const templatePath = path.join(__dirname, "../templates/forgotPassword.ejs");

  const html = await ejs.renderFile(templatePath, { name, otp });

  await transporter.sendMail({
    from: `"Joint Venture Assets" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html,
  });
};

export default sendForgotPasswordEmail;
