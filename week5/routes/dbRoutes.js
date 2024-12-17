const express = require("express");
const {
  addCar,
  fetchCars,
  removeCar,
  updateRegoStatus,
} = require("../controllers/dbController");
const router = express.Router();

router.post("/cars", addCar);

router.get("/cars", fetchCars);

router.post("/cars/delete/:id", removeCar);
router.post("/update-car/:id", updateRegoStatus);

module.exports = router;
