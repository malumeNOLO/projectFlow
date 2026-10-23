
import type { CreateProjectFormData } from "@/components/project/create-project";
import { postData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
