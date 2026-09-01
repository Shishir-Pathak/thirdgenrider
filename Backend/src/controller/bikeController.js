import Bike from "../models/Bike.js";
import { generateBikeQrCode } from "../utils/qrCode.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

// =========================
// DTO
// =========================
function toDTO(o) {
  if (!o) return null;

  return {
    id: o.id,
    userId: o.userId ?? null,
    ownerName: o.ownerName || "Admin",
    ownerBusiness: o.ownerBusiness || "",
    name: o.name,
    price: Number(o.pricePerDay || o.price_per_day || 0).toFixed(2),
    pricePerDay: Number(o.pricePerDay || o.price_per_day || 0),
    image: o.image || "",
    model: o.model || "",
    color: o.color || "",

    plateNumber: o.plateNumber || o.plate_number || "",
    chassisNumber: o.chassisNumber || o.chassis_number || "",
    engineNumber: o.engineNumber || o.engine_number || "",

    mileage: o.mileage ?? 0,
    available: Boolean(o.available),
    isBooked: Boolean(o.isBooked),
    activeBookingsCount: Number(o.activeBookingsCount || 0),
    totalBookingsCount: Number(o.totalBookingsCount || 0),
    isBike: Boolean(o.isBike),

    engineCapacity: o.engineCapacity ?? o.engine_capacity ?? 0,

    blueBookNumber: o.blueBookNumber || o.blue_book_number || "",

    blueBookImages:
      Array.isArray(o.blueBookImages) && o.blueBookImages.length > 0
        ? o.blueBookImages
        : Array.isArray(o.blue_book_images)
          ? o.blue_book_images
          : (() => {
              try {
                return o.blue_book_images ? JSON.parse(o.blue_book_images) : [];
              } catch {
                return [];
              }
            })(),

    takenImages:
      Array.isArray(o.takenImages) && o.takenImages.length > 0
        ? o.takenImages
        : Array.isArray(o.taken_images)
          ? o.taken_images
          : (() => {
              try {
                return o.taken_images ? JSON.parse(o.taken_images) : [];
              } catch {
                return [];
              }
            })(),

    licenseImage: o.licenseImage || o.license_image || "",

    qrCode: o.qrCode || o.qr_code || "",

    createdAt: o.createdAt || o.created_at,
    updatedAt: o.updatedAt || o.updated_at,
  };
}

// =========================
// Validation
// =========================
function validateBikePayload(payload, res) {
  if (!payload.name) {
    res.status(400).json({ message: "Name is required." });
    return false;
  }

  if (!Number.isFinite(payload.pricePerDay) || payload.pricePerDay < 0) {
    res.status(400).json({ message: "Invalid price per day." });
    return false;
  }

  return true;
}

// =========================
// Body Parser
// =========================
function getBikePayload(body) {
  return {
    name: body.name?.trim() || "",
    pricePerDay: Number(body.price ?? body.pricePerDay),
    model: body.model?.trim() || "",
    color: body.color?.trim() || "",
    plateNumber: body.plateNumber?.trim() || "",
    chassisNumber: body.chassisNumber?.trim() || "",
    engineNumber: body.engineNumber?.trim() || "",
    mileage: Number(body.mileage ?? 0),
    isBike:
      body?.isBike === "true" ||
      body?.isBike === true ||
      body?.isBike === "1" ||
      body?.isBike === 1,

    available:
      body.available === undefined
        ? undefined
        : body.available === "true" ||
          body.available === true ||
          body.available === "1" ||
          body.available === 1,

    engineCapacity: Number(body.engineCapacity ?? 0),
    blueBookNumber: body.blueBookNumber?.trim() || "",
  };
}

// =========================
// Upload Helpers
// =========================
async function uploadLicenseImage(req) {
  const file = req.files?.licenseImage?.[0];
  return file?.buffer ? await uploadImageBuffer(file.buffer) : "";
}

