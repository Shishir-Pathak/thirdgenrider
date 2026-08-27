import multer from "multer";

// Store file in memory for Cloudinary upload
const storage = multer.memoryStorage();

// Validate image files
const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."));
  }

  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// For single image upload
export const uploadImage = upload.single("image");

// For multiple image fields
export const uploadFields = upload.fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "licenseImage",
    maxCount: 1,
  },
  {
    name: "blueBookImages",
    maxCount: 10,
  },
]);
export const agentUploadFields = upload.fields([
  {
    name: "ctznShipFile",
    maxCount: 1,
  },
  {
    name: "panFile",
    maxCount: 1,
  },
]);

// Common middleware used in routes
export const withUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      console.log("UPLOAD ERROR:", err.message);

      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller."
            : err.message || "Upload failed.",
      });
    }

    // Convert image field so controllers can use req.file
    if (req.files && req.files.image && req.files.image.length > 0) {
      req.file = req.files.image[0];
    }

    // Debug checking
    console.log("MULTER BODY:", req.body);
    console.log("MAIN IMAGE:", req.file);
    console.log("ALL FILES:", req.files);
    console.log("BLUEBOOK FILES:", req.files?.blueBookImages);

    next();
  });
};
export const agentUpload = (req, res, next) => {
  agentUploadFields(req, res, (err) => {
    if (err) {
      console.log("UPLOAD ERROR:", err.message);

      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller."
            : err.message || "Upload failed.",
      });
    }

    // Convert image field so controllers can use req.file
    if (req.files && req.files.image && req.files.image.length > 0) {
      req.file = req.files.image[0];
    }

    // Debug checking
    console.log("MULTER BODY:", req.body);
    console.log("MAIN IMAGE:", req.file);
    console.log("ALL FILES:", req.files);

    next();
  });
};
