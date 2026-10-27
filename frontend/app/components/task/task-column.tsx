import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types";

interface TaskColumnProps {
  title: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onMarkAsTodo?: (taskId: string) => void;
}

export function TaskColumn({
  title,
  tasks,
  onTaskClick,
  onMarkAsTodo,
}: TaskColumnProps) {
  return (
    <section className="min-w-0 rounded-lg border p-4">
      <h3 className="mb-4 flex items-center justify-between font-semibold">
        {title}
        <span className="rounded-full bg-muted px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tasks yet
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="rounded-lg border p-3">
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

                <p className="mt-2 text-xs text-muted-foreground">
                  Priority: {task.priority}
                </p>
              </button>

              {task.status !== "To Do" && onMarkAsTodo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onMarkAsTodo(task._id)}
                >
                  <AlertCircle  />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}