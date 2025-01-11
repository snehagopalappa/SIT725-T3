const { expect } = require("chai");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const { insertCar, getCars, updateCar, deleteCar, setMockDB } = require("../models/dbModel");

let mongoServer;
let client;
let db;

before(async function () {
  this.timeout(10000); // Increase timeout for setup
  mongoServer = await MongoMemoryServer.create(); // In-memory MongoDB
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("newDatabase");

  // Set the mock database
  setMockDB(db);
});

after(async () => {
  if (client) await client.close();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the collection before each test
  await db.collection("cars").deleteMany({});
});

describe("dbModel.js Tests", () => {
  it("should insert a car into the database", async () => {
    const car = { make: "Toyota", model: "Corolla", year: 2022 };
    const result = await insertCar(car);

    expect(result.insertedId).to.exist;

    const cars = await db.collection("cars").find().toArray();
    expect(cars).to.have.lengthOf(1);
    expect(cars[0]).to.include({ make: "Toyota", model: "Corolla", year: 2022 });
  });

  it("should retrieve all cars from the database", async () => {
    const cars = [
      { make: "Honda", model: "Civic", year: 2020 },
      { make: "Ford", model: "Focus", year: 2019 },
    ];
    await db.collection("cars").insertMany(cars);

    const result = await getCars();
    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.include({ make: "Honda", model: "Civic" });
    expect(result[1]).to.include({ make: "Ford", model: "Focus" });
  });

  it("should update a car by ID", async () => {
    const car = { make: "Nissan", model: "Altima", year: 2018 };
    const { insertedId } = await db.collection("cars").insertOne(car);

    const updates = { year: 2021 };
    const result = await updateCar(insertedId.toString(), updates);

    expect(result.matchedCount).to.equal(1);
    expect(result.modifiedCount).to.equal(1);

    const updatedCar = await db.collection("cars").findOne({ _id: insertedId });
    expect(updatedCar.year).to.equal(2021);
  });

  it("should delete a car by ID", async () => {
    const car = { make: "Chevrolet", model: "Malibu", year: 2017 };
    const { insertedId } = await db.collection("cars").insertOne(car);

    const result = await deleteCar(insertedId.toString());
    expect(result.deletedCount).to.equal(1);

    const deletedCar = await db.collection("cars").findOne({ _id: insertedId });
    expect(deletedCar).to.be.null;
  });
});
