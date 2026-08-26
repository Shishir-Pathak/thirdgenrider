import express from "express";
import {
  getBikes,
  createBike,
  updateBike,
  deleteBike,
  deleteBikeLicenseImage,
  deleteBikeBlueBookImage,
  getBikeById,
} from "../controller/bikeController.js";
import { uploadImage, withUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router = express.Router();

router.get("/", getBikes);
router.get("/:id", getBikeById);
router.post(
  "/",
  authMiddleware(["admin", "superadmin"]),
  withUpload,
  createBike,
);
router.put(
  "/:id",
  authMiddleware(["admin", "superadmin"]),
  withUpload,
  updateBike,
);
router.delete(
  "/:id/license-image",
  authMiddleware(["admin", "superadmin"]),
  deleteBikeLicenseImage,
);
router.delete(
  "/:id/bluebook-images/:imageIndex",
  authMiddleware(["admin", "superadmin"]),
  deleteBikeBlueBookImage,
);
router.delete("/:id", authMiddleware(["admin", "superadmin"]), deleteBike);

export default router;
