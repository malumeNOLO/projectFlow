import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validate-schema.js";
import { createTask, updateTask } from "../controllers/task.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
    "/:projectId/create-task",
    authMiddleware,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
        body: taskSchema,
    }),
    createTask
);

router.put(
    "/:taskId",
    authMiddleware,
    (req, res, next) => {
      console.log("PUT task body:", req.body);
      next();
    },
    validateRequest({
      params: z.object({
        taskId: z.string(),
      }),
      body: z.object({
        status: z.enum(["To Do", "In Progress", "Done"]),
      }),
    }),
    updateTask
  );  


export default router;
