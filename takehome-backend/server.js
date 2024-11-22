const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://nanditak472:E0k4tkxKI63GLq8I@cluster0.a0szo.mongodb.net/"; // Replace with your MongoDB cluster URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Order Schema
const orderSchema = new mongoose.Schema({
  id: String,
  customerName: String,
  orderAmount: Number,
  status: String,
  items: Array,
  createdAt: Date,
});

// Create Order Model
const Order = mongoose.model("Order", orderSchema);

// Initialize Express
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Route: Fetch Orders with Pagination
app.get("/api/orders", async (req, res) => {
  try {
    const { cursor, limit = 50, sort = "createdAt", sortDirection = "desc" } = req.query;

    // Pagination Logic
    const query = cursor ? { _id: { $lt: cursor } } : {};
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const orders = await Order.find(query)
      .sort({ [sort]: sortOrder })
      .limit(parseInt(limit));

    const nextCursor = orders.length > 0 ? orders[orders.length - 1]._id : null;

    res.json({
      data: orders,
      nextCursor,
      hasNextPage: !!nextCursor,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
