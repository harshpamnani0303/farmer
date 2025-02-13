import express from "express"; // ✅ Use ESM `import`
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // ✅ Ensure `.js` is included in imports


const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save User
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Registering User" });
    }
});

// Login Route (Without JWT)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // ✅ Return user data with name
        res.status(200).json({ 
            message: "Login successful", 
            user: { name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router; //


