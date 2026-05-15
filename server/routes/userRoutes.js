import express from "express"
import { userData } from "../controller/userController.js"
import userAuth from "../middleware/userAuth.js"

const userRouter = express.Router()

userRouter.route("/data").get(userAuth, userData)

export default userRouter