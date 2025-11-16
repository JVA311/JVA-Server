import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import Mandate from "../models/Mandate";
import ResetToken from "../models/PasswordResetToken";

export const verifyPasswordOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Email and OTP are required",
      });
    }

    const LandOwnerName = await LandOwner.findOne({ email });
    const MandateName = await Mandate.findOne({ email });
    const InvestorName = await Investor.findOne({ email });

    // Find user
    let user = LandOwnerName || MandateName || InvestorName;

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "Email not found" });
    }

    // Find OTP
    const tokenRecord = await ResetToken.findOne({
      userId: user._id,
      otp,
    });

    if (!tokenRecord) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Invalid OTP" });
    }

    if (tokenRecord.expiresAt < new Date()) {
      await ResetToken.deleteMany({ userId: user._id });
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "OTP expired" });
    }

    // Delete OTP to prevent reuse
    await ResetToken.deleteMany({ userId: user._id });

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "OTP verified, proceed to reset password",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Server Error" });
  }
};
