import { Request, Response } from "express";
import RequestModel from "../../models/Request";
import { StatusCodes } from "http-status-codes";

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    // Fetch all requests and sort by creation date (descending)
    const requests = await RequestModel.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(requests);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch requests" });
  }
};

export const approveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Request not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Request approved successfully",
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to fetch request",
    });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Request not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Request rejected successfully",
    });
  } catch {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to fetch request",
    });
  }
};

export const getAcceptedRequest = async (req: Request, res: Response) => {
  try {
    const acceptedRequests = await RequestModel.find({
      status: "accepted",
    }).sort({
      createdAt: -1,
    });
    res.status(StatusCodes.OK).json(acceptedRequests);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch accepted requests" });
  }
};
export const getRejectedRequest = async (req: Request, res: Response) => {
  try {
    const rejectedRequests = await RequestModel.find({
      status: "rejected",
    }).sort({
      createdAt: -1,
    });
    res.status(StatusCodes.OK).json(rejectedRequests);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch rejected requests" });
  }
};
