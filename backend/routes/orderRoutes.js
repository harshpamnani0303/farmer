import express from "express";
const router = express.Router();

// Define your order routes
router.get("/", (req, res) => {
  res.send("Order routes working!");
});

export { router as orderRoutes }; //Named export
