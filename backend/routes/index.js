import express from "express";

import workspaceRoutes from "./workspace.js"
import authRoutes from "./auth.js";
import projectRoutes from "./project.js";
import taskRoutes from  "./task.js";

const router = express.Router(); 

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;