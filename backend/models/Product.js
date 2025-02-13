import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "piece" }, // Example: "kg", "piece", "pack"
    image: { type: String, required: true }, // Store image URL
    category: { 
        type: String, 
        enum: ["Vegetables", "Fruits", "Seeds", "Tools"], 
        required: true 
    },
    discount: { type: Number, default: 0 }, // Discount in percentage
    stock: { type: Number, required: true, default: 10 }, // Stock quantity
    description: { type: String, default: "No description available" }, // Product details
    rating: { 
        average: { type: Number, default: 0 }, 
        count: { type: Number, default: 0 } 
    },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
