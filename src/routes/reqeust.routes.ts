import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import {
  createRequest,
  getRequestById,
  getSingleRequest,
  deleteRequest,
  updateRequest,
} from "../controllers/request.controller";
import { searchRequests } from "../controllers/searchRequests.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.array("documents"),
  createRequest
);
router.get("/getUserRequests", authMiddleware, getRequestById);
router.get("/search", authMiddleware, searchRequests);
router.get("/user/:id", authMiddleware, getSingleRequest);
router.delete("/delete", authMiddleware, deleteRequest);
router.put("/update", authMiddleware, upload.array("documents"), updateRequest);

export default router;