async function uploadBlueBookImages(req) {
  const files = req.files?.blueBookImages || [];

  const uploaded = await Promise.all(
    files.map((file) => uploadImageBuffer(file.buffer)),
  );

  return uploaded;
}

async function uploadTakenImages(req) {
  const files = req.files?.takenImages || [];

  const uploaded = await Promise.all(
    files.map((file) => uploadImageBuffer(file.buffer)),
  );

  return uploaded;
}

// =========================
// GET ALL BIKES
// =========================
export const getBikes = async (req, res) => {
  try {
    const isBikeParam =
      req.query.isBike !== undefined
        ? req.query.isBike === "1" || req.query.isBike === "true"
        : undefined;

    // Check if filtering by own vehicles (e.g. for agent dashboard)
    let userIdFilter = undefined;
    if (req.query.mine === "1" || req.query.mine === "true") {
      if (req.user && req.user.role !== "superadmin") {
        userIdFilter = req.user.id;
      }
    } else if (
      req.user &&
      (req.user.role === "agent" || req.user.role === "admin") &&
      req.query.all !== "1"
    ) {
      // If agent is authenticated and accessing admin view without public flag
      if (req.headers.authorization && req.query.public !== "1") {
        userIdFilter = req.user.id;
      }
    }

    const bikes = await Bike.findAll({
      isBike: isBikeParam,
      userId: userIdFilter,
    });

    res.json(bikes.map(toDTO));
  } catch (err) {
    console.error("Get Bikes Error:", err);
    res.status(500).json({
      message: err.message || "Failed to retrieve bikes.",
    });
  }
};

// =========================
// GET SINGLE BIKE
// =========================
export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    res.json(toDTO(bike));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to retrieve bike.",
    });
  }
};

// =========================
// CREATE BIKE
// =========================
export const createBike = async (req, res) => {
  try {
    const payload = getBikePayload(req.body);

    if (!validateBikePayload(payload, res)) return;

    // Upload bluebook images
    const blueBookImages = await uploadBlueBookImages(req);

    // Upload taken extra images
    const takenImages = await uploadTakenImages(req);

    // Determine ownership userId
    const userId =
      req.user && req.user.role !== "superadmin"
        ? req.user.id
        : req.body.userId || null;

    // Create bike
    const bike = await Bike.create({
      ...payload,
      userId,
      image: req.file?.buffer ? await uploadImageBuffer(req.file.buffer) : "",
      licenseImage: await uploadLicenseImage(req),
      blueBookImages,
      takenImages,
    });

    // Generate QR code
    let qrCode = "";
    try {
      qrCode = await generateBikeQrCode(req, bike.id.toString());
    } catch (qrErr) {
      console.warn("QR code generation warning:", qrErr.message);
    }

    // Update bike with QR code
    const updatedBike = await Bike.update(bike.id, {
      ...bike,
      qrCode,
      blueBookImages: bike.blueBookImages || blueBookImages,
      takenImages: bike.takenImages || takenImages,
    });

    res.status(201).json(toDTO(updatedBike));
  } catch (err) {
    console.error("Create Bike Error:", err);
    res.status(500).json({
      message: err.message || "Failed to create bike.",
    });
  }
};

