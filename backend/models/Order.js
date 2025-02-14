import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        default: "Pending", 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] 
    },
    deliverySchedule: { 
        type: String, 
        required: true, 
        enum: ["express", "8am-10pm", "Next day"], 
        default: "express" 
    },
    contactNumbers: [
        {
            label: { type: String, enum: ["primary", "secondary"], required: true },
            number: { type: String, required: true, match: [/^\+?\d{10,15}$/, "Invalid contact number format"] }
        }
    ],
    deliveryAddresses: [
        {
            label: { type: String, enum: ["Home", "Office", "Business"], required: true },
            address: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// ✅ Use ES Module Export
const Order = mongoose.model("Order", orderSchema);
export default Order;
