import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Otp from "../models/OtpModel";
import { sendOtpEmail } from "../utils/sendOtpEmail";

export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, comfirmPassword, } = req.body;

  if (!fullName || !email || !password || !comfirmPassword) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (password !== comfirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save or overwrite OTP
  await Otp.findOneAndUpdate(
    { email },
    {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  // ✅ Try-catch ONLY around email sending
  try {
    await sendOtpEmail(email, otpCode);
  } catch (error) {
    // Roll back user if email sending fails
    await User.findByIdAndDelete(newUser._id);
    res.status(500);
    throw new Error("Failed to send OTP. Please try again.");
  }

  res.status(201).json({
    status: true,
    message: "User registered successfully. OTP sent to email.",
  });
};
