import express from "express";
import { registerUser } from "../controllers/register.controller";
import { loginUser } from "../controllers/login.controller";
import { validateRegisterOtp } from "../controllers/validateRegisterOtp.controller";
import { requestPasswordOtp } from "../controllers/sendResetpasswordOtp.controller";
import { verifyPasswordOtp } from "../controllers/validateResetOtp.controller";
import { resetPassword } from "../controllers/resetPassword.Controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/validate-register-otp", validateRegisterOtp);
router.post("/password/otp", requestPasswordOtp);
router.post("/password/otp/verify", verifyPasswordOtp);
router.put("/password/reset", resetPassword);

export default router;

