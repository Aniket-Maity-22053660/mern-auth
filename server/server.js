import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import authRouter from "./routes/authRoutes.js"

const app = express()
const port = process.env.PORT | 4000

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))

connectDB()

app.get('/', (req, res) => {
    res.send("API Working!")
})

app.use("/api/auth", authRouter)

app.listen(port, (req, res) => {
    console.log(`Server started on PORT ${port}`)
}) 