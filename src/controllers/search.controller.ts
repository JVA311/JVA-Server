import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import LandOwner from "../models/LandOwner";
import Investor from "../models/Investor";
import { Model } from "mongoose";

interface SearchQuery {
  propertyType?: string;
  location?: string;
  type?: "Land" | "Develop";
}

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { propertyType, location, type = "Land" } = req.query as SearchQuery;

    if (!propertyType && !location) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message:
          "Please provide at least one search filter (propertyType or location)",
      });
    }

    // Build query object
    const query: any = {};

    if (propertyType) {
      if (type === "Land") {
        // For land owners, match against land type or usage
        query.landDescription = { $regex: propertyType, $options: "i" };
      } else {
        // For investors, match against project type
        query.projectType = { $regex: propertyType, $options: "i" };
      }
    }

    if (location) {
      if (type === "Land") {
        query.landLocation = { $regex: location, $options: "i" };
      } else {
        query.preferredLocation = { $regex: location, $options: "i" };
      }
    }

    // Select the appropriate model based on type
    const model: Model<any> = type === "Land" ? Investor : LandOwner;

    const results = await model.find(query).select({
      fullName: 1,
      email: 1,
      phoneNumber: 1,
      ...(type === "Land"
        ? {
            landLocation: 1,
            landSize: 1,
            landDescription: 1,
            documentationStatus: 1,
          }
        : {
            preferredLocation: 1,
            projectType: 1,
            budgetRange: 1,
            investmentType: 1,
          }),
    });

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Search completed successfully",
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Search error:", error?.message || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to search properties",
      error: error?.message || String(error),
    });
  }
};
