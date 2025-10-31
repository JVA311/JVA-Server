import { Request, Response } from "express";
import User from "../models/Mandate";
import Otp from "../models/OtpModel";
import sendForgotPasswordEmail from "../utils/sendForgotPasswordEmail";

export const sendResetPasswordOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400)
    throw new Error("Email is required");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404)
    throw new Error("User not found");
  }

  // Generate a 6-digit OTP as a string
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP (overwrite old one if it exists)
  await Otp.findOneAndUpdate(
    { email, purpose: "reset" },
    {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    },
    { upsert: true, new: true }
  );

  // Send OTP to user’s email
  await sendForgotPasswordEmail(email, user.fullName, otpCode);

  res.status(200).json({
    success: true,
    message: "OTP has been sent to your email for password reset.",
  });
};
