
import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["state", "central"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      default: null
    },

    eligibility: {
      type: String,
      required: true
    },

    state: {
      type: String,
      default: "Himachal Pradesh"
    },

    lastDate: {
      type: Date,
      default: null
    },

    applicationLink: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Scholarship = mongoose.model(
  "Scholarship",
  scholarshipSchema
);

export default Scholarship;
