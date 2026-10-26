import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const {
            title,
            description,
            status,
            startDate,
            dueDate,
            tags,
            members,
        } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const isMember = workspace.members.some(
            (member) =>
                member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const tagArray = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

        const projectMembers = (members ?? []).map((member) => ({
            user: member.user,
            role:
                member.role === "owner" || member.role === "admin"
                    ? "manager"
                    : member.role === "viewer"
                        ? "viewer"
                        : "contributor",
        }));

        // Ensure the creator is included in the project members.
        const creatorIsMember = projectMembers.some(
            (member) =>
                member.user.toString() === req.user._id.toString()
        );

        if (!creatorIsMember) {
            projectMembers.push({
                user: req.user._id,
                role: "manager",
            });
        } else {
            projectMembers[creatorIndex].role = "manager";
        }
        const newProject = await Project.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags: tagArray,
            workspace: workspaceId,
            members: projectMembers,
            createdBy: req.user._id,
        });

        workspace.projects.push(newProject._id);
        await workspace.save();

        return res.status(201).json(newProject);
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate("members.user", "name email profilePicture");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => {
            const memberId = member.user?._id ?? member.user;
            return memberId.toString() === req.user._id.toString();
        });

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        return res.status(200).json({ project });
    } catch (error) {
        console.error("Get project details error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate("members.user", "name email profilePicture");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some((member) => {
            const memberId = member.user?._id ?? member.user;
            return memberId.toString() === req.user._id.toString();
        });

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const tasks = await Task.find({
            project: projectId,
            isArchived: { $ne: true },
        })
            .populate("assignee", "name profilePicture")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            project,
            tasks,
        });
    } catch (error) {
        console.error("Get project tasks error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const userId = req.user._id.toString();

        const membership = project.members.find((member) => {
            const memberId = member.user?._id ?? member.user;
            return memberId.toString() === userId;
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        if (!["manager", "owner", "viewer", "admin"].includes(membership.role)) {
            return res.status(403).json({
                message: "You do not have permission to delete this project",
            });
            console.log("Current user ID:", userId);
            console.log("Matched membership:", membership);
            console.log("Current project role:", membership.role);
        }

        // Remove tasks belonging to this project.
        await Task.deleteMany({ project: projectId });

        // Remove the project reference from its workspace.
        await Workspace.updateOne(
            { _id: project.workspace },
            { $pull: { projects: project._id } }
        );

        await Project.findByIdAndDelete(projectId);

        return res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export { createProject, getProjectDetails, getProjectTasks, deleteProject };