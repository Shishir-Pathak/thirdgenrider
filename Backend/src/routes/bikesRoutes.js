import express from "express";
import {
  getBikes,
  createBike,
  updateBike,
  toggleBikeAvailability,
  deleteBike,
  deleteBikeLicenseImage,
  deleteBikeBlueBookImage,
  deleteBikeTakenImage,
  getBikeById,
} from "../controller/bikeController.js";
import { withUpload } from "../middleware/ImageUpload.js";
import authMiddleware, { optionalAuthMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", optionalAuthMiddleware, getBikes);
router.get("/:id", getBikeById);

router.post(
  "/",
  authMiddleware(["agent", "admin", "superadmin"]),
  withUpload,
  createBike,
);

router.put(
  "/:id",
  authMiddleware(["agent", "admin", "superadmin"]),
  withUpload,
  updateBike,
);

router.patch(
  "/:id/availability",
  authMiddleware(["agent", "admin", "superadmin"]),
  toggleBikeAvailability,
);

router.delete(
  "/:id/license-image",
  authMiddleware(["agent", "admin", "superadmin"]),
  deleteBikeLicenseImage,
);

router.delete(
  "/:id/bluebook-images/:imageIndex",
  authMiddleware(["agent", "admin", "superadmin"]),
  deleteBikeBlueBookImage,
);

router.delete(
  "/:id/taken-images/:imageIndex",
  authMiddleware(["agent", "admin", "superadmin"]),
  deleteBikeTakenImage,
);

router.delete(
  "/:id",
  authMiddleware(["agent", "admin", "superadmin"]),
  deleteBike,
);

export default router;
