
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend folder
const frontendPath = path.join(__dirname, "../frontend");

// Serve CSS, JavaScript and other frontend files
app.use(express.static(frontendPath));

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/scholarships", scholarshipRoutes);

// Homepage - Show frontend UI
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScholarReady HP Backend is running"
  });
});

const PORT = process.env.PORT || 5000;

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
