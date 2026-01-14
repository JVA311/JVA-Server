import { Request, Response } from "express";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import Mandate from "../models/Mandate";
import ResetToken from "../models/PasswordResetToken";
import { generateResetPasswordOtp } from "../utils/generateResetPasswordOtp";
import { StatusCodes } from "http-status-codes";
import sendForgotPasswordEmail from "../utils/sendForgotPasswordEmail";

export const requestPasswordOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email is required" });
    }

    const LandOwnerName = await LandOwner.findOne({ email });
    const MandateName = await Mandate.findOne({ email });
    const InvestorName = await Investor.findOne({ email });

    if (!LandOwnerName && !MandateName && !InvestorName) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "Email not found" });
    }

    // Identify the actual user & role
    let user: any = null;
    let selectedModel = "";

    if (LandOwnerName) {
      user = LandOwnerName;
      selectedModel = "LandOwner";
    } else if (MandateName) {
      user = MandateName;
      selectedModel = "Mandate";
    } else if (InvestorName) {
      user = InvestorName;
      selectedModel = "Investor";
    }

    // Generate the otp
    const { otp, expiresAt } = generateResetPasswordOtp();

    try {
      // Save otp to DB
      await ResetToken.create({
        userId: user._id,
        role: selectedModel,
        otp,
        expiresAt,
      });
    } catch {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Error saving OTP. Please try again.",
      });
    }

    // Send otp to user's email
    await sendForgotPasswordEmail(email, otp);

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "otp sent, check your email",
    });
  } catch (error) {
    console.error("Error in requestPasswordOtp:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Server Error", error });
  }
};
