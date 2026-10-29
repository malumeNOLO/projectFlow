import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useTaskByIdQuery } from "@/hooks/use-tasks";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { TaskTitle } from "../../../components/task/task-title";

const TaskDetails = () => {
    const { user } = useAuth();
    const { taskId, projectId, workspaceId } = useParams<{ 
        taskId: string;
        projectId: string;
        workspaceId: string;
    }>();
    const navigate = useNavigate();

    const { data, isLoading } = useTaskByIdQuery(taskId!) as {
        data: {
            task: Task;
            project: Project;
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return <div>
            <Loader /> 
        </div>
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-2xl font-bold">Task not found</div>
            </div>
        );
    }

    const { task, project } = data;
    const isUserWatching = task.watchers?.some(
        (watcher) => watcher._id.toString() === user?._id.toString()
    ) ?? false;

    const goBack = () => {
        if (workspaceId && projectId) {
          navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
        } else {
          navigate("/workspaces");
        }
      };

    const members = task?.assignees || [];

    
    
    return (
    <div className="w-full space-y-6">
    {/* Header */}
      <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="h-9 shrink-0 gap-2 rounded-lg px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight">
          {task.title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant={isUserWatching ? "default" : "outline"}
          size="sm"
          className="h-9 gap-2 rounded-lg px-3"
          onClick={() => {
            // Connect your watch/unwatch mutation here.
          }}
        >
          <Eye className="h-4 w-4" />
          {isUserWatching ? "Watching" : "Watch"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-lg px-3"
          onClick={() => {
            // Connect your archive/unarchive mutation here.
          }}
        >
          {task.isArchived ? "Unarchive" : "Archive"}
        </Button>
      </div>
      </div>

    {/* Task details */}
    <div className="max-w-4xl rounded-xl border bg-card p-6 shadow-sm">
      {task.description && (
        <p className="mb-5 text-sm leading-6 text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant={
            task.priority === "High"
              ? "destructive"
              : task.priority === "Medium"
                ? "default"
                : "outline"
          }
          className="rounded-full px-3 py-1"
        >
          {task.priority} Priority
        </Badge>

        <TaskTitle title={task.title} taskId={task._id} />
      </div>
    </div>
    </div>
  );
};

export default TaskDetails;



