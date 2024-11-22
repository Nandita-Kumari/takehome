const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://nanditak472:E0k4tkxKI63GLq8I@cluster0.a0szo.mongodb.net/"; // Replace with your MongoDB cluster URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  customerName: String,
  orderAmount: Number,
  status: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  createdAt: Date,
});

// Create Order Model
const Order = mongoose.model("Order", orderSchema);

// Generate Random Orders
const statuses = ["pending", "processing", "completed", "cancelled"];

const generateOrders = (count) => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      id: randomUUID(),
      customerName: `Customer ${i + 1}`,
      orderAmount: parseFloat((Math.random() * 1000).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: [
        {
          name: `Item ${Math.floor(Math.random() * 100)}`,
          quantity: Math.floor(Math.random() * 10 + 1),
          price: parseFloat((Math.random() * 100).toFixed(2)),
        },
      ],
      createdAt: new Date(Date.now() - Math.random() * 1e11).toISOString(),
    });
  }
  return orders;
};

// Seed Orders into Database
const seedDatabase = async () => {
  try {
    const orders = generateOrders(10000); // Generate 10,000 orders
    await Order.insertMany(orders);
    console.log("Orders successfully inserted into the database.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the Seeding Process
seedDatabase();
