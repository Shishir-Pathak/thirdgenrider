import express from "express";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controller/packageController.js";
import { withUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Get packages (public)
router.get("/", getPackages);

// Admin routes (superadmin only)
router.post("/", authMiddleware(["superadmin"]), withUpload, createPackage);
router.put("/:id", authMiddleware(["superadmin"]), withUpload, updatePackage);
router.delete("/:id", authMiddleware(["superadmin"]), deletePackage);

export default router;
