// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    // Add a reference to the User model:
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // each task must belong to a user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
