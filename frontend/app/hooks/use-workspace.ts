import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/fetch-utils";
import type { Project, Workspace } from "@/types";

export interface WorkspaceDetailsResponse {
  workspace: Workspace;
  projects: Project[];
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkspaceForm) =>
      postData("/workspaces", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery<WorkspaceDetailsResponse>({
    queryKey: ["workspace", workspaceId],
    queryFn: async () =>
      fetchData<WorkspaceDetailsResponse>(
        `/workspaces/${workspaceId}/projects`
      ),
    enabled: Boolean(workspaceId),
  });
};
