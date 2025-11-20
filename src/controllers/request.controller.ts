import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import RequestModel from "../models/Request";
import { supabase } from "../lib/supabaseClient";
import Investor from "../models/Investor";
import Mandate from "../models/Mandate";
import LandOwner from "../models/LandOwner";
import { StatusCodes } from "http-status-codes";

// ✅ Create a new request
export const createRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Extract request data from body
    const {
      fullName,
      email,
      phoneNumber,
      location,
      budget,
      timeline,
      requestType,
      description,
      landSize,
      landValue,
      housingProposal,
      titleDocument,
      sharingFormula,
      developmentType,
      partnershipType,
      title,
    } = req.body;

    if (!fullName || !email || !requestType || !description || !title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Please fill in all required fields" });
    }

    if (requestType === "land") {
      if (
        !landSize ||
        !landValue ||
        !titleDocument ||
        !sharingFormula ||
        !housingProposal
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message:
            "Please provide all land request details",
        });
      }
    }

    // Handle file uploads if present
    const files = req.files as Express.Multer.File[]; // Multer parsed files
    const documentUrls: string[] = [];

    // Upload documents to Supabase storage if files are provided
    if (files && files.length > 0) {
      for (const file of files) {
        // Create unique filename using timestamp
        const fileName = `public/${Date.now()}-${file.originalname}`;

        // Upload file to Supabase storage bucket
        const { data, error } = await supabase.storage
          .from("JVA-BUCKET")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: `File upload failed: ${error.message}`,
          });
        }

        // Get public URL for the uploaded file
        const publicUrl = supabase.storage.from("JVA-BUCKET").getPublicUrl(fileName)
          .data.publicUrl;

        documentUrls.push(publicUrl);
      }
    }

    // Get user ID for statistics update
    const userId = req.user!.id;

    // Create new request in MongoDB with all data including document URLs
    const newRequest = await RequestModel.create({
      userId: userId,
      fullName,
      email,
      phoneNumber,
      location,
      budget,
      timeline,
      requestType,
      description,
      landSize,
      landValue,
      housingProposal,
      titleDocument,
      sharingFormula,
      developmentType,
      partnershipType,
      title,
      documents: documentUrls,
    });

    if (!newRequest) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Failed to create request record",
      });
    }

    // Check user type (LandOwner/Mandate/Investor) and update their request count
    const landOwnerModel = await LandOwner.findById(userId);
    const mandateModel = await Mandate.findById(userId);
    const investorModel = await Investor.findById(userId);

    // Increment totalRequest counter for the appropriate user type
    if (landOwnerModel) {
      await LandOwner.findByIdAndUpdate(
        userId,
        { $inc: { totalRequest: 1 } }, // Increment totalRequest by 1
        { new: true } // Return updated document
      );
    } else if (mandateModel) {
      await Mandate.findByIdAndUpdate(
        userId,
        { $inc: { totalRequest: 1 } },
        { new: true }
      );
    } else if (investorModel) {
      await Investor.findByIdAndUpdate(
        userId,
        { $inc: { totalRequest: 1 } },
        { new: true }
      );
    }

    // Send success response
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: "Request created successfully",
    });
  } catch (err: any) {
    console.log(err.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Something went wrong" });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    // Fetch all requests and sort by creation date (descending)
    const requests = await RequestModel.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(requests);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch requests" });
  }
};

export const getRequestById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { id } = req.user;
    const request = await RequestModel.find({ userId: id }).sort({
      createdAt: -1,
    });

    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Request not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      data: request,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to fetch request",
    });
  }
};

export const getSingleRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await RequestModel.findById(id);

    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Request not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      data: request,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to fetch request",
    });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedRequest = await RequestModel.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Request not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Request deleted successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to delete request",
    });
  }
};
