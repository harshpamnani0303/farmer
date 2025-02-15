import express from "express";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage });


// Add a New Product
router.post("/", upload.single("image"), async (req, res) => {
    try {
        // Use form-data values from req.body
        const { name, price, unit, category, stock, description, discount } = req.body;

        if (!name || !price || !category || !req.file) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Parse numeric fields
        const parsedPrice = parseFloat(price) || 0;
        const parsedStock = parseInt(stock, 10) || 10;
        const parsedDiscount = parseInt(discount, 10) || 0;

        // Create and save the product
        const newProduct = new Product({
            name,
            price: parsedPrice,
            category,
            stock: parsedStock,
            description: description || "No description",
            image: `/uploads/${req.file.filename}`,
        });

        console.log("File received:", req.file);

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



// Update Product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

// Delete Product
// Backend (Node.js + Express)
// DELETE /api/products (bulk delete)
router.delete('/api/products', async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
  
      // Delete all products with matching IDs
      await Product.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: "Products deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Failed to delete products", error });
    }
  });
  
router.use("/uploads", express.static("uploads"));

export default router;
