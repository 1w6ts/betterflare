"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Command,
  HelpCircle,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SettingsDialog } from "@/components/dashboard/settings-dialog";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current page title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/buckets") return "Buckets";
    if (pathname.startsWith("/dashboard/files")) return "Files";
    if (pathname === "/dashboard/access") return "Access Control";
    if (pathname === "/dashboard/analytics") return "Analytics";
    if (pathname === "/dashboard/settings") return "Settings";
    return "Dashboard";
  };

  // Quick actions based on current page
  const getQuickActions = () => {
    if (pathname === "/dashboard/buckets") {
      return (
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/buckets?action=create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Bucket
        </Button>
      );
    }

    if (pathname.startsWith("/dashboard/files")) {
      return (
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      );
    }

    if (pathname === "/dashboard/access") {
      return (
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Token
        </Button>
      );
    }

    return null;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur transition-shadow duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="flex items-center gap-2 md:hidden">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="relative hidden md:flex md:grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search files, buckets, and more..."
          className="w-full max-w-sm pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">{getQuickActions()}</div>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() =>
                  window.open("https://developers.cloudflare.com/r2/", "_blank")
                }
              >
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help & Resources</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Settings Dialog */}
        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      3
                    </span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              {
                title: "New bucket created",
                description:
                  "Your bucket 'user-uploads' was created successfully.",
                time: "2 minutes ago",
                unread: true,
              },
              {
                title: "Upload complete",
                description: "10 files were uploaded to 'assets-production'.",
                time: "1 hour ago",
                unread: true,
              },
              {
                title: "Storage limit warning",
                description:
                  "You're approaching your storage limit (85% used).",
                time: "Yesterday",
                unread: true,
              },
            ].map((notification, i) => (
              <DropdownMenuItem
                key={i}
                className={cn(
                  "flex flex-col items-start p-4 cursor-pointer",
                  notification.unread && "bg-muted/50"
                )}
              >
                {notification.unread && (
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary"></span>
                )}
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">
                  {notification.description}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {notification.time}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-normal">
                John Doe
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings?tab=account")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
