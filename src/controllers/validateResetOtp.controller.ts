import { Request, Response } from "express";
import Otp from "../models/OtpModel";
import User from "../models/Mandate";
import { StatusCodes } from "http-status-codes";

export const validateResetOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Email and OTP code are required" });
    }

    // Check for a matching OTP record meant for password reset
    const otpRecord = await Otp.findOne({ email, code, purpose: "reset" });

    if (!otpRecord) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Invalid or expired OTP code" });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "OTP code has expired" });
    }

    // Ensure the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "User not found" });
    }

    // Delete OTP after validation
    await Otp.deleteOne({ _id: otpRecord._id });

    // Respond that OTP is valid and password reset can proceed
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Failed to validate OTP" });
  }
};
