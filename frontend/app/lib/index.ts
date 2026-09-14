import type { ProjectStatus } from "@/types";

export const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/reset-password",
    "/forgot-password",
    "*",
];

export const getTaskStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case "In Progress":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case "On Hold":
            return "bg-blue-100 text-blue-800 dark:"
        case "Planning":
            return "bg-blue-100 text-blue-800 dark:"
        case "Completed":
            return "bg-blue-100 text-blue-800 dark:"   
    }
}