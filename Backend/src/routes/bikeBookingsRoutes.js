import express from "express";
import {
	createBikeBooking,
	deleteBikeBooking,
	getBikeBookings,
} from "../controller/bikeBookingController.js";

const router = express.Router();

router.get("/", getBikeBookings);
router.post("/", createBikeBooking);
router.delete("/:id", deleteBikeBooking);

export default router;
