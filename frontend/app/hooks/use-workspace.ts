import type { WorkspaceForm } from  "@/components/workspace/create-workspace"
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/fetch-utils";

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
    });
};

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => fetchData("/workspaces"),
    });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    });
};