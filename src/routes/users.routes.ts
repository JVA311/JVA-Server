import express from "express";
import { getUser, updateUser } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/:id", asyncHandler(getUser));
router.put("/profile/:id", asyncHandler(updateUser));

export default router;
