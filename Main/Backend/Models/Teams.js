const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", TeamsSchema);
