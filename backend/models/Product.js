import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "kg" }, // Default unit
    image: { type: String, required: true }, // Image URL
    category: { 
      type: String,  
      required: true 
    },
    discount: { type: Number, default: 0 }, // Discount percentage
    stock: { type: Number, default: 10 }, // Default stock
    description: { type: String, default: "No description available" }, // Product details
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

const Product = mongoose.model("Product", productSchema);

export default Product;
