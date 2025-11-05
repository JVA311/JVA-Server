import express from "express";
import { registerUser } from "../controllers/register.controller";
import { loginUser } from "../controllers/login.controller";
import { validateRegisterOtp } from "../controllers/validateRegisterOtp.controller";
import { sendResetPasswordOtp } from "../controllers/sendResetpasswordOtp.controller";
import { validateResetOtp } from "../controllers/validateResetOtp.controller";
import { resetPassword } from "../controllers/resetPassword.Controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/validate-register-otp", validateRegisterOtp);
router.post("/send-forgot-password-otp", sendResetPasswordOtp);
router.post("/validate-reset-otp", validateResetOtp);
router.post("/reset-password", resetPassword);

export default router;
