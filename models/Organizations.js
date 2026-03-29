import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // keep string for flexibility (year or full date)
    required: true,
  },
});

const timelineSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATED", "UPDATED", "PROMOTION_UPDATED"],
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orgSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Completed", "In Progress"],
      default: "In Progress",
    },

    location: {
      type: String,
    },

    techUsed: {
      type: String, // "React, Node, MongoDB"
      required: true,
    },

    about: {
      type: String,
      required: true,
    },

    promotions: [promotionSchema], // 🔥 key feature

    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },

    // ❌ REMOVE THIS (not needed here)
    // password: String,
    timeline: [timelineSchema], // 🔥 key feature
  },
  { timestamps: true }
);

export default mongoose.model("organizations", orgSchema);