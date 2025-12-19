import express from "express";

import { isAdmin, authMiddleware } from "../../middlewares/auth";
import { getAllUsers } from "../../controllers/admin/users.controller";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, getAllUsers);

export default router;
