import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodeMailer.js"

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SSS, {
        expiresIn: 7 * 24 * 60 * 60
    })
}

export const register = async (req, res) => {
    const { name, email, password } = req.body

    if(!name || !email || !password){
        return res.json({success: false, message: "Missing details"})
    }

    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User already exists!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name, email, password:hashedPassword})
        await user.save()
        const token = createToken(user._id)
        res.cookie("token", token, {httpOnly: true, secure: process.env.node_env === "production", sameSite: process.env.node_env === "production" ? "none" : "strict", maxAge:7 * 24 * 60 * 60 * 1000})
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to mern-auth",
            text: `Welcome to mern-auth. Your account has been created successfully with email ${user.email}!`
        }
        await transporter.sendMail(mailOptions)
        return res.json({success:true, message: `User ${user._id} registered successfully!`})
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.json({success:false, message:"Email or Password is required!"})
    }

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message:"Email is invalid!"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message:"Invalid password!"})
        }

        const token = createToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.node_env === "production",
            sameSite: process.env.node_env === "production" ? "none" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: `User ${user._id} logged in successfully!`})
    }catch(err){
        console.log(err)
        return res.json({success: false, message: err.message})
    }
}

export const logout = async (req, res) => {
    try{

        res.cookie("token", " ", {
            httpOnly: true,
            secure: process.env.node_env === "production",
            sameSite: process.env.node_env === "production" ? "none" : "strict",
            maxAge: 4000
        })

        return res.json({success:true, message: "User logged out successfully!"})
    }catch(err){
        console.log(err)
        return res.json({success: false, message: err.message})
    }
}

export const sendVerifyOTP = async (req, res) => {
    try{
        const { userId } = req
        const user = await userModel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified!"})
        }

        const OTP = String(Math.floor(100000 + (Math.random() * 900000)))
        user.verifyOtp = OTP
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verification OTP",
            text: `Your OTP for verifying your account ${OTP}`
        }

        await transporter.sendMail(mailOptions)
        return res.json({success: true, message: "Verification OTP is sent into your email!"})
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}

export const verifyAccount = async (req, res) => {
    try{
        const { email, OTP } = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User not found!"})
        }

        if(user.verifyOtp === "" || user.verifyOtp !== OTP){
            return res.json({success: false, message: "Invalid credential!"})
        }

        if(Date.now() > user.verifyOtpExpireAt){
            return res.json({success: false, message: "Your OTP has expired!"})
        }

        user.isAccountVerified = true
        user.verifyOtp = ""
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: `User account ${req.userId} has verified successfully!`})
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}