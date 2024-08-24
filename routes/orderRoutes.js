import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
} from "../controllers/orderController.js";
import {
    authMiddleware,
    adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, adminMiddleware, updateOrder);

export default router;
