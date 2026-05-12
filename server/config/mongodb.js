import mongoose from "mongoose"

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.mongodb_URL)
        console.log("DB connected successfully!")
    }catch(err){
        console.log(err)
        console.log("Failed to connect to the DB!")
    }
}

export default connectDB