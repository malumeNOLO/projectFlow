import type { TaskStatus } from "@/types";

export const TaskStatusSelector = ({ status, taskId }: { status: TaskStatus; taskId: string }) => {
  return (
    <div>
      Task Status Selector
    </div>
  );
};