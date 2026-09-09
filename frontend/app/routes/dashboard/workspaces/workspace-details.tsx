import { CrreateProjectDialog } from "@/components/project/create-project";
import { Loader } from "@/components/ui/loader";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";


const WorkspaceDetails = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const [ isCreateProject, setIsCreateProject] = useState(false);
    const [ isInvitedMember, setIsInvitedMember] = useState(false);

    if(!workspaceId){
        return <div>No workspace found</div>;
    }

    const { data, isLoading} = useGetWorkspaceQuery(workspaceId) as {
        data: {
            workspace: Workspace;
            projects: Project[];
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return (
        <div>
            <Loader />
        </div>
        );
    }

    return (
        <div className="space-y-8">
            <WorkspaceHeader
               workspace={data.workspace}      
               members={data?.workspace?.members}
               onCreateProject={() => setIsCreateProject(true)}
               onInviteMember={() => setIsInvitedMember(true)}
            />

            <ProjectList
                workspaceId={workspaceId}
                projects={data.projects}
                onCreateProject={() => setIsCreateProject(true)}
            />

            <CrreateProjectDialog
                isOpen={isCreateProject}
                onOpenChange={setIsCreateProject}
                workspaceId={workspaceId}    
                workspaceMembers={data.workspace.members as any }      
            />
        </div>
    );
};

export default WorkspaceDetails;