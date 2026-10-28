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