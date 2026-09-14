import type { Project } from "@/types";
import { Link } from "react-router";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";


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
        <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
            <Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
                <CardHeader>
                    <div>
                        <CardTitle>{project.title}</CardTitle>
                        <span className={cn ("text-xs rounded-full") }>     
                        </span>
                        <CardDescription>{project.description}</CardDescription>
                    </div>       
                </CardHeader>
            </Card>
        </Link>
    );
};