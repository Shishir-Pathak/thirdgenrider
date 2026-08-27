import express from "express";

const agentRoute = express.Router();

import {
  getAllAgent,
  deleteAgent,
  agentRegister,
  agentLogin,
  updateAgent,
} from "../controller/agentController.js";
import { agentUpload } from "../middleware/ImageUpload.js";
import authMiddleware from "../middleware/authmiddleware.js";
import { validateAgent } from "../middleware/agentValidationMiddleware.js";
agentRoute.get("/", authMiddleware(["superadmin"]), getAllAgent);
agentRoute.post("/register", agentUpload, validateAgent, agentRegister);
agentRoute.post("/login", agentLogin);
agentRoute.delete("/:id", authMiddleware(["superadmin"]), deleteAgent);
agentRoute.put("/:id", authMiddleware(["superadmin"]), updateAgent);

export default agentRoute;
