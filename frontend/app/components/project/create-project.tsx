import type { projectSchema } from "@/lib/schema";
import type { MemberProps } from "@/types";
import { z } from "zod";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

type ProjectStatusFormData = z.infer<typeof projectSchema>;

export const CrreateProjectDialog = ({
    isOpen,
    onOpenChange,
    workspaceId,
    workspaceMembers,
}: CreateProjectDialogProps) => {
    return <div></div>;  
};