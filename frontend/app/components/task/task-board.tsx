
import { DragDropProvider } from "@dnd-kit/react";
import type { Task, TaskStatus } from "@/types";
import { DroppableTaskColumn } from "./droppable-task-column";

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statuses: TaskStatus[] = ["To Do", "In Progress", "Done"];

export function TaskBoard({
  tasks,
  onTaskClick,
  onStatusChange,
}: TaskBoardProps) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const sourceId = String(event.operation.source?.id ?? "");
        const targetId = String(event.operation.target?.id ?? "");

        const taskId = sourceId.startsWith("task-")
          ? sourceId.slice("task-".length)
          : "";

        const status = targetId.startsWith("status-")
          ? targetId.slice("status-".length) as TaskStatus
          : null;

        if (
          taskId &&
          statuses.includes(status as TaskStatus)
        ) {
          const task = tasks.find((item) => item._id === taskId);

          if (task && task.status !== status) {
            onStatusChange(taskId, status as TaskStatus);
          }
        }
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <DroppableTaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
