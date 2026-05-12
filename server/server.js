import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"

const app = express()
const port = process.env.PORT | 4000

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))

app.get('/', (req, res) => {
    res.send("API Working!")
})

app.listen(port, (req, res) => {
    console.log(`Server started on PORT ${port}`)
})