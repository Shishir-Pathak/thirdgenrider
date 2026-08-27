import express from "express";

const agentRoute = express.Router();

import {
  getAllAgent,
  getAgentStats,
  deleteAgent,
  agentRegister,
  agentLogin,
  updateAgent,
  updateAgentStatus,
} from "../controller/agentController.js";
import { agentUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";
import { validateAgent } from "../middleware/agentValidationMiddleware.js";

// Public endpoints
agentRoute.post("/register", agentUpload, validateAgent, agentRegister);
agentRoute.post("/login", agentLogin);

// Superadmin-only endpoints
agentRoute.get("/stats", authMiddleware(["superadmin"]), getAgentStats);
agentRoute.get("/", authMiddleware(["superadmin"]), getAllAgent);
agentRoute.patch("/:id/status", authMiddleware(["superadmin"]), updateAgentStatus);
agentRoute.put("/:id/status", authMiddleware(["superadmin"]), updateAgentStatus);
agentRoute.put("/:id", authMiddleware(["superadmin"]), updateAgent);
agentRoute.delete("/:id", authMiddleware(["superadmin"]), deleteAgent);

export default agentRoute;
