import { Request, Response } from "express";
import RequestModel from "../models/Request";
import { StatusCodes } from "http-status-codes";

export const searchRequests = async (req: Request, res: Response) => {
  try {
    const { requestType } = req.query;

    // Allowed request types
    const allowedTypes = ["land", "development", "partnership"];

    // Build dynamic query
    const query: any = {};

    // ✅ Apply requestType filter only if valid
    if (requestType) {
      const type = (requestType as string).toLowerCase();

      if (!allowedTypes.includes(type)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: `Invalid request type. Allowed values: ${allowedTypes.join(
            ", "
          )}`,
        });
      }

      query.requestType = { $regex: new RegExp(type, "i") };
    }

    // ✅ Find requests matching the filters
    const requests = await RequestModel.find(query).sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "No requests found matching your search criteria",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Requests found",
      data: requests,
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "An error occurred while searching requests",
    });
  }
};
