import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/app", authRoutes,projectRoutes,organizationRoutes, dashboardRoutes);

app.use((err,
   req, res, next) => {
  console.log("global error handler hit:", err.message); // Debug log

  res.status(err.statusCode || 500).json({
  success: false,
  message: err.message || "Internal Server Error",
});
});
// app.use("/api/app", projectRoutes);
// app.use("/api/app", organizationRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});