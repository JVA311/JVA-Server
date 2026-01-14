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
  const templatePath = path.join(__dirname, "../templates/forgotPassword.ejs");

  const html = await ejs.renderFile(templatePath, { otp });

  mailtrap
  .send({
    from: { name: "Joint Venture Assets", email: "info@jointventureassets.com" },
    to: [{ email: userEmail }],
    subject: "Otp Token",
    html
  })
};

export default sendForgotPasswordEmail;
