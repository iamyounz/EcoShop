import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Home page...",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    // MongoDB Connection
    connectDB();
});
