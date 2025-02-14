import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// ✅ Add product to cart
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, name, image, price, quantity } = req.body;

        let cartItem = await Cart.findOne({ userId, productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new Cart({ userId, productId, name, image, price, quantity });
            await cartItem.save();
        }

        res.status(201).json({ message: "✅ Product added to cart", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ✅ Get all cart items for a user (FIXED)
router.get("/user/:userId", async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId });

        if (!cartItems.length) {
            return res.json([]); // Return an empty array if cart is empty
        }

        res.json(cartItems);
    } catch (error) {
        console.error("❌ Error fetching cart items:", error);
        res.status(500).json({ error: "❌ Server error fetching cart items" });
    }
});



// ✅ Update cart item quantity (FIXED)
router.put("/update", async (req, res) => {  
    try {
        console.log("📥 Incoming Request:", req.body); // ✅ Debug request data

        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity == null) {
            console.error("❌ Error: Missing required fields", { userId, productId, quantity });
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { userId, productId },
            { $inc: { quantity: quantity } }, // Increment quantity by given value
            { new: true }
        ).populate("productId");
        
console.log(updatedCart);


        if (!updatedCart) {
            console.error("❌ Cart item not found!");
            return res.status(404).json({ message: "Cart item not found" });
        }

        console.log("✅ Cart Updated Successfully:", updatedCart);
        res.json({ items: updatedCart.items });

    } catch (error) {
        console.error("❌ Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




// ✅ Remove item from cart (FIXED)
router.delete("/remove/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cartItem = await Cart.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ message: "❌ Cart item not found" });
        }

        await Cart.deleteOne({ userId, productId });
        res.json({ message: "✅ Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Clear cart for a user
router.delete("/clear/:userId", async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.params.userId });
        res.json({ message: "🗑️ Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
