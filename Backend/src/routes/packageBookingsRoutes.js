import express from "express";
import {
  createPackageBooking,
  deletePackageBooking,
  getPackageBookings,
} from "../controller/packageBookingController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Superadmin only
router.get("/", authMiddleware(["superadmin"]), getPackageBookings);

// Public booking creation
router.post("/", createPackageBooking);

// Superadmin only
router.delete("/:id", authMiddleware(["superadmin"]), deletePackageBooking);

export default router;
