import express from "express";
import {
	createPackageBooking,
	deletePackageBooking,
	getPackageBookings,
} from "../controller/packageBookingController.js";

const router = express.Router();

router.get("/", getPackageBookings);
router.post("/", createPackageBooking);
router.delete("/:id", deletePackageBooking);

export default router;
