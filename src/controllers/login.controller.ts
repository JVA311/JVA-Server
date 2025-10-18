import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if fields are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role, category: user.category },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Send response
  res.status(200).json({
    status: true,
    message: "Login successful",
    token,
  });
};
