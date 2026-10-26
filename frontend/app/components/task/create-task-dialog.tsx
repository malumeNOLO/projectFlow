import type { User } from "@/types";

interface CreateTaskDialogProps {
    open:boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.inter<typeof createTaskSchema>;

export const CreateTaskDialog = ({
    open,
    onOpenChange,
    projectId,
    projectMembers,
})