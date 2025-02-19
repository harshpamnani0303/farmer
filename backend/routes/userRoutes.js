import express from "express"; // ✅ Use ESM `import`
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // ✅ Ensure `.js` is included in imports

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // ✅ Check incoming data

    const { name, email, phoneNumber, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email); // ✅ Log existing user
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate phone number (must be 10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      console.log("Invalid phone number:", phoneNumber); // ✅ Log invalid phone
      return res
        .status(400)
        .json({ message: "Invalid phone number. Must be 10 digits." });
    }

    // Hash Password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    console.log("Saving user to DB...");
    const user = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();
    console.log("User registered successfully!");

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Registration Error:", error); // ✅ Log error details
    res.status(500).json({ message: "Error Registering User", error: error.message });
  }
});


router.put("/update", async (req, res) => {
  try {
    const {
      email,
      userId,
      phoneNumber,
      phoneNumberSecond,
      address,
      addressSecond,
    } = req.body;

    if (!email && !userId) {
      return res
        .status(400)
        .json({ message: "Email or User ID is required to update profile" });
    }

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number. Must be 10 digits." });
    }

    if (phoneNumberSecond && !/^\d{10}$/.test(phoneNumberSecond)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number. Must be 10 digits." });
    }

    const user = await User.findOne(email ? { email } : { _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields = {
      phoneNumber: phoneNumber ?? user.phoneNumber,
      phoneNumberSecond: phoneNumberSecond ?? user.phoneNumberSecond,
      address: address ?? user.address,
      addressSecond: addressSecond ?? user.addressSecond,
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    console.log("✅ User Updated Successfully:", updatedUser);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route (Without JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    console.log(user);

    // ✅ Return user data with name
    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, userId: user.userId },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔥 **Missing API Added: Get User By `userId`**
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by userId (custom ID set in pre-save middleware)
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Return user details
    res.status(200).json({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      phoneNumberSecond: user.phoneNumberSecond,
      address: user.address,
      addressSecond: user.addressSecond,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router; //
