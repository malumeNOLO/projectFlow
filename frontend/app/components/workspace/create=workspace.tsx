import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean;
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export const colorOptions = [
    "#FF5733", 
    "#33C1FF",
    "#28A745",
    "#FFC300",
    "#8E44AD",
    "#E67E22",
    "#2ECC71",
    "#3449SE",
];

type WorkspaceForm = z.infer<typeof workspaceSchema>

export const CreateWorkspace = ({
    isCreatingWorkspace,
    setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {

    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colorOptions [8],
            description: "",
        }
    })

    const onSubmit = (data: WorkspaceForm) => {
        console.log(data);
    }

    return <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
        <DialogContent className="max-h-[80vh] overflow-y-auto ">
            <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
            </DialogHeader>
            
        </DialogContent>
    </Dialog>
};