import express, { json } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// middleware
app.use(json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Home page...",
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
