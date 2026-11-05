import { recordActivity } from "../libs/index.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

 export const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            title,
            description,
            status,
            priority,
            assignee,
            dueDate,
            estimatedHours,
            tags,
        } = req.body;

        // Check that the project exists.
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        // Check that the logged-in user belongs to the project.
        const isMember = project.members.some((member) => {
            const memberId = member.user?._id ?? member.user;
            return memberId.toString() === req.user._id.toString();
        });

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        // Check that the assignee is a project member.
        const isAssigneeMember = project.members.some((member) => {
            const memberId = member.user?._id ?? member.user;
            return memberId.toString() === assignee;
        });

        if (!isAssigneeMember) {
            return res.status(400).json({
                message: "The assignee must be a member of this project",
            });
        }

        const tagArray = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

        const task = await Task.create({
            title,
            description,
            project: projectId,
            status,
            priority,
            assignee,
            dueDate: dueDate || undefined,
            estimatedHours,
            tags: tagArray,
            createdBy: req.user._id,
        });

        // Add the task to the project's task list.
        project.tasks.push(task._id);
        await project.save();

        const populatedTask = await Task.findById(task._id)
            .populate("assignee", "name email profilePicture");

        return res.status(201).json({
            message: "Task created successfully",
            task: populatedTask,
        });
    } catch (error) {
        console.error("Create task error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;
  
      const allowedStatuses = ["To Do", "In Progress", "Done"];
  
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }
  
      const task = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }
  
      return res.status(200).json({
        message: "Task updated successfully",
        task,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update task",
      });
    }
  };

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
    .populate("assignee", "name profilePicture")
    .populate("watchers", "name profilePicture");

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const project = await Project.findById(task.project)
  .populate("members.user", "name profilePicture");

    return res.status(200).json({task, project});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTaskTitle = async (req, res) => {
  try {
      const { taskId } = req.params;
      const { title } = req.body;

      // Validate title
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      // Find task
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({
              message: "Task not found",
          });
      }

      // Find associated project
      const project = await Project.findById(task.project);

      if (!project) {
          return res.status(404).json({
              message: "Project not found",
          });
      }

      // Check project membership
      const isMember = project.members.some((member) => {
          const memberId = member.user?._id ?? member.user;

          return memberId?.toString() === req.user._id.toString();
      });

      if (!isMember) {
          return res.status(403).json({
              message: "You are not a member of this project",
          });
      }

      // Update title
      const oldTitle = task.title;

      task.title = title.trim();

      await task.save();

      // Record activity
      await recordActivity(
          req.user._id,
          "updated_task",
          "Task",
          task._id,
          {
              description: `Updated task title from ${oldTitle} to ${task.title}`,
          }
      );

      return res.status(200).json({
          message: "Task title updated successfully",
          task,
      });

  } catch (error) {
      console.error("Update task title error:", error);

      return res.status(500).json({
          message: "Failed to update task title",
          error: error.message,
      });
  }
};

export const updateTaskDescription = async (req, res) => {
  try {
      const { taskId } = req.params;
      const { description } = req.body;

      // Validate description
      if (typeof description !== "string") {
          return res.status(400).json({
              message: "Task description must be a string",
          });
      }

      // Find task
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({
              message: "Task not found",
          });
      }

      // Find associated project
      const project = await Project.findById(task.project);

      if (!project) {
          return res.status(404).json({
              message: "Project not found",
          });
      }

      // Check project membership
      const isMember = project.members.some((member) => {
          const memberId = member.user?._id ?? member.user;

          return memberId?.toString() === req.user._id.toString();
      });

      if (!isMember) {
          return res.status(403).json({
              message: "You are not a member of this project",
          });
      }

      // Save old description
      const oldDescription = task.description || "";

      // Update description
      task.description = description;

      await task.save();

      // Record activity
      await recordActivity(
          req.user._id,
          "updated_task",
          "Task",
          task._id,
          {
              description: `Updated task description from "${oldDescription.substring(0, 50)}" to "${description.substring(0, 50)}"`,
          }
      );

      return res.status(200).json({
          message: "Task description updated successfully",
          task,
      });

  } catch (error) {
      console.error("Update task description error:", error);

      return res.status(500).json({
          message: "Failed to update task description",
      });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
      const { taskId } = req.params;
      const { status } = req.body;

      // Validate title
      if (!status || !status.trim()) {
          return res.status(400).json({
              message: "Task status is required",
          });
      }

      // Find task
      const task = await Task.findById(taskId);

      if (!task) {
          return res.status(404).json({
              message: "Task not found",
          });
      }

      // Find associated project
      const project = await Project.findById(task.project);

      if (!project) {
          return res.status(404).json({
              message: "Project not found",
          });
      }

      // Check project membership
      const isMember = project.members.some((member) => {
          const memberId = member.user?._id ?? member.user;

          return memberId?.toString() === req.user._id.toString();
      });

      if (!isMember) {
          return res.status(403).json({
              message: "You are not a member of this project",
          });
      }

      // Update title
      const oldStatus = task.status;

      task.status = status.trim();

      await task.save();

      // Record activity
      await recordActivity(
          req.user._id,
          "updated_task",
          "Task",
          task._id,
          {
              description: `Updated task status from ${oldStatus} to ${task.status}`,
          }
      );

      return res.status(200).json({
          message: "Task status updated successfully",
          task,
      });

  } catch (error) {
      console.error("Update task status error:", error);

      return res.status(500).json({
          message: "Failed to update task status",
          error: error.message,
      });
  }
};