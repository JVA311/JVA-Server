import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import Mandate from "../models/Mandate";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if fields are provided
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "Please provide both email and password"
    });
  }

  // Try to find user in each collection
  const landOwnerUser = await LandOwner.findOne({ email });
  const mandateUser = await Mandate.findOne({ email });
  const investorUser = await Investor.findOne({ email });
  
  // Determine which user type was found
  const user = landOwnerUser || mandateUser || investorUser;
  
  // If no user found with this email
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: false,
      message: "User not found"
    });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: "Invalid credentials"
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role, category: user.category },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Send response
  return res.status(StatusCodes.OK).json({
    status: true,
    message: "Login successful",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      category: user.category,
    },
    token,
  });
};
