import express from "express";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Registration
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      district,
      course,
      annualIncome,
      password
    } = req.body;

    // Check required fields
    if (!name || !email || !district || !course ||
        annualIncome === undefined || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    // Check existing student
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const newStudent = await Student.create({
      name,
      email,
      phone,
      district,
      course,
      annualIncome,
      password: hashedPassword
    });

    // Hide password from response
    const studentData = newStudent.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: studentData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// Student Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Hide password
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: studentData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get logged-in student's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: student
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().select("-password");

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