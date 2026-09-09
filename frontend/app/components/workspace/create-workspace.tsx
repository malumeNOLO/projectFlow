import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateWorkspace } from "@/hooks/use-workspace";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { toast } from "sonner";
import { useNavigate } from "react-router";

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
  "#34495E",
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const navigate = useNavigate();

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[7],
      description: "",
    },
  });

  const { mutate, isPending } = useCreateWorkspace();

  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        form.reset();
        setIsCreatingWorkspace(false);

        toast.success("Workspace created successfully");

        navigate(`/workspaces/${data._id}`);
      },

      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Something went wrong";

        toast.error(errorMessage);
        console.error(error);
      },
    });
  };

  return (
    <Dialog
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      modal={true}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>

            <Input
              id="name"
              placeholder="Enter workspace name"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <FieldError>
                {form.formState.errors.name.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">
              Description
            </FieldLabel>

            <textarea
              id="description"
              placeholder="Enter workspace description"
              {...form.register("description")}
              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm"
            />

            {form.formState.errors.description && (
              <FieldError>
                {form.formState.errors.description.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>

            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <label
                  key={color}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    value={color}
                    {...form.register("color")}
                    className="sr-only"
                  />

                  <span
                    className={`block h-8 w-8 rounded-full border-2 transition-all ${
                      form.watch("color") === color
                        ? "scale-110 border-foreground ring-2 ring-foreground ring-offset-2"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
            </div>

            {form.formState.errors.color && (
              <FieldError>
                {form.formState.errors.color.message}
              </FieldError>
            )}
          </Field>

          <DialogFooter>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Workspace"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
