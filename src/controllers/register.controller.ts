import { Request, Response } from "express";
import Mandate from "../models/Mandate";
import LandOwner from "../models/LandOwner";
import Investor from "../models/Investor";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import sendRegisterEmail from "../utils/sendRegisterEmail";

interface IUserInfo {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  category: string;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, confirmPassword, role, category } =
      req.body as IUserInfo;

    // Check if email already exists
    const LandOwnerEmail = await LandOwner.findOne({ email });
    const MandateEmail = await Mandate.findOne({ email });
    const InvestorEmail = await Investor.findOne({ email });

    if (LandOwnerEmail || MandateEmail || InvestorEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Email already in use",
      });
    }

    // Check if fullName already exists
    const LandOwnerName = await LandOwner.findOne({ fullName });
    const MandateName = await Mandate.findOne({ fullName });
    const InvestorName = await Investor.findOne({ fullName });

    if (LandOwnerName || MandateName || InvestorName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Full name already in use",
      });
    }

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !category
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Please fill in all fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Passwords do not match",
      });
    }

    // Map role to corresponding model
    const roleModelMap: Record<
      string,
      typeof LandOwner | typeof Investor | typeof Mandate
    > = {
      Landowner: LandOwner,
      Investor: Investor,
      Mandate: Mandate,
    };

    const UserModel = roleModelMap[role];

    if (!UserModel) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Invalid role specified",
      });
    }

    const user = await (UserModel as any).create({
      fullName,
      email,
      password,
      role,
      category,
    });

    // generate JWT token for auto-login
    const token = jwt.sign(
      { id: user._id, role: user.role, category: user.category },
      process.env.JWT_SECRET!,
      { expiresIn: "12h" }
    );

    // Send welcome email
    try {
      await sendRegisterEmail(email, fullName);
    } catch (error) {
      await (UserModel as any).deleteOne({ _id: user._id });
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Something went wrong",
      });
    }

    return res.status(StatusCodes.CREATED).json({
      status: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        category: user.category,
      },
      token,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Server Error",
    });
  }
};
