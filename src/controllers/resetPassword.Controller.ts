import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400);
    throw new Error("Email and new password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully. You can now log in.",
  });
};
