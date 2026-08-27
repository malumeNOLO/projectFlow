import type {LucideIcon } from "lucide-react";
import { Icon } from "lucide-react";
import type { Workspace } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
    items:{
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
}

export const SidebarNav = ({
    items,
    isCollapsed,
    className,
    currentWorkspace,
    ...props
} : SidebarNavProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={cn("flex-col gap-y-2", className)} {...props}>
            {
                items.map((el)=> {
                    const Icon = el.icon
                    const isActive = location.pathname  == el.href
                    
                    const handleClick = () => {
                        if(el.href === "/workspaces") {
                            navigate (el.href)
                        } else if (currentWorkspace && currentWorkspace._id){
                            navigate(`${el.href}workspaceId=${currentWorkspace._id}`)
                        } else {
                            navigate(el.href)
                        }
                    }
                    return <Button key={el.href}
                    variant={isActive ? "outline" : "ghost"}

                    className={cn("justify-start", isActive && "bg-indigo-900 text-blue-200 font-medium ")}
                    onClick={handleClick}
                    >
                        <Icon className="mr-2 size-4"/>
                        {
                            isCollapsed ? <span className="sr-only">el.title</span> : (
                                el.title
                            )
                        }

                    </Button>
                })
            }
        </nav>
    );
};