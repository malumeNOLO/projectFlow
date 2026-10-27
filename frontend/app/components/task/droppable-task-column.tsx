
import { useDroppable } from "@dnd-kit/react";
import type { Task, TaskStatus } from "@/types";
import { DraggableTaskCard } from "./draggable-task-card";

interface DroppableTaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function DroppableTaskColumn({
  status,
  tasks,
  onTaskClick,
}: DroppableTaskColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: `status-${status}`,
  });

  return (
    <section
      ref={ref}
      className={`min-h-64 rounded-lg border p-4 transition-colors ${
        isDropTarget ? "border-primary bg-muted" : ""
      }`}
    >
      <h3 className="mb-4 flex items-center justify-between font-semibold">
        {status}
        <span className="rounded-full bg-muted px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task._id}
            task={task}
            onTaskClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Drop tasks here
          </p>
        )}
      </div>
    </section>
  );
}
