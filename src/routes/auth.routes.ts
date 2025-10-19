import express from "express";
import { registerUser } from "../controllers/register.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUser } from "../controllers/login.controller";
import { validateRegisterOtp } from "../controllers/validateRegisterOtp.controller";
import { sendResetPasswordOtp } from "../controllers/sendResetpasswordOtp.controller";
import { validateResetOtp } from "../controllers/validateResetOtp.controller";
import { resetPassword } from "../controllers/resetPassword.Controller";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/validate-register-otp", asyncHandler(validateRegisterOtp));
router.post("/send-forgot-password-otp", asyncHandler(sendResetPasswordOtp));
router.post("/validate-reset-otp", asyncHandler(validateResetOtp));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
