import express from "express"
import { register, login, logout, sendVerifyOTP, verifyAccount } from "../controller/authController.js"
import userAuth from "../middleware/userAuth.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/logout", logout)
authRouter.get("/send-otp", userAuth, sendVerifyOTP)
authRouter.post("/verify-account", userAuth, verifyAccount)

export default authRouter