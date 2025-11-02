import express from "express";
import { createMessage } from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/create", authMiddleware, createMessage);

export default router;