import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    watchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    estimatedHours: {
      type: Number,
      min: 0,
    },

    actualHours: {
      type: Number,
      min: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        isCompleted: {
          type: Boolean,
          default: false,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    attachments: [
      {
        fileName: {
          type: String,
          required: true,
          trim: true,
        },

        fileUrl: {
          type: String,
          required: true,
        },

        fileType: {
          type: String,
        },

        fileSize: {
          type: Number,
          min: 0,
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },

        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;