const express = require("express");
const dbRoutes = require("./routes/dbRoutes");
const { getCars, insertCar, updateCar } = require("./models/dbModel");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes for frontend
app.get("/", async (req, res) => {
  const cars = await getCars();
  res.render("index", { cars });
});

app.get("/add-car", (req, res) => {
  res.render("addCar");
});

app.post("/add-car", async (req, res) => {
  const { color, make, model, regoStatus } = req.body;
  await insertCar({ color, make, model, regoStatus: regoStatus || "Active" });
  res.redirect("/");
});

app.post("/update-car/:id", async (req, res) => {
  const { regoStatus } = req.body;
  await updateCar(req.params.id, { regoStatus });
  res.redirect("/");
});

app.use("/", dbRoutes);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
