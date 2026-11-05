import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskDescriptionMutation } from "@/hooks/use-tasks";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({  
    description,
    taskId, 
}: { 
    description?:string; 
    taskId: string; 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(description || "");
    const { mutate, isPending } = useUpdateTaskDescriptionMutation();
    const updateDescription =() => {
        mutate(
            { taskId, description: newDescription },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success("Description updated successfully");
                },
                onError: (error: any ) => {
                    const errorMessage = error.response.data.messsage;
                    toast.error("Failed to update description");
                    console.log(error);
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-2">
          {isEditing ? ( 
            <Textarea
               className="text-xl font-semibold w-full min-w-3xl"
               value={newDescription}
               onChange={(e) => setNewDescription(e.target.value)}
            /> 
          ) : (
            <p className="text-xl flex-1 font-semibold">
              {description || "No description provided"}
            </p>
            )}

            {isEditing ? (
              <Button className="py-0"
              size="sm"
              onClick={updateDescription}
              disabled={isPending}
              >Save</Button>
            ) : ( 
              <Edit 
                className="size-3 cursor-pointer"
                onClick={() => {
                  setNewDescription(description || "");
                  setIsEditing(true);
                }}
              />
            )}
        </div>
    );
};