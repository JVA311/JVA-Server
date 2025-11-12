import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { createRequest, getAllRequests, getRequestById } from "../controllers/request.controller";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("documents"), createRequest);
router.get("/", authMiddleware, getAllRequests);
router.get("/getUserRequests", authMiddleware, getRequestById);

export default router;