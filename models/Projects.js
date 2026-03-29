import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATED", "UPDATED", "ORG_ASSIGNED"],
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    projectName: String,
    duration: String,
    status: String,
    techUsed: String,
    about: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);