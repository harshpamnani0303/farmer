import express from "express";
const router = express.Router();

// Define your payment routes
router.get("/", (req, res) => {
  res.send("Payment routes working!");
});

export default router; // Default export
