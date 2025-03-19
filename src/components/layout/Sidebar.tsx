import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Network,
  PackageOpen,
  Bell,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const NavItem = ({
  icon,
  label,
  path,
  isActive = false,
  isCollapsed = false,
}: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
              isCollapsed ? "justify-center" : "",
            )}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {icon}
            </div>
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <Network className="h-5 w-5" />,
      label: "Network Configuration",
      path: "/network",
    },
    {
      icon: <PackageOpen className="h-5 w-5" />,
      label: "Packet Analysis",
      path: "/packet",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Alert Management",
      path: "/alerts",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Rule Configuration",
      path: "/rules",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center w-full",
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && <span className="font-semibold">NetWatch</span>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "absolute right-2 top-5 z-10",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={currentPath === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          path="/settings"
          isActive={currentPath === "/settings"}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
