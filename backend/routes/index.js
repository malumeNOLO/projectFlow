import express from "express";

import workspaceRoutes from "./workspace.js"
import authRoutes from "./auth.js";
import projectRoutes from "./project.js"

const router = express.Router(); 

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);

export default router;