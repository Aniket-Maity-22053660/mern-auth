import express from "express"
import { userData } from "../controller/userController.js"
import userAuth from "../middleware/userAuth.js"

const userRouter = express.Router()

userRouter.get("/data", userAuth, userData)

export default userRouter