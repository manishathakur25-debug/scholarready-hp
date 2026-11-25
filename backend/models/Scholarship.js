
import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
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
      type: Date
    },

    applicationLink: {
      type: String
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
