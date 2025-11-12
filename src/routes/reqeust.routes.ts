import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { createRequest, getAllRequests, getRequestById} from "../controllers/request.controller";
import { searchRequests } from "../controllers/searchRequests.controller";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("documents"), createRequest);
router.get("/", authMiddleware, getAllRequests);
router.get("/getUserRequests", authMiddleware, getRequestById);
router.get("/search", authMiddleware, searchRequests);

export default router;