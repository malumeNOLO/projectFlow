import express from "express";
import workspaceRoutes from "./workspace.js"
import authRoutes from "./auth.js";

const router = express.Router(); 

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes)

export default router;