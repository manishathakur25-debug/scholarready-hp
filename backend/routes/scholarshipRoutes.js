
import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// POST: Register a student
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      district,
      course,
      annualIncome
    } = req.body;

    // Check required fields
    if (!name || !email || !district || !course || annualIncome === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Check duplicate email
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already registered with this email"
      });
    }

    // Create student
    const newStudent = await Student.create({
      name,
      email,
      phone,
      district,
      course,
      annualIncome
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: newStudent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET: All students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
