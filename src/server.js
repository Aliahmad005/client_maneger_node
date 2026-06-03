const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./config/db");
const authMiddleware = require("./middlewares/auth.middleware");
const roleMiddleware = require("./middlewares/role.middleware");
const clientRoutes = require("./routes/client.routes");
const taskRoutes = require("./routes/task.routes");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Auth Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Client Routes
app.use("/api/clients", clientRoutes);
app.use("/api/tasks", taskRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend running successfully",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "connected",
      timestamp: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "disconnected",
      error: err.message,
    });
  }
});

app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user,
    });
  }
);

app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({
      message: "Welcome Admin Panel",
    });
  }
);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});