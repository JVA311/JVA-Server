import express from "express";

//routes imports
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";

const router = express.Router();

const base = "/api/v1"

router.use(`${base}/auth`, authRoutes)
router.use(`${base}/users`, usersRoutes)

export default router