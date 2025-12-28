import express from "express";

import { isAdmin, authMiddleware } from "../../middlewares/auth";

import {
  getAllRequests,
  approveRequest,
  rejectRequest,
  getAcceptedRequest,
  getRejectedRequest,
  getPendingRequest,
} from "../../controllers/admin/request.controller";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, getAllRequests);
router.put("/approve/:id", authMiddleware, isAdmin, approveRequest);
router.put("/reject/:id", authMiddleware, isAdmin, rejectRequest);
router.get("/accepted", authMiddleware, isAdmin, getAcceptedRequest);
router.get("/rejected", authMiddleware, isAdmin, getRejectedRequest);
router.get("/pending", authMiddleware, isAdmin, getPendingRequest);

export default router;
