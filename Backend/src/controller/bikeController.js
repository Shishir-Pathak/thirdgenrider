import Bike from "../models/Bike.js";
import { generateBikeQrCode } from "../utils/qrCode.js";
import { uploadImageBuffer } from "../utils/uploadToCloudinary.js";

function toDTO(o) {
    if (!o) return null;

    return {
        id: o._id || o.id, // Handle Mongoose _id mapping
        name: o.name,
        price: Number(o.pricePerDay || 0).toFixed(2),
        image: o.image || "",
        model: o.model || "",
        color: o.color || "",
        plateNumber: o.plate_number || o.plateNumber || "",
        chassisNumber: o.chassis_number || o.chassisNumber || "",
        engineNumber: o.engine_number || o.engineNumber || "",
        mileage: o.mileage ?? 0,
        available: Boolean(o.available),
        engineCapacity: o.engine_capacity ?? o.engineCapacity ?? 0,
        blueBookNumber: o.blue_book_number || o.blueBookNumber || "",
        blueBookImages: o.blueBookImages || [],
        licenseImage: o.license_image || o.licenseImage || "",
        qrCode: o.qr_code || o.qrCode || "",
        createdAt: o.createdAt || o.created_at,
        updatedAt: o.updatedAt || o.updated_at,
    };
}

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
        available: body.available === "true" || body.available === true,
        engineCapacity: Number(body.engineCapacity ?? 0),
        blueBookNumber: body.blueBookNumber?.trim() || "",
    };
}

async function uploadLicenseImage(req) {
    const file = req.files?.licenseImage?.[0];
    return file?.buffer ? await uploadImageBuffer(file.buffer) : "";
}

function uploadBlueBookImages(req) {
    const files = req.files?.blueBookImages || [];
    return Promise.all(
        files.map(file => uploadImageBuffer(file.buffer))
    );
}

/*
 GET ALL BIKES
*/
export const getBikes = async (req, res) => {
    try {
        const bikes = await Bike.findAll();

        res.json(bikes.map(toDTO));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to retrieve bikes." });
    }
};

/*
 GET SINGLE BIKE
*/
export const getBikeById = async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);

        if (!bike) {
            return res.status(404).json({ message: "Bike not found." });
        }

        res.json(toDTO(bike));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to retrieve bike." });
    }
};

/*
 CREATE BIKE
*/
export const createBike = async (req, res) => {
    try {
        const payload = getBikePayload(req.body);

        if (!validateBikePayload(payload, res)) return;

        const bike = await Bike.create({
            ...payload,
            image: req.file?.buffer
                ? await uploadImageBuffer(req.file.buffer)
                : "",
            licenseImage: await uploadLicenseImage(req),
            blueBookImages: await uploadBlueBookImages(req),
        });

    const qrCode = await generateBikeQrCode(
    req,
    bike.id.toString()
);

const updated = await Bike.update(
    bike.id,
    {
        ...bike,
        qrCode
    }
);

        res.status(201).json(toDTO(updated));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to create bike." });
    }
};

/*
 UPDATE BIKE
*/
export const updateBike = async (req, res) => {
    try {
        const oldBike = await Bike.findById(req.params.id);

        if (!oldBike) {
            return res.status(404).json({ message: "Bike not found." });
        }

        const updates = {
            ...getBikePayload(req.body)
        };

        if (req.file?.buffer) {
            updates.image = await uploadImageBuffer(req.file.buffer);
        }

        const licenseImage = await uploadLicenseImage(req);
        if (licenseImage) {
            updates.licenseImage = licenseImage;
        }

        const blueBookImages = await uploadBlueBookImages(req);
        if (blueBookImages.length) {
            updates.blueBookImages = [
                ...(oldBike.blueBookImages || []),
                ...blueBookImages
            ];
        }

        // Changed Bike.update to Bike.findByIdAndUpdate
     const updated = await Bike.update(
    req.params.id,
    {
        ...oldBike,
        ...updates
    }
);

        res.json(toDTO(updated));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to update bike." });
    }
};

/*
 DELETE LICENSE IMAGE
*/
export const deleteBikeLicenseImage = async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);

        if (!bike) {
            return res.status(404).json({ message: "Bike not found." });
        }

        // Changed Bike.update to Bike.findByIdAndUpdate
      const updated = await Bike.update(
    req.params.id,
    {
        ...bike,
        licenseImage: ""
    }
);

        res.json(toDTO(updated));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete license image." });
    }
};

/*
 DELETE BLUEBOOK IMAGE
*/
export const deleteBikeBlueBookImage = async (req, res) => {
    try {
        const bike = await Bike.findById(req.params.id);

        if (!bike) {
            return res.status(404).json({ message: "Bike not found." });
        }

        const index = Number(req.params.imageIndex);
        const images = bike.blueBookImages || [];

        if (index < 0 || index >= images.length) {
            return res.status(404).json({ message: "Bluebook image not found." });
        }

        images.splice(index, 1);

        // Changed Bike.update to Bike.findByIdAndUpdate
     const updated = await Bike.update(
    req.params.id,
    {
        ...bike,
        blueBookImages: images
    }
);

        res.json(toDTO(updated));
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete bluebook image." });
    }
};

/*
 DELETE BIKE
*/
export const deleteBike = async (req, res) => {
    try {
        // Changed Bike.delete to Bike.findByIdAndDelete
        const deleted = await Bike.delete(
    req.params.id
);

        if (!deleted) {
            return res.status(404).json({ message: "Bike not found." });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete bike." });
    }
};