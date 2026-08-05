import express from "express";

import {
	createCompanyDetails,
	deleteCompanyDetails,
	getCompanyDetails,
	updateCompanyDetails,
} from "../controller/companyDetailsController.js";

import { withUpload } from "../middleware/ImageUpload.js";


const router = express.Router();


// Get company details
router.get("/", getCompanyDetails);


// Create company details
router.post("/", withUpload, createCompanyDetails);


// Update company details
router.put("/:id", withUpload, updateCompanyDetails);


// Delete company details
router.delete("/:id", deleteCompanyDetails);


export default router;