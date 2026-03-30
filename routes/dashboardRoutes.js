import express from "express";
import {
  
    getCareerGrowth,
  getDashboardSummary,
  getFullTimeline,
  getTechStats,
  getGrowthInsights,
} from "../controller/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard/summary", authMiddleware, getDashboardSummary);

router.get("/dashboard/career", authMiddleware, getCareerGrowth);
router.get("/dashboard/tech", authMiddleware, getTechStats);
router.get("/dashboard/timeline", authMiddleware, getFullTimeline);
router.get("/dashboard/growth", authMiddleware, getGrowthInsights);



export default router;