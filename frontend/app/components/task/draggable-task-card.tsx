
import { useDraggable } from "@dnd-kit/react";
import type { Task } from "@/types";

interface DraggableTaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

export function DraggableTaskCard({
  task,
  onTaskClick,
}: DraggableTaskCardProps) {
  const { ref } = useDraggable({
    id: `task-${task._id}`,
    data: { taskId: task._id },
  });

  return (
    <div
      ref={ref}
      className="cursor-grab rounded-lg border bg-card p-3 shadow-sm active:cursor-grabbing"
    >
      <button
        type="button"
        onClick={() => onTaskClick(task._id)}
        className="w-full text-left"
      >
        <p className="font-medium">{task.title}</p>

        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              task.priority === "High"
                ? "bg-green-100 text-green-700"
                : task.priority === "Medium"
                  ? "bg-orange-100 text-orange-700"
                  : task.priority === "Low"
                    ? "bg-red-100 text-red-700"
                    : "bg-muted text-muted-foreground"
            }`}
          >
            {task.priority}
          </span>

          {task.dueDate && (
            <p className="text-xs text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>


        {task.dueDate && (
          <p className="text-xs text-muted-foreground">
               Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </button>
    </div>
  );
}
