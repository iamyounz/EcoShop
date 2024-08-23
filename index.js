import express, { json } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// middleware
app.use(json());

// Routes

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    // Database connection
    connectDB();
});
