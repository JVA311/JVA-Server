import express from "express";

import { isAdmin, authMiddleware } from "../../middlewares/auth";

import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../../controllers/admin/request.controller";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, getAllRequests);
router.put("/approve/:id", authMiddleware, isAdmin, approveRequest);
router.put("/reject/:id", authMiddleware, isAdmin, rejectRequest);

export default router;
