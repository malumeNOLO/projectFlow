
import type { Project } from "@/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="block"
    >
      <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>{project.title}</CardTitle>

            <span
              className={cn(
                "inline-block rounded-full px-2 py-1 text-xs",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>

            <CardDescription className="line-clamp-2">
              {project.description || "No description"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{project.tasks?.length ?? 0}</span>
                <span>Tasks</span>
              </div>

              {project.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {format(new Date(project.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
