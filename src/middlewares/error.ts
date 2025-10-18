import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: false,
    message: getErrorMessage(err) || "Server Error",
  });
}
