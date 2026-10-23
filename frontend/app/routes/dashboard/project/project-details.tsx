import type { Project, Task, TaskStatus } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UseProjectQuery } from "@/hooks/use-project"

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
}