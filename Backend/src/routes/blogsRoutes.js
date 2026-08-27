import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  updateBlog,
} from "../controller/blogController.js";
import { withUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Get all blogs (public)
router.get("/", getBlogs);

// Get single blog (public)
router.get("/:id", getBlogById);

// Create blog (superadmin only)
router.post("/", authMiddleware(["superadmin"]), withUpload, createBlog);

// Update blog (superadmin only)
router.put("/:id", authMiddleware(["superadmin"]), withUpload, updateBlog);

// Delete blog (superadmin only)
router.delete("/:id", authMiddleware(["superadmin"]), deleteBlog);

export default router;