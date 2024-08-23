import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://chaudharypradip678:0pC0gqVFM0cHqZBS@cluster0.jvsf5.mongodb.net/ecoshop`
        );
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error ", error);
        process.exit(1);
    }
};

export default connectDB;
