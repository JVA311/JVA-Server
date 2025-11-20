import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import LandOwner from "../models/LandOwner";
import Investor from "../models/Investor";
import { Model } from "mongoose";

interface SearchQuery {
  location?: string;
  type?: "land" | "develop";
}

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { location, type } = req.query as SearchQuery;

    if (!type) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Please specify a type to search for: 'land' or 'develop'",
      });
    }

    // Build query object
    const query: any = {};

    if (location) {
      if (type === "land") {
        query.landLocation = { $regex: location, $options: "i" };
      } else {
        query.preferredLocation = { $regex: location, $options: "i" };
      }
    }
    // Select the appropriate model based on type
    const model: Model<any> = type === "land" ? LandOwner : Investor;

    const results = await model.find(query).select(
      type === "land"
        ? {
            landLocation: 1,
            landSize: 1,
            landDescription: 1,
            documentationStatus: 1,
            licenseNumber: 1,
            preferredPartnershipType: 1,
          }
        : {
            preferredLocation: 1,
            projectType: 1,
            budgetRange: 1,
            investmentType: 1,
            registrationLicenseNumber: 1,
            yearsOfExperience: 1,
          }
    );

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Search completed successfully",
      count: results.length,
      results,
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to search properties",
    });
  }
};
