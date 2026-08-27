import Bike from "../models/Bike.js";
import BikeBooking from "../models/BikeBookings.js";
import { sendBookingConfirmationEmail } from "../utils/email.js";
import dotenv from "dotenv";

dotenv.config();

function toDTO(o) {
  if (!o) return null;

  const ownerName =
    o.owner_business_name ||
    (o.owner_first_name
      ? `${o.owner_first_name} ${o.owner_last_name || ""}`.trim()
      : "Admin");

  return {
    id: o.id,
    bike: o.bike_id
      ? {
          id: o.bike_id,
          name: o.bike_name || "",
          image: o.bike_image || "",
          ownerId: o.bike_owner_id || null,
          ownerName,
        }
      : null,

    bikeId: o.bike_id,
    bikeName: o.bike_name || "",
    bikeImage: o.bike_image || "",
    bikeOwnerId: o.bike_owner_id || null,
    ownerName,
    ownerBusiness: o.owner_business_name || "",

    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,

    pickupDate: o.pickup_date,
    returnDate: o.return_date,

    pickupLocation: o.pickup_location,
    returnLocation: o.return_location,

    message: o.message || "",
    status: o.status || "confirmed",
    createdAt: o.created_at,
  };
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function validateBookingBody(body, res) {
  const bike = body.bike;

  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";

  const customerEmail =
    typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";

  const customerPhone =
    typeof body.customerPhone === "string" ? body.customerPhone.trim() : "";

  const pickupLocation = body.pickupLocation?.trim() || "";
  const returnLocation = body.returnLocation?.trim() || "";

  const pickupDate = parseDate(body.pickupDate);
  const returnDate = parseDate(body.returnDate);

  const message = body.message?.trim() || "";

  if (!bike) {
    res.status(400).json({ message: "Bike is required." });
    return null;
  }

  if (!customerName) {
    res.status(400).json({ message: "Full name is required." });
    return null;
  }

  if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
    res.status(400).json({ message: "Valid email is required." });
    return null;
  }

  if (!customerPhone) {
    res.status(400).json({ message: "Phone is required." });
    return null;
  }

  if (!pickupDate) {
    res.status(400).json({ message: "Valid pickup date required." });
    return null;
  }

  if (!returnDate) {
    res.status(400).json({ message: "Valid return date required." });
    return null;
  }

  if (returnDate < pickupDate) {
    res.status(400).json({ message: "Return date must be after pickup date." });
    return null;
  }

  return {
    bike,
    customerName,
    customerEmail,
    customerPhone,
    pickupDate,
    returnDate,
    pickupLocation,
    returnLocation,
    message,
  };
}

// GET ALL BOOKINGS (Filtered by owner for agents, all for superadmin)
export const getBikeBookings = async (req, res) => {
  try {
    const isSuperAdmin = req.user?.role === "superadmin";
    const userId = isSuperAdmin ? null : req.user?.id;

    const bookings = await BikeBooking.findAll(userId);
    res.json(bookings.map(toDTO));
  } catch (err) {
    console.error("Get Bike Bookings Error:", err);
    res.status(500).json({
      message: err.message || "Failed to retrieve bookings.",
    });
  }
};

// CREATE BOOKING (Public)
export const createBikeBooking = async (req, res) => {
  try {
    const data = validateBookingBody(req.body, res);
    if (!data) return;

    const bike = await Bike.findById(data.bike);
    if (!bike) {
      return res.status(404).json({
        message: "Bike not found.",
      });
    }

    const booking = await BikeBooking.create(data);
    const response = toDTO(booking);

    res.status(201).json(response);

    sendBookingConfirmationEmail({
      bookingType: "Bike Rental",
      itemName: bike.name || "Bike",
      customerEmail: booking.customer_email,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      pickupDate: booking.pickup_date,
      returnDate: booking.return_date,
      pickupLocation: booking.pickup_location,
      returnLocation: booking.return_location,
      message: booking.message,
    }).catch((err) => {
      console.error("Email error:", err.message);
    });
  } catch (err) {
    console.error("Create Bike Booking Error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        message: err.message || "Failed to create booking.",
      });
    }
  }
};

// DELETE BOOKING
export const deleteBikeBooking = async (req, res) => {
  try {
    const booking = await BikeBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // Access control: If agent, ensure booking is for their bike
    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(booking.bike_owner_id) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "Forbidden: You are only authorized to delete bookings for your own vehicles.",
      });
    }

    const deleted = await BikeBooking.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Delete Bike Booking Error:", err);
    res.status(500).json({
      message: err.message || "Failed to delete booking.",
    });
  }
};