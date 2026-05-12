import express from "express"
import { register, login, logout, sendVerifyOTP, verifyAccount, sendResetOTP, resetPassword, isAuthenticated } from "../controller/authController.js"
import userAuth from "../middleware/userAuth.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/logout", logout)
authRouter.get("/send-OTP", userAuth, sendVerifyOTP)
authRouter.post("/verify-account", userAuth, verifyAccount)
authRouter.get("/send-reset-OTP", userAuth, sendResetOTP)
authRouter.post("/reset-password", userAuth, resetPassword)
authRouter.get("/is-authenticated", userAuth, isAuthenticated)

export default authRouter