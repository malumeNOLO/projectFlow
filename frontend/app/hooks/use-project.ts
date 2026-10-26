
import type { CreateProjectFormData } from "@/components/project/create-project";
import { fetchData, postData, deleteData} from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`)
  })
}

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