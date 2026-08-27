import express from "express";
import {
  createCompanyDetails,
  deleteCompanyDetails,
  getCompanyDetails,
  updateCompanyDetails,
} from "../controller/companyDetailsController.js";
import { withUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Get company details (public)
router.get("/", getCompanyDetails);

// Create company details (superadmin only)
router.post("/", authMiddleware(["superadmin"]), withUpload, createCompanyDetails);

// Update company details (superadmin only)
router.put("/:id", authMiddleware(["superadmin"]), withUpload, updateCompanyDetails);

// Delete company details (superadmin only)
router.delete("/:id", authMiddleware(["superadmin"]), deleteCompanyDetails);

export default router;