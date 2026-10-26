import type { Project, Task, TaskStatus } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProjectProgress } from "@/lib";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UseProjectQuery,useDeleteProjectMutation } from "@/hooks/use-project";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TaskColumn } from "@/components/task/task-column";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();
  const deleteProjectMutation = useDeleteProjectMutation();

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

        <div className="flex items-center justify-between">
          
<Tabs
  defaultValue="all"
  className="w-full"
  onValueChange={(value) => {
    const filters: Record<string, TaskStatus | "All"> = {
      all: "All",
      todo: "To Do",
      "in-progress": "In Progress",
      done: "Done",
    };

    setTaskFilter(filters[value]);
  }}
>
  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <TabsList>
      <TabsTrigger value="all">All Tasks</TabsTrigger>
      <TabsTrigger value="todo">To Do</TabsTrigger>
      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
      <TabsTrigger value="done">Done</TabsTrigger>
    </TabsList>

    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Status:</span>

      <Badge variant="outline">
        {tasks.filter((task) => task.status === "To Do").length} To Do
      </Badge>

      <Badge variant="outline">
        {tasks.filter((task) => task.status === "In Progress").length} In Progress
      </Badge>

      <Badge variant="outline">
        {tasks.filter((task) => task.status === "Done").length} Done
      </Badge>
    </div>
  </div>

  <TabsContent value="all" className="mt-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TaskColumn
        title="To Do"
        tasks={tasks.filter((task) => task.status === "To Do")}
        onTaskClick={handleTaskClick}
      />

      <TaskColumn
        title="In Progress"
        tasks={tasks.filter((task) => task.status === "In Progress")}
        onTaskClick={handleTaskClick}
      />

      <TaskColumn
        title="Done"
        tasks={tasks.filter((task) => task.status === "Done")}
        onTaskClick={handleTaskClick}
      />
    </div>
  </TabsContent>

  <TabsContent value="todo" className="mt-4">
    <TaskColumn
      title="To Do"
      tasks={tasks.filter((task) => task.status === "To Do")}
      onTaskClick={handleTaskClick}
    />
  </TabsContent>

  <TabsContent value="in-progress" className="mt-4">
    <TaskColumn
      title="In Progress"
      tasks={tasks.filter((task) => task.status === "In Progress")}
      onTaskClick={handleTaskClick}
    />
  </TabsContent>

  <TabsContent value="done" className="mt-4">
    <TaskColumn
      title="Done"
      tasks={tasks.filter((task) => task.status === "Done")}
      onTaskClick={handleTaskClick}
    />
  </TabsContent>
</Tabs>

        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-3"
        > 
            Back
        </Button>

        <Button
            variant="destructive"
            disabled={deleteProjectMutation.isPending}
            onClick={() => {
                const confirmed = window.confirm(
                    `Are you sure you want to permanently delete "${project.title}" and its tasks?`
            );

            if (confirmed) {
                deleteProjectMutation.mutate(projectId, {
                    onSuccess: () => {
                        navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error) => {
                    console.error("Failed to delete project:", error);
                    window.alert(
                        "Failed to delete project. Please check the server logs and try again."
                    );
                },
               });
              }
            }}
            >
            {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
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

      
<div className="space-y-4">
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-lg font-semibold">
      Tasks ({tasks.filter(
        (task) =>
          taskFilter === "All" || task.status === taskFilter
      ).length})
    </h2>

    <select
      value={taskFilter}
      onChange={(e) =>
        setTaskFilter(e.target.value as TaskStatus | "All")
      }
      className="rounded-md border bg-background px-3 py-2 text-sm"
    >
      <option value="All">All tasks</option>
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  </div>

  {(() => {
    const filteredTasks = tasks.filter(
      (task) =>
        taskFilter === "All" || task.status === taskFilter
    );

    if (filteredTasks.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">
            {tasks.length === 0
              ? "No tasks yet"
              : "No tasks match this status"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tasks.length === 0
              ? "Click Add Task to create your first task."
              : "Choose another status to see more tasks."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <button
            key={task._id}
            type="button"
            onClick={() => handleTaskClick(task._id)}
            className="flex w-full items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{task.title}</p>

              {task.description && (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}

              <p className="mt-2 text-xs text-muted-foreground">
                Priority: {task.priority}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs">
              {task.status}
            </span>
          </button>
        ))}
      </div>
    );
  })()}
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
