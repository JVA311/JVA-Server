import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import RequestModel from "../models/Request";

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { location, type } = req.body as {
      location?: string;
      type?: "land" | "develop";
    };

    // Validate type
    if (!["land", "develop"].includes(type as string)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Type must be either 'land' or 'develop'",
      });
    }

    // Build requestType filter
    let requestTypeFilter: string[] = [];

    if (type === "land") {
      requestTypeFilter = ["land", "partnership"];
    } else if (type === "develop") {
      requestTypeFilter = ["development", "partnership"];
    }

    // Build query object
    const query: any = {
      requestType: { $in: requestTypeFilter },
    };

    // Optional location search
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Perform the search
    const results = await RequestModel.find(query).select({
      fullName: 1,
      email: 1,
      phoneNumber: 1,
      location: 1,
      budget: 1,
      timeline: 1,
      requestType: 1,
      description: 1,
      landSize: 1,
      landValue: 1,
      developmentType: 1,
      partnershipType: 1,
      title: 1,
      status: 1,
      documents: 1,
      createdAt: 1,
    });

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Search completed successfully",
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Search error:", error.message);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to search properties",
      error: error.message,
    });
  }
};
