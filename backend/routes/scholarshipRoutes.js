
import express from "express";
import Scholarship from "../models/Scholarship.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();



// POST: Add a new scholarship
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      amount,
      eligibility,
      state,
      lastDate,
      applicationLink
    } = req.body;

    if (!name || !category || !description || !eligibility) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const scholarship = await Scholarship.create({
      name,
      category,
      description,
      amount,
      eligibility,
      state,
      lastDate,
      applicationLink
    });

    res.status(201).json({
      success: true,
      message: "Scholarship added successfully",
      data: scholarship
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET: Fetch all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: scholarships.length,
      data: scholarships
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET: Fetch scholarship by ID
router.get("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found"
      });
    }

    res.status(200).json({
      success: true,
      data: scholarship
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid scholarship ID"
    });
  }
});

export default router;
