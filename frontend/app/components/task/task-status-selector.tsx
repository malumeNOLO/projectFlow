
import type { TaskStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/use-tasks";
import { toast } from "sonner";

interface TaskStatusSelectorProps {
  status: TaskStatus;
  taskId: string;
  projectId: string;
}

export const TaskStatusSelector = ({
  status,
  taskId,
  projectId,
}: TaskStatusSelectorProps) => {
  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleStatusChange = (value: string) => {
    mutate(
      {
        projectId,
        taskId,
        status: value as TaskStatus,
      },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update task status"
          );
        },
      }
    );
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};
