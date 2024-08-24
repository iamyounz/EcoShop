import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Get all users

export const users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json({
            message: "all users",
            data: users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register a new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            userId: savedUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
