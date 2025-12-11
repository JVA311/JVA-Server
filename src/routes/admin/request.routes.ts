import express from "express";

import { isAdmin } from "../../middlewares/auth";

import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../../controllers/admin/request.controller";

const router = express.Router();

router.get("/", isAdmin, getAllRequests);
router.put("/approve/:id", isAdmin, approveRequest);
router.put("/reject/:id", isAdmin, rejectRequest);

export default router;
