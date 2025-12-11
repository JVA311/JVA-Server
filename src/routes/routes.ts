import express from "express";

//routes imports
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import contact from "./contact.routes";
import requestRoutes from "./reqeust.routes";
import searchRoutes from "./search.routes";
import adminRequest from "./admin/request.routes";

const router = express.Router();

const base = "/api/v1";

router.use(`${base}/auth`, authRoutes);
router.use(`${base}/users`, usersRoutes);
router.use(`${base}/contact`, contact);
router.use(`${base}/request`, requestRoutes);
router.use(`${base}/search`, searchRoutes);
router.use(`${base}/admin/requests`, adminRequest);

export default router;
