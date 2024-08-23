import express, { json } from "express";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();

// middleware
app.use(json());

// Routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    // Database connection
    connectDB();
});
