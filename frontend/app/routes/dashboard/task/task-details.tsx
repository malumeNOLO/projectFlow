import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useTaskByIdQuery } from "@/hooks/use-tasks";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router";

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
    const isUserWatching = task?.watchers.some(
        (watcher) => watcher._id.toString() === user?._id.toString()
    );

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
    {/* Task header */}
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={goBack}
          className="h-8 shrink-0 gap-1.5 rounded-md px-2.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>

        <h1 className="truncate text-base font-semibold tracking-tight">
          {task.title}
        </h1>
      </div>

      <Button
        variant={isUserWatching ? "default" : "outline"}
        size="sm"
        className="h-8 shrink-0 gap-1.5 rounded-md"
        onClick={() => {
          // Connect your watch/unwatch mutation here.
        }}
      >
        <Eye className="h-4 w-4" />
        {isUserWatching ? "Watching" : "Watch"}
      </Button>
    
    {/* Task actions */}
    
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // Connect your archive/unarchive mutation here.
        }}
      >
        {task.isArchived ? "Unarchive" : "Archive"}
      </Button>

      </div>
    </div>
    
      );
    };

export default TaskDetails;


