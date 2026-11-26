
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String
    },

    district: {
      type: String,
      required: true
    },

    course: {
      type: String,
      required: true
    },

    annualIncome: {
      type: Number,
      required: true
    },
    password: {
    type: String,
    required: true,
    minlength: 8
    },
    role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
}
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
