import { Request, Response } from "express";
import Otp from "../models/OtpModel";
import User from "../models/User";

export const validateResetOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and OTP code are required");
  }

  // Check for a matching OTP record meant for password reset
  const otpRecord = await Otp.findOne({ email, code, purpose: "reset" });

  if (!otpRecord) {
    res.status(400);
    throw new Error("Invalid or expired OTP code");
  }

  // Check expiration
  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    res.status(400);
    throw new Error("OTP code has expired");
  }

  // Ensure the user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete OTP after validation
  await Otp.deleteOne({ _id: otpRecord._id });

  // Respond that OTP is valid and password reset can proceed
  res.status(200).json({
    success: true,
    message: "OTP verified successfully. You can now reset your password.",
  });
};
