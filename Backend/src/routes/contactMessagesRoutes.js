import express from "express";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
} from "../controller/contactMessageController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Superadmin only
router.get("/", authMiddleware(["superadmin"]), getContactMessages);

// Public contact submission
router.post("/", createContactMessage);

// Superadmin only
router.delete("/:id", authMiddleware(["superadmin"]), deleteContactMessage);

export default router;
