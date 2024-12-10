const express = require("express");
const { MongoClient } = require("mongodb");

// Initialize Express
const app = express();
const PORT = 3000;

// MongoDB Connection URI and Database Details
const uri = "mongodb://127.0.0.1:27017";
const databaseName = "myDatabase";
const collectionName = "myCollection";
const client = new MongoClient(uri);

// MongoDB CRUD Operations (Run function)
async function runDatabaseOperations() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Get database and collection
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    /*** CRUD OPERATIONS ***/

    // 1. CREATE (Insert documents)
    console.log("\n--- INSERTING DOCUMENTS ---");
    const insertResult = await collection.insertMany([
      { name: "Alice", age: 28, occupation: "Designer" },
      { name: "Bob", age: 30, occupation: "Manager" },
      { name: "Charlie", age: 35, occupation: "Developer" },
    ]);
    console.log("Documents Inserted:", insertResult.insertedIds);

    // 2. READ (Find documents)
    console.log("\n--- READING DOCUMENTS ---");
    const allDocs = await collection.find().toArray(); // Fetch all documents
    console.log("All Documents:", allDocs);

    // Query with filter (e.g., age > 28)
    const filteredDocs = await collection.find({ age: { $gt: 28 } }).toArray();
    console.log("Filtered Documents (age > 28):", filteredDocs);

    // 3. UPDATE (Modify documents)
    console.log("\n--- UPDATING DOCUMENTS ---");
    const updateResult = await collection.updateOne(
      { name: "Alice" }, // Find document
      { $set: { occupation: "Senior Designer", age: 29 } } // Update fields
    );
    console.log("Update Result:", updateResult.modifiedCount);
  } catch (error) {
    console.error("Error during CRUD operations:", error);
  }
}

// Express route to serve "Test" message
app.get("/", async (req, res) => {
  res.send(
    "Hello, kindly use http://localhost:3000/db to check if the database is working :) "
  );
});

// Route to trigger MongoDB operations
app.get("/db", async (req, res) => {
  try {
    await runDatabaseOperations(); // Perform database operations
    res.send("MongoDB CRUD operations completed. Check console for details.");
  } catch (error) {
    res
      .status(500)
      .send("Error performing MongoDB operations: " + error.message);
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
