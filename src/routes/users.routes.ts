import express from "express";
import { getUser, updateUser } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/:id", authMiddleware, getUser);
router.put("/profile/:id", updateUser);

export default router;
