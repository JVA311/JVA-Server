import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { createRequest } from "../controllers/request.controller";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("documents"), createRequest);

export default router;