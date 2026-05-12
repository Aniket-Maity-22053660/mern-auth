import userModel from "../models/userModel.js"

export const userData = async (req, res) => {

    try{
        const { userId } = req

        const user = await userModel.findById(userId)

        if(!user){
            return res.json({success: false, message: "User is not registered!"})
        }

         const data = {
            name: user.name,
            isAccountVerified: user.isAccountVerified
        }
    return res.json({success: true, userData: data})
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}