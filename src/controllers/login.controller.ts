import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Mandate from "../models/Mandate";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import admin from "../config/firebaseAdmin";

interface IUserInfo {
  fullName?: string;
  email: string;
  password?: string;
  role?: string;
  category?: string;
  googleToken?: string;
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, googleToken, role, category } =
      req.body as IUserInfo;

    let user;

    // google auth login

    if (googleToken) {
      let decoded;
      try {
        decoded = await admin.auth().verifyIdToken(googleToken);
      } catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          message: "Invalid Google token",
        });
      }
      const googleEmail = decoded?.email;
      const googleName = decoded?.name;

      // Check user in database
      const landOwnerUser = await LandOwner.findOne({ email: googleEmail });
      const mandateUser = await Mandate.findOne({ email: googleEmail });
      const investorUser = await Investor.findOne({ email: googleEmail });

      user = landOwnerUser || mandateUser || investorUser;

      if (!user) {
        user = await LandOwner.create({
          fullName: googleName || "",
          email: googleEmail,
          role,
          category,
          isVerified: true,
        });
      }
    } else {
      // NORMAL EMAIL + PASSWORD LOGIN

      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Please provide both email and password",
        });
      }

      // Try to find user in each collection
      const landOwnerUser = await LandOwner.findOne({ email });
      const mandateUser = await Mandate.findOne({ email });
      const investorUser = await Investor.findOne({ email });

      user = landOwnerUser || mandateUser || investorUser;

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user?._id, role: user?.role, category: user?.category },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Send response
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Login successful",
      user: {
        id: user?._id,
        fullName: user?.fullName,
        email: user?.email,
        role: user?.role,
        category: user?.category,
      },
      token,
    });
  } catch (error: any) {
    console.error("Error during login:", error?.message || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Login failed",
    });
  }
};
