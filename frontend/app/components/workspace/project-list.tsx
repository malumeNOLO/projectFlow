import type { Project } from "@/types";
import { NoDataFound } from "./no-data-found";
import { ProjectCard } from "../project/project-card";

interface ProjectListprops {
    workspaceId: string;
    projects:Project[]

    onCreateProject: ()=> void
}

export const ProjectList = ({
    workspaceId,
    projects,
    onCreateProject,
}: ProjectListprops ) => {
    return <div>
        <h3 className="text-xl font-medium mb-4">Projects</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length === 0 ? (
                <NoDataFound
                title="No projects found"
                description="Create a project to get started"
                buttonText="Create Project"
                buttonAction={onCreateProject}
                
                />  
            ) : (
                projects.map((project) => {
                    const tasks = project.tasks ?? [];

                    const totalTasks = tasks.length;

                    const progress =
                        totalTasks === 0
                        ? 0
                    : Math.round(
                    (tasks.reduce((total, task) => {
                      const status = String(task.status)
                        .toLowerCase()
                        .replace(/[_-]/g, " ")
                        .trim();

                      if (["done", "completed"].includes(status)) {
                        return total + 1;
                      }

                      if (status === "in progress") {
                        return total + 0.5;
                      }

                      return total;
                    }, 0) /
                      totalTasks) *
                      100
                    );


                    return (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      progress={progress}
                      workspaceId={workspaceId}
                    />
                )})
            )}

        </div>
    </div>;
};