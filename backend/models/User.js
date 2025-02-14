import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true }, // 🔹 Custom user ID based on _id
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 🔥 Middleware to auto-set userId before saving
userSchema.pre("save", function (next) {
    if (!this.userId) {
        this.userId = this._id.toString(); // 🔹 Convert ObjectId to String
    }
    next();
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
