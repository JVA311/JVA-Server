import { Request, Response } from "express";
import Mandate from "../models/Mandate";
import Investor from "../models/Investor";
import LandOwner from "../models/LandOwner";
import { StatusCodes } from "http-status-codes"

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await Mandate.findById(id);
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "User not found" })
    }
    return res.status(StatusCodes.OK).json({
        status: true,
        message: "User fetched successfully",
        user
    });
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { role } = req.body;

    if(role === "Mandate") {
        const user = await Mandate.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "User not found" })
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "User updated successfully",
        });
    } else if(role === "Investor") {
        const user = await Investor.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "User not found" })
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "User updated successfully",
        });
    } else if(role === "Landowner") {
        const user = await LandOwner.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "User not found" })
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "User updated successfully",
        });
    }

}