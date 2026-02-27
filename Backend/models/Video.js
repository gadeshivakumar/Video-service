const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema(
  {
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rawUrl: {
      type: String,
      required: true,
    },
    finalUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADED",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    locked: {
      type: Boolean,
      default: false,
      index: true,
    },

    lockedAt: {
      type: Date,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


videoSchema.index({ status: 1, locked: 1 });

module.exports = mongoose.model("Video", videoSchema);