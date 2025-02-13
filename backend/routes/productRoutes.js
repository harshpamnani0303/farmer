import express from "express";
import multer from "multer";
import Product from "../models/Product.js";

const router = express.Router();

// 🛒 Cart Quantity Update API
router.put("/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity < 1) {
            return res.status(400).json({ error: "Invalid data" });
        }

        // 📝 Cart me product dhundho aur quantity update karo
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, "items.productId": productId }, // ✅ User ke cart me product search karo
            { $set: { "items.$.quantity": quantity } }, // 🔼 Quantity update karo
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error("❌ Error updating cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from MongoDB
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

// Add a New Product
router.post("/", async (req, res) => {
    try {
        const { name, price, unit, image, category, discount, stock, description } = req.body;

        // Validate required fields
        if (!name || !price || !image || !category) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newProduct = new Product({
            name,
            price,
            unit,
            image, // Assume frontend provides image URL
            category,
            discount,
            stock,
            description
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
});

// Update Product
router.put("/:id", async (req, res) => {
    try {
        const { name, price, unit, image, category, discount, stock, description } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, unit, image, category, discount, stock, description },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

//  Delete Product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

// 🖼️ Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files in "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ Create New Product with Image Upload
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "";

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            stock,
            image,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
});


export default router;