// =========================
// UPDATE BIKE
// =========================
export const updateBike = async (req, res) => {
  try {
    const oldBike = await Bike.findById(req.params.id);

    if (!oldBike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    // Access control: If not superadmin, verify agent owns this bike
    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(oldBike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to modify your own vehicles.",
      });
    }

    const updates = {};
    const payload = getBikePayload(req.body);

    // Keep false and 0 values
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        updates[key] = payload[key];
      }
    });

    // Main image
    updates.image = req.file?.buffer
      ? await uploadImageBuffer(req.file.buffer)
      : oldBike.image;

    // License image
    const licenseImage = await uploadLicenseImage(req);

    updates.licenseImage =
      licenseImage || oldBike.licenseImage || oldBike.license_image || "";

    // Existing bluebook images
    const existingBlueBookImages =
      oldBike.blueBookImages ||
      (() => {
        try {
          return oldBike.blue_book_images
            ? JSON.parse(oldBike.blue_book_images)
            : [];
        } catch {
          return [];
        }
      })();

    // New bluebook images
    const newBlueBookImages = await uploadBlueBookImages(req);

    updates.blueBookImages = [...existingBlueBookImages, ...newBlueBookImages];

    // Existing taken images
    const existingTakenImages =
      oldBike.takenImages ||
      (() => {
        try {
          return oldBike.taken_images ? JSON.parse(oldBike.taken_images) : [];
        } catch {
          return [];
        }
      })();

    // New taken images
    const newTakenImages = await uploadTakenImages(req);

    updates.takenImages = [...existingTakenImages, ...newTakenImages];

    const updated = await Bike.update(req.params.id, {
      ...oldBike,
      ...updates,
    });

    res.json(toDTO(updated));
  } catch (err) {
    console.error("Update Bike Error:", err);
    res.status(500).json({
      message: err.message || "Failed to update bike.",
    });
  }
};

// =========================
// TOGGLE AVAILABILITY (LIST / DELIST)
// =========================
export const toggleBikeAvailability = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    // Access control: If not superadmin, verify agent owns this bike
    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(bike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to modify your own vehicles.",
      });
    }

    const nextAvailable =
      req.body.available !== undefined
        ? Boolean(req.body.available)
        : !bike.available;

    const updated = await Bike.updateAvailability(req.params.id, nextAvailable);

    res.json(toDTO(updated));
  } catch (err) {
    console.error("Toggle Availability Error:", err);
    res.status(500).json({
      message: err.message || "Failed to update vehicle availability.",
    });
  }
};

// =========================
// DELETE LICENSE IMAGE
// =========================
export const deleteBikeLicenseImage = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(bike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to modify your own vehicles.",
      });
    }

    const updated = await Bike.update(req.params.id, {
      ...bike,
      licenseImage: "",
    });

    res.json(toDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete license image.",
    });
  }
};

// =========================
// DELETE BLUEBOOK IMAGE
// =========================
export const deleteBikeBlueBookImage = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(bike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to modify your own vehicles.",
      });
    }

    const index = Number(req.params.imageIndex);

    const existingImages =
      bike.blueBookImages ||
      (() => {
        try {
          return bike.blue_book_images ? JSON.parse(bike.blue_book_images) : [];
        } catch {
          return [];
        }
      })();

    if (index < 0 || index >= existingImages.length) {
      return res.status(404).json({
        message: "Bluebook image not found.",
      });
    }

    existingImages.splice(index, 1);

    const updated = await Bike.update(req.params.id, {
      ...bike,
      blueBookImages: existingImages,
    });
  } catch (e) {
    console.error("Delete Bluebook Image Error:", e);
    res.status(500).json({
      message: e.message || "Failed to delete bluebook image.",
    });
  }
};

// =========================
// DELETE TAKEN IMAGE
// =========================
export const deleteBikeTakenImage = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(bike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to modify your own vehicles.",
      });
    }

    const index = Number(req.params.imageIndex);

    const existingImages =
      bike.takenImages ||
      (() => {
        try {
          return bike.taken_images ? JSON.parse(bike.taken_images) : [];
        } catch {
          return [];
        }
      })();

    if (index < 0 || index >= existingImages.length) {
      return res.status(404).json({
        message: "Taken photo not found.",
      });
    }

    existingImages.splice(index, 1);

    const updated = await Bike.update(req.params.id, {
      ...bike,
      takenImages: existingImages,
    });

    res.json(toDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete taken image.",
    });
  }
};

// =========================
// DELETE BIKE
// =========================
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found." });
    }

    // Access control: If not superadmin, verify agent owns this bike
    if (
      req.user &&
      req.user.role !== "superadmin" &&
      String(bike.userId) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are only authorized to delete your own vehicles.",
      });
    }

    const deleted = await Bike.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Bike not found." });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete bike.",
    });
  }
};
