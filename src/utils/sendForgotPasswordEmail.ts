import ejs from "ejs";
import path from "path";

import { MailtrapClient } from "mailtrap"

require("dotenv").config();

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY as string,
})

const sendForgotPasswordEmail = async (
  userEmail: string,
  otp: string
) => {
  // const templatePath = path.join(__dirname, "../templates/forgotPassword.ejs");

  mailtrap
  .send({
    from: { name: "Joint Venture Assets", email: "info@jointventureassets.com" },
    to: [{ email: userEmail }],
    subject: "Otp Token",
    html: `<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
      <p>You requested to reset your password.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you didn’t request this, please ignore this email.</p>
      <p>— The Joint Venture Assets Team</p>
    </div>
  </body>`
  })
};

export default sendForgotPasswordEmail;
