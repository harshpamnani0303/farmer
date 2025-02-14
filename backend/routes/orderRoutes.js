import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js"; // Import Order model

const router = express.Router();

/* ✅ Create a new order */
router.post("/", async (req, res) => {
    try {
        const { user, products, totalAmount, deliverySchedule, contactNumbers, deliveryAddresses } = req.body;

        // Validate required fields
        if (!user || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ error: "Missing required order details" });
        }

        // Create a new order
        const newOrder = new Order({
            user,
            products,
            totalAmount,
            deliverySchedule,
            contactNumbers,
            deliveryAddresses,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("❌ Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ✅ Get all orders */
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email") // Populate user details (only name & email for security)
            .populate("products.product", "name price"); // Populate product details (name & price)

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ✅ Get orders by user ID */
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const orders = await Order.find({ user: userId }).populate("products.product", "name price");
        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ✅ Update order status */
router.put("/:orderId/status", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status value
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid order status" });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/* ✅ Delete an order */
router.delete("/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) return res.status(404).json({ error: "Order not found" });

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
