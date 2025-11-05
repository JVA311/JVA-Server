import { Request, Response } from "express";
import User from "../models/Mandate";
import Otp from "../models/OtpModel";
import sendForgotPasswordEmail from "../utils/sendForgotPasswordEmail";
import { StatusCodes } from "http-status-codes";

export const sendResetPasswordOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a 6-digit OTP as a string
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (overwrite old one if it exists)
    const result = await Otp.findOneAndUpdate(
      { email, purpose: "reset" },
      {
        code: otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
      { upsert: true, new: true }
    );

    if (!result) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to generate OTP. Please try again.",
      });
    }

    // Send OTP to user’s email
    await sendForgotPasswordEmail(email, user.fullName, otpCode);

    res.status(200).json({
      status: true,
      message: "OTP has been sent to your email for password reset.",
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};
