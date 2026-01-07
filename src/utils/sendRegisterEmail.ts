const nodemailer = require("nodemailer");
import ejs from "ejs";
import path from "path";

require("dotenv").config();

const sendRegisterEmail = async (email: string, name: string) => {
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

  // Load the HTML template
  const templatePath = path.join(__dirname, "../templates/register.ejs");
  const htmlMessage = await ejs.renderFile(templatePath, {
    name,
    link: "https://www.jointventureassets.com",
  });

  // Email options
  const mailOptions = {
    from: `"Joint Venture Assets" <${process.env.GMAIL}>`,
    to: email,
    subject: "Welcome to Joint Venture Assets 🎉",
    html: htmlMessage,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

export default sendRegisterEmail;
