import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";


interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CrreateProjectDialog = ({

    isOpen,
    onOpenChange,
    workspaceId,
    workspaceMembers,
}: CreateProjectDialogProps) => {

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: undefined,
        },
    });

    const onSubmit = (data: CreateProjectFormData) => {
        console.log(data);
    };

    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                    Create a new project to get started
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="title">
                        Project title
                    </FieldLabel>
                    <Input
                        id="title"
                        placeholder="Enter project title"
                        {...form.register("title")}
                    />

                    {form.formState.errors.title && (
                        <FieldError>
                            {form.formState.errors.title.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">
                        Project description
                    </FieldLabel>

                <Textarea
                    id="description"
                    placeholder="Describe what this project is about..."
                    className="min-h-[100px]"
                    {...form.register("description")}
                />

                    {form.formState.errors.description && (
                        <FieldError>
                            {form.formState.errors.description.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="status">
                        Project status
                    </FieldLabel>

                <Select
                    value={form.watch("status")}
                    onValueChange={(value) =>
                    form.setValue("status", value as ProjectStatus)
                    }
                >

                <SelectTrigger id="status">
                    <SelectValue placeholder="Select project status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value={ProjectStatus.PLANNING}>
                        Planning
                    </SelectItem>

                    <SelectItem value={ProjectStatus.IN_PROGRESS}>
                        In Progress
                    </SelectItem>

                    <SelectItem value={ProjectStatus.ON_HOLD}>
                        On Hold
                    </SelectItem>

                    <SelectItem value={ProjectStatus.COMPLETED}>
                        Completed
                    </SelectItem>
                </SelectContent>
                </Select>

                    {form.formState.errors.status && (
                        <FieldError>
                            {form.formState.errors.status.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel>Start Date</FieldLabel>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                        {form.watch("startDate") ? (
                            format(new Date(form.watch("startDate")), "PPP")
                        ) : (
                            <span>Pick a start date</span>
                        )}
                        </Button>
                    </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={
                        form.watch("startDate")
                        ? new Date(form.watch("startDate"))
                        : undefined
                        }
                        onSelect={(date) => {
                        form.setValue(
                        "startDate",
                        date ? date.toISOString() : ""
                        );
                        }}
                    />
                </PopoverContent>
                </Popover>

                    {form.formState.errors.startDate && (
                        <FieldError>
                            {form.formState.errors.startDate.message}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel>Due Date</FieldLabel>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                        {form.watch("dueDate") ? (
                            format(new Date(form.watch("dueDate")), "PPP")
                            ) : (
          
                            <span>Pick a due date</span>
                        )}
                        </Button>
                    </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={
                            form.watch("dueDate")
                            ? new Date(form.watch("dueDate"))
                            : undefined
                        }
                        onSelect={(date) => {
                        form.setValue(
                        "dueDate",
                        date ? date.toISOString() : ""
                        );
                    }}
                    />
                </PopoverContent>
                </Popover>

                    {form.formState.errors.dueDate && (
                    <FieldError>
                        {form.formState.errors.dueDate.message}
                    </FieldError>
                    )}
                </Field>

                

                <Button type="submit">
                    Create Project
                </Button>
            </form>
        </DialogContent>
    </Dialog>
    )};