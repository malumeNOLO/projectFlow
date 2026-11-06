
import type { ProjectMemberRole, Task, User } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TaskAssigneesSelectorProps {
  task: Task;
  assignees?: User[];
  projectMembers?: {
    user: User;
    role: ProjectMemberRole;
  }[];
}

export const TaskAssigneesSelector = ({
  task,
  assignees = [],
  projectMembers = [],
}: TaskAssigneesSelectorProps) => {

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    (assignees ?? []).map((assignee) => assignee._id.toString())
  );

  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Assignees
      </h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            Unassigned
          </span>
        ) : (
          projectMembers
            .filter((member) =>
              selectedIds.includes(member.user._id.toString())
            )
            .map((member) => (
              <div
                key={member.user._id}
                className="flex items-center bg-gray-100 rounded px-2 py-1"
              >
                <Avatar className="size-6 mr-1">
                  <AvatarImage src={member.user.profilePicture} />
                  <AvatarFallback>
                    {member.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs text-muted-foreground">
                  {member.user.username}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
