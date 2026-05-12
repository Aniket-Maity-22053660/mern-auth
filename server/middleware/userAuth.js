import jwt from "jsonwebtoken"

const userAuth = (req, res, next) => {
    try{
        const token = req.cookies.token
        jwt.verify(token, process.env.JWT_SSS, (err, decoded) => {
        if(err){
            console.log(err)
            return res.json({success: false, message: "User not logged in!"})
        }else{
            req.userId = decoded.id
            //console.log(req.userId)
            next()
        }
    })
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}

export default userAuth