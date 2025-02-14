import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

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

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Images will be stored in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Add a New Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);

    const { name, price, unit, category, stock, description } = req.body;

    // Validate required fields
    if (!name || !price || !req.file || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      price,
      unit: "kg",
      discount: 0,
      rating: {
        average: 0,
        count: 0,
      },
      image: imageUrl, // Assume frontend provides image URL
      category,
      stock,
      description,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

// Update Product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, unit, image, category, discount, stock, description } =
      req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, unit, image, category, discount, stock, description },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
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

router.use("/uploads", express.static("uploads"));

export default router;
