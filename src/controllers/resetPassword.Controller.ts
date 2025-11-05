import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/Mandate";
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to reset password",
    });
  }
};
