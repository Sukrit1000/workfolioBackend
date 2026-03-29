import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);