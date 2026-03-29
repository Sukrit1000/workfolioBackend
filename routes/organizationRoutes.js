import express from "express";
import {
   createOrganization,
   getOrganizations,
   updateOrganization
} from "../controller/organizationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/organizations/createOrganization", authMiddleware, createOrganization);
router.post("/organizations/updateOrganization", authMiddleware, updateOrganization);
router.get("/organizations/getOrganizations", authMiddleware, getOrganizations);

export default router;