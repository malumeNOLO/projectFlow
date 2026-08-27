import express from "express";

import authRoutes from "./auth.js";

const router = express.Router(); 

const port = 5000;

router.use("/auth", authRoutes);

export default router;