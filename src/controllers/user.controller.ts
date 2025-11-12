import { Request, Response } from "express";
import Mandate from "../models/Mandate";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import { StatusCodes } from "http-status-codes";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mandate = await Mandate.findById(id);
    const investor = await Investor.findById(id);
    const landowner = await LandOwner.findById(id);

    // if (!mandate || !investor || !landowner) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ status: false, message: "User not found" });
    // }

    const user = mandate || investor || landowner;

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    if (role === "Mandate") {
      const user = await Mandate.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "User not found" });
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "User updated successfully",
      });
    } else if (role === "Investor") {
      const user = await Investor.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "User not found" });
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "User updated successfully",
      });
    } else if (role === "Landowner") {
      const user = await LandOwner.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "User not found" });
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "User updated successfully",
      });
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Failed to update user" });
  }
};
