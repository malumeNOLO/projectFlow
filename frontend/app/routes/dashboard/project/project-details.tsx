import type { Project, Task, TaskStatus } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { CreateTaskDialog } from "@/components/task/create-task-dialog";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading, isError } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
    isError?: boolean;
  };

  if (!projectId || !workspaceId) {
    return <div>Project or workspace ID is missing from the URL.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading project...
        </span>
      </div>
    );
  }

  if (isError || !data?.project) {
    return <div>Failed to load project details.</div>;
  }

  const { project, tasks = [] } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-3"
        > 
            Back
        </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold md:text-2xl">
              {project.title}
            </h1>
          </div>

          {project.description && (
            <p className="text-sm text-gray-500">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-32 items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Progress:
            </div>

            <div className="flex-1">
              <Progress
                value={projectProgress}
                className="h-2"
              />
            </div>

            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Add your task filters and task list here. */}
      </div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;