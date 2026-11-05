import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validate-schema.js";
import { createTask, getTaskById, updateTask, updateTaskDescription, updateTaskStatus, updateTaskTitle} from "../controllers/task.js";
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

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getTaskById
);

router.put(
  "/:taskId/update-title",
  authMiddleware,
  validateRequest({
      params: z.object({
          taskId: z.string(),
      }),
      body: z.object({
          title: z.string().min(1),
      }),
  }),
  updateTaskTitle
);

router.put(
  "/:taskId/description",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ description: z.string() }),
  }),
  updateTaskDescription
);

router.put(
  "/:taskId/status",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ status: z.string() }),
  }),
  updateTaskStatus
)


export default router;
