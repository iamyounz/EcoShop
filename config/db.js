import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
        process.exit(1); // This line forcibly exits the Node.js process with an exit code of 1,
    }
};

export default connectDB;
