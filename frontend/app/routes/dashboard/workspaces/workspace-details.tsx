import { CreateProjectDialog } from "@/components/project/create-project";
import { Loader } from "@/components/ui/loader";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
const { workspaceId } = useParams<{ workspaceId: string }>();
const [isCreateProject, setIsCreateProject] = useState(false);
const [isInvitedMember, setIsInvitedMember] = useState(false);

const { data, isLoading, isError, error } =
    useGetWorkspaceQuery(workspaceId ?? "");

if (!workspaceId) {
     return <div>No workspace found</div>;
 }

if (isLoading) {
   return <Loader />;
}

if (isError) {
    return (
        <div> 
            Failed to load workspace projects:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
        </div>
        );
}

if (!data?.workspace) {
    return <div>Workspace data was not returned by the API.</div>;
}

const workspace = data.workspace as Workspace;
const projects = (data.projects ?? []) as Project[];

return (
    <div className="space-y-8">
        <WorkspaceHeader
        workspace={workspace}
        members={workspace.members}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInvitedMember(true)}
        />

        <ProjectList
        workspaceId={workspaceId}
        projects={projects}
        onCreateProject={() => setIsCreateProject(true)}
        />

        <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={workspace.members as any}
        />
 </div>
);
};

export default WorkspaceDetails;
