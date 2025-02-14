import mongoose from "mongoose";

// Counter Schema for Auto-Increment Order Numbers
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

const Counter = mongoose.model("Counter", counterSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true }, // Auto-increment order number
  user: { type: String, required: true },
  products: [
    {
      product: {
        type: String,
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  deliverySchedule: {
    type: String,
    required: true,
    enum: ["express", "8am-10pm", "Next day"],
    default: "express",
  },
  contactNumbers: [
    {
      label: { type: String, enum: ["primary", "secondary"], required: true },
      number: {
        type: String,
        required: true,
        match: [/^\+?\d{10,15}$/, "Invalid contact number format"],
      },
    },
  ],
  deliveryAddresses: [
    {
      label: {
        type: String,
        enum: ["Home", "Office", "Business"],
        required: true,
      },
      address: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Auto-increment orderNumber before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      let counter = await Counter.findOneAndUpdate(
        { name: "orderNumber" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      // Ensure first order starts at 1001
      if (counter.value === 1) {
        counter.value = 1001;
        await counter.save();
      }

      this.orderNumber = counter.value;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Create Order model
const Order = mongoose.model("Order", orderSchema);
export default Order;
