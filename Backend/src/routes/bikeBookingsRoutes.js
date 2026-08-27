import express from "express";
import {
  createBikeBooking,
  deleteBikeBooking,
  getBikeBookings,
} from "../controller/bikeBookingController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// GET is protected: agent sees their own bike bookings, superadmin sees all
router.get("/", authMiddleware(["agent", "admin", "superadmin"]), getBikeBookings);

// POST is public for customer bookings
router.post("/", createBikeBooking);

// DELETE is protected: agent can delete bookings for their bikes, superadmin can delete any
router.delete("/:id", authMiddleware(["agent", "admin", "superadmin"]), deleteBikeBooking);

export default router;
