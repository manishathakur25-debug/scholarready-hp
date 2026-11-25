
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

// Load environment variables from .env
dotenv.config();

// Create Express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/scholarships", scholarshipRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to ScholarReady HP Backend!");
});

// Check server health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScholarReady HP Backend is running"
  });
});

// Port from .env
const PORT = process.env.PORT || 5000;

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
