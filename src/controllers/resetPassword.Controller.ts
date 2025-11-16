import { Request, Response } from "express";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import Mandate from "../models/Mandate";
import { StatusCodes } from "http-status-codes";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Email and new password are required",
      });
    }

    // Check user across the 3 models
    const landOwnerName = await LandOwner.findOne({ email });
    const mandateName = await Mandate.findOne({ email });
    const investorName = await Investor.findOne({ email });

    const user = landOwnerName || mandateName || investorName;

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Email not found",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Server Error",
    });
  }
};
