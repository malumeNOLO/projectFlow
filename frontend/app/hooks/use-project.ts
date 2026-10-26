import type { CreateProjectFormData } from "@/components/project/create-project";
import {
  fetchData,
  postData,
  deleteData,
} from "@/lib/fetch-utils";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Create project
export const UseCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),

    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["workspace", variables.workspaceId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", variables.workspaceId],
        }),
      ]);
    },
  });
};

// Get project and its tasks
export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () =>
      fetchData(`/projects/${projectId}/tasks`),
    enabled: Boolean(projectId),
  });
};

// Create task
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      taskData: Record<string, unknown>;
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

// Delete project
export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      deleteData(`/projects/${projectId}`),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["workspace"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["project"],
        }),
      ]);
    },
  });
};
