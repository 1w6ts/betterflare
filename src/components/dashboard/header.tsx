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
import { FaUser } from "react-icons/fa";

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
        <Button size="sm" variant="outline">
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
      </div>
    </header>
  );
}
