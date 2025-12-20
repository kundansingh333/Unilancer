require("dotenv").config();
const mongoose = require("mongoose");

// Force use the connection string, or default to local 'test' (which matches your error logs)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

async function forceDeleteIndex() {
  try {
    console.log("🔌 Connecting to:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected.");

    const collection = mongoose.connection.collection("conversations");

    // 1. List current indexes
    const indexes = await collection.indexes();
    console.log("\n📋 Current Indexes in DB:", indexes.map(i => i.name));

    // 2. Identify the bad index
    const badIndexName = "participants_1_type_1";
    
    // 3. Drop it
    if (indexes.find(i => i.name === badIndexName)) {
      console.log(`\n⚠️ Found bad index: '${badIndexName}'. Deleting it now...`);
      await collection.dropIndex(badIndexName);
      console.log("🗑️ SUCCESS: Bad index deleted.");
    } else {
      console.log(`\nℹ️ Index '${badIndexName}' not found. It might be gone already.`);
    }

    // 4. Verify
    const newIndexes = await collection.indexes();
    console.log("✅ Indexes remaining:", newIndexes.map(i => i.name));

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected.");
  }
}

forceDeleteIndex();