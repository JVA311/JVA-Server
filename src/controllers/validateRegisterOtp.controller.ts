import { Request, Response } from "express";
import User from "../models/Mandate";
import Otp from "../models/OtpModel";
import sendRegisterEmail from "../utils/sendRegisterEmail";
import { StatusCodes } from "http-status-codes";

export const validateRegisterOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Email and OTP code are required" });
    }

    const otpRecord = await Otp.findOne({ email, code, purpose: "register" });
    if (!otpRecord) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Invalid OTP code" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "OTP code has expired" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "User not found" });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete OTP and send welcome email
    await Otp.deleteOne({ _id: otpRecord._id });

    await sendRegisterEmail(email, user.fullName);

    return res
      .status(StatusCodes.OK)
      .json({ status: true, message: "OTP verified successfully" });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Failed to validate OTP" });
  }
};
