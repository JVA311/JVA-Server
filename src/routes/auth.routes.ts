import express from "express";
import { registerUser } from "../controllers/register.controller";
// import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUser } from "../controllers/login.controller";
import { validateOtp } from "../controllers/otp.controller";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/validate-otp", asyncHandler(validateOtp));
// router.get("/profile", protect, getUserProfile);
// router.put("/update", protect, updateUser);
// router.delete("/delete", protect, deleteUser);

export default router;
