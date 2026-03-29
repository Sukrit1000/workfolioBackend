import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
} from "../controller/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/projects/createProject", authMiddleware, createProject);
router.post("/projects/updateProject", authMiddleware, updateProject);
router.post("/projects/getProjects", authMiddleware, getProjects);

export default router;