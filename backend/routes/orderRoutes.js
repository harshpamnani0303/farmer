import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js"; // Import Order model

const router = express.Router();

/* ✅ Create a new order */
router.post("/", async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      deliverySchedule,
      contactNumbers,
      deliveryAddresses,
    } = req.body;

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
router.get('/user/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const orders = await Order.find({ user: userId }); // Assuming 'user' holds userId in the order document

      if (!orders.length) {
          return res.status(404).json({ message: 'No orders found for this user' });
      }

      res.status(200).json(orders);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

/* ✅ Update order status */
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status value
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ error: "Order not found" });

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
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "products.product"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Determine order date logic
    let orderDate = new Date();
    if (
      order.deliverySchedule === "Next day" ||
      (order.deliverySchedule === "8am-10pm" && orderDate.getHours() >= 22)
    ) {
      orderDate.setDate(orderDate.getDate() + 1); // Move to next day
    }

    // Calculate total amount
    const totalAmount = order.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      orderNumber: order.orderNumber,
      orderDate: orderDate.toDateString(),
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: "Cash on Delivery", // Static for now, update if dynamic
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/next-order-number", async (req, res) => {
  try {
    // Find the latest order by sorting in descending order
    const lastOrder = await Order.findOne()
      .sort({ createdAt: -1 })
      .select("orderNumber");

    // Determine the next order number
    let nextOrderNumber = 1001; // Default to 1 if no orders exist
    if (lastOrder && lastOrder.orderNumber) {
      nextOrderNumber = parseInt(lastOrder.orderNumber, 10) + 1;
    }

    res.status(200).json({ nextOrderNumber });
  } catch (error) {
    console.error("❌ Error fetching next order number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
