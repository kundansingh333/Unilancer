const mongoose = require("mongoose");

const deletedUserSchema = new mongoose.Schema({
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  deletedBy: {
    type: String,
    enum: ["self", "admin"],
    required: true,
  },
  reason: {
    type: String,
    default: "Requested",
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  // Optionally store snapshot of basic stats or role specific info before deletion if ever needed
  bioSnapshot: String,
  collegeSnapshot: String
});

module.exports = mongoose.model("DeletedUser", deletedUserSchema);
