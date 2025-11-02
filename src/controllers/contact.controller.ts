import { Response } from "express";
import Contact from "../models/Contact"; // adjust path if needed
import { AuthenticatedRequest } from "../middlewares/auth";
import { StatusCodes } from "http-status-codes";

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      fullName,
      emailAddress,
      phoneNumber,
      consultationType,
      subject,
      message,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: false, message: "Unauthorized: User not found" });
    }

    if (
      !fullName ||
      !emailAddress ||
      !consultationType ||
      !subject ||
      !message
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Missing required fields" });
    }

    await Contact.create({
      userId: req.user.id,
      fullName,
      emailAddress,
      phoneNumber,
      consultationType,
      subject,
      message,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: "Message sent successfully" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Failed to send message" });
  }
};
