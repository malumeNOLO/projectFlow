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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";


interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({

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
                
                <Field>
                    <FieldLabel>Members</FieldLabel>

    <Popover>
        <PopoverTrigger asChild>
            <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal min-h-11">
                <span className="truncate text-muted-foreground">
                    {(() => {
                        const selectedMembers =
                            form.watch("members") ?? [];

                        if (selectedMembers.length === 0) {
                            return "Select Members";
                        }

                        if (selectedMembers.length === 1) {
                            const selected =
                                workspaceMembers.find(
                                    (member) =>
                                        member.user?._id ===
                                        selectedMembers[0].user
                                );

                            return (
                                selected?.user?.name ??
                                "1 member selected"
                            );
                        }

                        return `${selectedMembers.length} members selected`;
                    })()}
                </span>

                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>

        <PopoverContent
            align="start"
            side="bottom"
            sideOffset={5}
            className="z-[9999] w-[450px] bg-background p-2 shadow-lg"
        >
            <div className="max-h-[300px] overflow-y-auto">
                {workspaceMembers.length > 0 ? (
                    workspaceMembers.map((member) => {
                        const memberId = member.user?._id;

                        if (!memberId) {
                            return null;
                        }

                        const selectedMembers =
                            form.watch("members") ?? [];

                        const selectedMember =
                            selectedMembers.find(
                                (selectedMember) =>
                                    selectedMember.user === memberId
                            );

                        const isSelected =
                            !!selectedMember;

                        return (
                            <div
                                key={member._id}
                                className="flex items-center gap-3 rounded-md p-3 hover:bg-muted"
                            >
                                {/* Member checkbox */}
                                <Checkbox
                                    id={`member-${memberId}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        const currentMembers =
                                            form.getValues("members") ??
                                            [];

                                        if (checked) {
                                            if (
                                                currentMembers.some(
                                                    (selectedMember) =>
                                                        selectedMember.user ===
                                                        memberId
                                                )
                                            ) {
                                                return;
                                            }

                                            form.setValue(
                                                "members",
                                                [
                                                    ...currentMembers,
                                                    {
                                                        user: memberId,
                                                        role: "member",
                                                    },
                                                ],
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
                                        } else {
                                            form.setValue(
                                                "members",
                                                currentMembers.filter(
                                                    (selectedMember) =>
                                                        selectedMember.user !==
                                                        memberId
                                                ),
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
                                        }
                                    }}
                                />

                                {/* Member information */}
                                <label
                                    htmlFor={`member-${memberId}`}
                                    className="min-w-0 flex-1 cursor-pointer"
                                >
                                    <p className="truncate text-sm font-medium">
                                        {member.user?.name ??
                                            "Unnamed member"}
                                    </p>

                                    <p className="truncate text-xs text-muted-foreground">
                                        {member.user?.email ??
                                            "No email"}
                                    </p>
                                </label>

                                {/* Role field */}
                                <Field className="w-[120px]">
                                    <Select
                                        value={
                                            selectedMember?.role ??
                                            "member"
                                        }
                                        onValueChange={(role) => {
                                            const currentMembers =
                                                form.getValues(
                                                    "members"
                                                ) ?? [];

                                            form.setValue(
                                                "members",
                                                currentMembers.map(
                                                    (item) =>
                                                        item.user ===
                                                        memberId
                                                            ? {
                                                                  ...item,
                                                                  role: role as
                                                                      | "member"
                                                                      | "admin"
                                                                      | "viewer",
                                                              }
                                                            : item
                                                ),
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            );
                                        }}
                                        disabled={!isSelected}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>

                                        <SelectContent className="z-[10000]">
                                            <SelectItem value="member">
                                                Member
                                            </SelectItem>

                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>

                                            <SelectItem value="viewer">
                                                Viewer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* Selected indicator */}
                                {isSelected && (
                                    <Check className="h-4 w-4 shrink-0" />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="p-3 text-sm text-muted-foreground">
                        No members available.
                    </p>
                )}
            </div>
        </PopoverContent>

    </Popover>

    {form.formState.errors.members && (
        <FieldError>
            {form.formState.errors.members.message}
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