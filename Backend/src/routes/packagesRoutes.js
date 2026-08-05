import express from "express";
import {
	getPackages,
	createPackage,
	updatePackage,
	deletePackage,
} from "../controller/packageController.js";
import {uploadImage, withUpload} from "../middleware/ImageUpload.js";


const router = express.Router();

router.get("/", getPackages);
router.post("/", withUpload, createPackage);
router.put("/:id", withUpload, updatePackage);
router.delete("/:id", deletePackage);

export default router;
