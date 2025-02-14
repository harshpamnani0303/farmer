import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // 🔹 Custom user ID based on _id
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Invalid phone number. Must be 10 digits."], // 🔹 Validation
  },
  phoneNumberSecond: {
    type: String,
    match: [/^\d{10}$/, "Invalid phone number. Must be 10 digits."], // 🔹 Validation
  },
  password: { type: String, required: true },
  address: { type: String },
  addressSecond: { type: String },
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
