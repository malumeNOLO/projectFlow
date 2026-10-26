import type { Project, Task, TaskStatus } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UseProjectQuery } from "@/hooks/use-project"
import { getProjectProgress } from "@/lib";
import { Progress } from "@/components/ui/progress";

const ProjectDetails = () => {
    const { projectId, workspaceId } = useParams {
        projectId: string;
        workspaceId: string;
    }>();
    const navigate = useNavigate();

    const [isCreateTask, setIsCreateTask] = useState(false);
    const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

    const{ data, isLoading } = UseProjectQuery(projectId!) as {
        data: {
            tasks: Task[];
            project: Project;
        };
        isLoading: boolean;
    };

    if (isLoading)
        return (
    <div>
        <Loader />
    </div>
    );

    const { project, tasks } = data;
    const projectProgress = getProjectProgress(tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(
            `/workspace/${workspaceId}/projects/${projectId}/tasks/$t{taskId}`
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BackButton />
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-2x1 font-bold">{project.title}</h1>
                    </div>
                    {project.description && (
                        <p className="text-sm text-gray-500">{project.description}</p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 min-w-32">
                        <div className="text-sm text-muted-foreground">Progress:</div>
                        <div className="flex-1">
                            <Progress value={projectProgress} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {projectProgress}%
                        </span>
                    </div>

                    <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
                </div>
            </div>

            <div className="flex items-center justify-between"></div>
        

            <CreateTaskDialog
                open={isCreateTask}
                onOpenChange={setIsCreateTask}
                projectId={projectId}
                projectMembers={project.members as any}
            />
            </div>
    );
};