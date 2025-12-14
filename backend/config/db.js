// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // UPDATED: Removed deprecated options (useNewUrlParser, useUnifiedTopology)
    // Mongoose 6+ handles these automatically.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit with failure
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`🔴 Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("📴 Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 Mongoose connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
