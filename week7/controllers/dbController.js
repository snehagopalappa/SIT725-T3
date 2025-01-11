const {
  insertCar,
  getCars,
  deleteCar,
  updateCar,
} = require("../models/dbModel");

// Add a new car
const addCar = async (req, res) => {
  try {
    const { color, make, model } = req.body;
    const regoStatus = "Active"; // Default value

    if (!color || !make || !model) {
      return res
        .status(400)
        .send("Missing required fields: color, make, model.");
    }

    await insertCar({ color, make, model, regoStatus });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to add car");
  }
};

// Fetch cars
const fetchCars = async (req, res) => {
  try {
    const cars = await getCars();
    res.json(cars);
  } catch (error) {
    res.status(500).send("Failed to fetch cars");
  }
};

// Delete a car

const removeCar = async (req, res, io) => {
  try {
    const { id } = req.params;
    console.log("Attempting to delete car with ID:", id); // Debug log

    await deleteCar(id); // Calls deleteCar from dbModel.js
    io.emit("carDeleted", id); // Emit real-time event
    console.log("Car deleted successfully:", id); // Success log
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting car:", error.message); // Error log
    res.status(500).send("Failed to delete car");
  }
};



const updateRegoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { regoStatus } = req.body; // New status from the form
    console.log("Updating Rego Status for ID:", id, "to:", regoStatus);

    await updateCar(id, { regoStatus });
    res.redirect("/");
  } catch (error) {
    console.error("Error updating rego status:", error.message);
    res.status(500).send("Failed to update rego status");
  }
};

module.exports = { addCar, fetchCars, removeCar, updateRegoStatus };
