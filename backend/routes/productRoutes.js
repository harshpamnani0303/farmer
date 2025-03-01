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
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage });

router.get('/:productId', async (req, res) => {
  try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Add a New Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Use form-data values from req.body
    const { name, price, unit, category, stock, description, discount } =
      req.body;

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
      unit,
      stock: parsedStock,
      description: description || "No description",
      image: `/uploads/${req.file.filename}`,
    });

    console.log("File received:", req.file);

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock, description, discount } = req.body;

    // Find the product first
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Parse numeric fields
    const parsedPrice = parseFloat(price) || product.price;
    const parsedStock = parseInt(stock, 10) || product.stock;
    const parsedDiscount = parseInt(discount, 10) || product.discount;

    // Update fields
    product.name = name || product.name;
    product.price = parsedPrice;
    product.category = category || product.category;
    product.stock = parsedStock;
    product.description = description || product.description;
    product.discount = parsedDiscount;
    product.unit = req.body.unit || product.unit;
    // Handle image update if a new file is uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

// Delete Product
// Backend (Node.js + Express)
// DELETE /api/products (bulk delete)
router.delete("/delete/:ids", async (req, res) => {
  try {
    const ids = req.params.ids.split(","); // Extract IDs from URL

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or empty IDs array",
      });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found with given IDs" });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} product(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete products",
      error: error.message,
    });
  }
});

router.use("/uploads", express.static("uploads"));

export default router;
