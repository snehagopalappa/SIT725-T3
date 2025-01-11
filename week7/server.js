const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dbRoutes = require("./routes/dbRoutes");
const { getCars, insertCar, updateCar } = require("./models/dbModel");
const { removeCar } = require("./controllers/dbController"); // Import the controller

const app = express();
const server = http.createServer(app); // Create server for socket integration
const io = socketIo(server); // Socket.IO instance
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

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
  const newCar = await insertCar({ color, make, model, regoStatus: regoStatus || "Active" });
  io.emit("carAdded", newCar); // Emit event for car addition
  res.redirect("/");
});

app.post("/update-car/:id", async (req, res) => {
  const { regoStatus } = req.body;
  const updatedCar = await updateCar(req.params.id, { regoStatus });
  io.emit("carUpdated", updatedCar); // Emit event for car update
  res.redirect("/");
});

app.post("/cars/delete/:id", (req, res) => removeCar(req, res, io));


app.use("/", dbRoutes);

server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
