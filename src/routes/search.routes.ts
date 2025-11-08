import { Router } from "express";
import { searchProperties } from "../controllers/search.controller";

const router = Router();

// 🔍 Search properties route
router.get("/", searchProperties);

export default router;