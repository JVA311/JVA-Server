import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Opt from "../models/OtpModel";
import { sendOtpEmail } from "../utils/sendOtpEmail";

// ✅ Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, comfirmPassword } = req.body;

  if (!fullName || !email || !password || !comfirmPassword) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (password !== comfirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  // Check if user already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  // Generate and send OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Opt.create({
    email,
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtpEmail(email, otpCode);

  res.status(201).json({
    status: true,
    message: "User registered. OTP sent.",
  });
};
