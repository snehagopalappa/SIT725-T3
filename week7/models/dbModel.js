const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const databaseName = "newDatabase";
const collectionName = "cars";
const client = new MongoClient(uri);

const connectDB = async () => {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db(databaseName);
};

const insertCar = async (car) => {
  const db = await connectDB();
  return await db.collection(collectionName).insertOne(car);
};

const getCars = async () => {
  const db = await connectDB();
  return await db.collection(collectionName).find().toArray();
};

const updateCar = async (id, updates) => {
  const db = await connectDB();
  return await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
};

const deleteCar = async (id) => {
  const db = await connectDB();
  const collection = db.collection(collectionName);

  return await collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = { insertCar, getCars, updateCar, deleteCar };
