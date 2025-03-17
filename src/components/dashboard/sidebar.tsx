"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Cloud,
  Database,
  FileText,
  FolderOpen,
  Github,
  HelpCircle,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FaCloud, FaGithub } from "react-icons/fa";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Buckets",
      href: "/dashboard/buckets",
      icon: Database,
      badge: null,
    },
    {
      name: "Files",
      href: "/dashboard/files",
      icon: FolderOpen,
      badge: null,
    },
    {
      name: "Access",
      href: "/dashboard/access",
      icon: Key,
      badge: null,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      badge: {
        text: "New",
        variant: "default" as
          | "default"
          | "destructive"
          | "outline"
          | "secondary",
      },
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const MobileToggle = (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-3 left-3 z-50"
      onClick={() => setMobileOpen(true)}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );

  const MobileOverlay = mobileOpen && (
    <div
      className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
      onClick={() => setMobileOpen(false)}
    />
  );

  return (
    <>
      {MobileToggle}
      {MobileOverlay}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 md:relative",
          collapsed ? "w-[100px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <FaCloud className="h-6 w-6 text-primary" />
            {!collapsed && (
              <span className="text-lg font-medium">Betterflare</span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-2 overflow-y-auto">
          <div className="mb-2 px-3 py-1">
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground">
                MAIN NAVIGATION
              </p>
            )}
          </div>

          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all relative",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isActive(item.href) &&
                        "after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-[3px] after:rounded-r-full after:bg-primary"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />

                    {!collapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {!collapsed && item.badge && (
                      <Badge
                        variant={
                          item.badge.variant as
                            | "default"
                            | "destructive"
                            | "outline"
                            | "secondary"
                        }
                        className="ml-auto text-[10px] px-1 py-0 h-5"
                      >
                        {item.badge.text}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-2"
                  >
                    {item.name}
                    {item.badge && (
                      <Badge
                        variant={item.badge.variant}
                        className="text-[10px] px-1 py-0 h-5"
                      >
                        {item.badge.text}
                      </Badge>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>

          <div className="mt-2 mb-2 px-3 py-1">
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground">
                SUPPORT
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="https://docs.betterflare.io"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <HelpCircle className="h-5 w-5" />
                    {!collapsed && <span>Documentation</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">Documentation</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="https://github.com/1w6ts/betterflare"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <FaGithub className="h-5 w-5" />
                    {!collapsed && <span>GitHub</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">GitHub</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
}
