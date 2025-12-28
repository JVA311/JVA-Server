import express from "express"
import { authMiddleware, isAdmin } from "../../middlewares/auth"
import requestRoute from "./request.routes"
import userRoute from "./users.routes"

const router = express.Router()

router.use("/requests", authMiddleware, isAdmin, requestRoute)
router.use("/users", authMiddleware, isAdmin, userRoute)

export default router