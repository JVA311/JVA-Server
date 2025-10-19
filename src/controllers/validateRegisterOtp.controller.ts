import { Request, Response } from "express";
import User from "../models/User";
import Otp from "../models/OtpModel";
import sendRegisterEmail from "../utils/sendRegisterEmail";

export const validateRegisterOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and OTP code are required");
  }

   const otpRecord = await Otp.findOne({ email, code, purpose: "register" });
  if (!otpRecord) {
    res.status(400);
    throw new Error("Invalid OTP code");
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: otpRecord._id });
    res.status(400);
    throw new Error("OTP code has expired");
  }
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404)
    throw new Error("User not found");
  }

  // Mark user as verified
  user.isVerified = true;
  await user.save();

  // Delete OTP and send welcome email
  await Otp.deleteOne({ _id: otpRecord._id });

  await sendRegisterEmail(email, user.fullName);

  res.status(200).json({ success: true, message: "OTP verified successfully" });
};
