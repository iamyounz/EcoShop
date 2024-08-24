import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    users,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/", users);

export default router;
