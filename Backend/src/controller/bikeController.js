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
    name: o.name,
    price: Number(o.pricePerDay || o.price_per_day || 0).toFixed(2),
    image: o.image || "",
    model: o.model || "",
    color: o.color || "",

    plateNumber: o.plateNumber || o.plate_number || "",
    chassisNumber: o.chassisNumber || o.chassis_number || "",
    engineNumber: o.engineNumber || o.engine_number || "",

    mileage: o.mileage ?? 0,
    available: Boolean(o.available),

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
  console.log("body", body);
  return {
    name: body.name?.trim() || "",
    pricePerDay: Number(body.price ?? body.pricePerDay),
    model: body.model?.trim() || "",
    color: body.color?.trim() || "",
    plateNumber: body.plateNumber?.trim() || "",
    chassisNumber: body.chassisNumber?.trim() || "",
    engineNumber: body.engineNumber?.trim() || "",
    mileage: Number(body.mileage ?? 0),
    isBike: body?.isBike || false,

    available:
      body.available === undefined
        ? undefined
        : body.available === "true" || body.available === true,

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

// =========================
// GET ALL BIKES
// =========================
export const getBikes = async (req, res) => {
  try {
    const isBike = req.query.isBike === "1";
    const bikes = await Bike.findAll(isBike);
    res.json(bikes.map(toDTO));
  } catch (err) {
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

    // Create bike
    const bike = await Bike.create({
      ...payload,
      image: req.file?.buffer ? await uploadImageBuffer(req.file.buffer) : "",
      licenseImage: await uploadLicenseImage(req),
      blueBookImages,
    });
    console.log("Creted biek payload", payload);

    // Generate QR code
    const qrCode = await generateBikeQrCode(req, bike.id.toString());

    // Update bike with QR code
    const updatedBike = await Bike.update(bike.id, {
      ...bike,
      qrCode,
      blueBookImages: bike.blueBookImages || blueBookImages,
    });

    res.status(201).json(toDTO(updatedBike));
  } catch (err) {
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

    const updated = await Bike.update(req.params.id, {
      ...oldBike,
      ...updates,
    });
    console.log(updated, "updated\n");

    res.json(toDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to update bike.",
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

    res.json(toDTO(updated));
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete bluebook image.",
    });
  }
};

// =========================
// DELETE BIKE
// =========================
export const deleteBike = async (req, res) => {
  try {
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
