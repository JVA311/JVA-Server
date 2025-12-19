import { Request, Response } from "express";
import LandOwnerModel from "../../models/LandOwner";
import MandateModel from "../../models/Mandate";
import InvestorModel from "../../models/Investor";
import { StatusCodes } from "http-status-codes";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const landOnwers = await LandOwnerModel.find();
    const mandates = await MandateModel.find();
    const investors = await InvestorModel.find();

    const users = [
      ...landOnwers,
      ...mandates,
      ...investors,
    ];

    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to fetch users",
    });
  }
};
