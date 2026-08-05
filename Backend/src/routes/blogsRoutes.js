import express from "express";
import {
	createBlog,
	deleteBlog,
	getBlogs,
	getBlogById,
	updateBlog,
} from "../controller/blogController.js";
import { withUpload } from "../middleware/ImageUpload.js";

const router = express.Router();


// Get all blogs
router.get("/", getBlogs);


// Get single blog
router.get("/:id", getBlogById);


// Create blog
router.post("/", withUpload, createBlog);


// Update blog
router.put("/:id", withUpload, updateBlog);


// Delete blog
router.delete("/:id", deleteBlog);


export default router;