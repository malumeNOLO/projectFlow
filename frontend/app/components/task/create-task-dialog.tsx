import { useCreateTaskMutation } from "@/hooks/use-tasks";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.input<typeof createTaskSchema>;
type ValidatedTaskFormData = z.output<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
    type CreateTaskFormData = z.input<typeof createTaskSchema>;
    type ValidatedTaskFormData = z.output<typeof createTaskSchema>;

    const form = useForm<
  CreateTaskFormData,
  any,
  ValidatedTaskFormData
>({
  resolver: zodResolver(createTaskSchema),
  defaultValues: {
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assignee: "",
    dueDate: "",
  },
});
  const { mutate, isPending } = useCreateTaskMutation();

  const onSubmit: SubmitHandler<ValidatedTaskFormData> = (values) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Failed to create task"
          );
          console.error(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Title */}
            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">Task Title</FieldLabel>
              <Input
                id="title"
                placeholder="Enter task title"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
              />
              <FieldError
                errors={[form.formState.errors.title]}
              />
            </Field>

            {/* Description */}
            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Describe the task"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldDescription>
                Add details to help the assignee understand the task.
              </FieldDescription>
              <FieldError
                errors={[form.formState.errors.description]}
              />
            </Field>

            {/* Status and priority */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={!!form.formState.errors.status}>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) =>
                    form.setValue(
                      "status",
                      value as CreateTaskFormData["status"],
                      { shouldValidate: true }
                    )
                  }
                >
                  <SelectTrigger
                    id="status"
                    aria-invalid={!!form.formState.errors.status}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">
                      In Progress
                    </SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  errors={[form.formState.errors.status]}
                />
              </Field>

              <Field data-invalid={!!form.formState.errors.priority}>
                <FieldLabel htmlFor="priority">Priority</FieldLabel>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(value) =>
                    form.setValue(
                      "priority",
                      value as CreateTaskFormData["priority"],
                      { shouldValidate: true }
                    )
                  }
                >
                  <SelectTrigger
                    id="priority"
                    aria-invalid={!!form.formState.errors.priority}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  errors={[form.formState.errors.priority]}
                />
              </Field>
            </div>

            {/* Assignee */}
            <Field data-invalid={!!form.formState.errors.assignee}>
              <FieldLabel htmlFor="assignee">Assign To</FieldLabel>
              <Select
                value={form.watch("assignee")}
                onValueChange={(value) =>
                  form.setValue("assignee", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id="assignee"
                  aria-invalid={!!form.formState.errors.assignee}
                >
                  <SelectValue placeholder="Select a project member" />
                </SelectTrigger>
                <SelectContent>
                  {projectMembers.map((member) => (
                    <SelectItem
                      key={member.user._id}
                      value={member.user._id}
                    >
                      {member.user.name || member.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={[form.formState.errors.assignee]}
              />
            </Field>

            {/* Due date */}
            <Field data-invalid={!!form.formState.errors.dueDate}>
              <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
              <Input
                id="dueDate"
                type="date"
                aria-invalid={!!form.formState.errors.dueDate}
                {...form.register("dueDate")}
              />
              <FieldError
                errors={[form.formState.errors.dueDate]}
              />
            </Field>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                {isPending ? "Creating Task..." : "Create Task"}
              </button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};