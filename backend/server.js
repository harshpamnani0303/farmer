import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", false);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 Farming E-commerce API is running...");
});

// Define API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes); // Added order routes
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
