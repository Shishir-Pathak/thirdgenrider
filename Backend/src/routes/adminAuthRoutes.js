import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin route working",
  });
});

// Admin / Superadmin / Agent Unified Login
router.post("/login", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const loginIdentifier = (username || email || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username/email and password.",
      });
    }

    // 1. Check if matches Superadmin environment credentials
    if (
      (loginIdentifier === process.env.ADMIN_USERNAME ||
        loginIdentifier.toLowerCase() === (process.env.ADMIN_USERNAME || "").toLowerCase()) &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const accessToken = jwt.sign(
        {
          id: "superadmin",
          email: process.env.ADMIN_USERNAME || "admin",
          name: "Super Admin",
          role: "superadmin",
          status: "approved",
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Superadmin login successful",
        accessToken,
        user: {
          id: "superadmin",
          email: process.env.ADMIN_USERNAME || "admin",
          name: "Super Admin",
          role: "superadmin",
          status: "approved",
        },
      });
    }

    // 2. Check Database users (Agents / Admins)
    const user = await User.findByEmail(loginIdentifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    // Check approval status
    if (user.status === "pending" || user.role === "none") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending verification and approval by Superadmin.",
        status: "pending",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your agent application has been rejected by Superadmin.",
        status: "rejected",
      });
    }

    const role = user.role || "agent";
    const displayName =
      user.businessName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email;

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: displayName,
        role: role,
        status: user.status || "approved",
        businessName: user.businessName,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: displayName,
        role: role,
        status: user.status || "approved",
        businessName: user.businessName,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
});

// Current User Profile Endpoint
router.get("/me", authMiddleware(), async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;