import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { postData, updateData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskData: CreateTaskFormData;
    }) =>
      postData(
        `/tasks/${data.projectId}/create-task`,
        data.taskData
      ),

    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskId: string;
      status: "To Do" | "In Progress" | "Done";
    }) => {
      console.log("Update task data:", data);
    
      return updateData(`/tasks/${data.taskId}`, {
        status: data.status,
      });
    },

    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};