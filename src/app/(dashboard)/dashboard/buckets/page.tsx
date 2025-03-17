"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Filter,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsDialog } from "@/components/dashboard/settings-dialog";
import {
  hasCloudflareCredentials,
  listBuckets,
  createBucket as createCloudflareR2Bucket,
  deleteBucket as deleteCloudflareR2Bucket,
} from "@/lib/cloudflare";

// Update the Bucket type to match Cloudflare's API response
type Bucket = {
  name: string;
  creation_date: string;
  size?: number; // Add size property
  location?: string;
  storage_class?: string;
  public_access?: {
    enabled: boolean;
    downloadable: boolean;
  };
  custom_domain?: string;
};

// Update the BucketDetails import
import { BucketDetails } from "./bucket-details";
import { toast } from "sonner";

// Add bucket details view
// const BucketDetails = ({ bucketName, onBack }: { bucketName: string; onBack: () => void }) => {
//   return (
//     <div>
//       <Button onClick={onBack}>Back to Buckets</Button>
//       <h2>Bucket Details: {bucketName}</h2>
//       {/* Add bucket details content here */}
//     </div>
//   )
// }

export default function BucketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [filteredBuckets, setFilteredBuckets] = useState<Bucket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);

  // Form state for creating a bucket
  const [newBucketName, setNewBucketName] = useState("");
  const [publicAccess, setPublicAccess] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Add pagination state
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(20);
  const [nameFilter, setNameFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const searchParams = useSearchParams();

  // Add bucket details view
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  // Check for credentials on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const hasCredentials = hasCloudflareCredentials();
      setHasCredentials(hasCredentials);

      // If no credentials, show settings dialog
      if (!hasCredentials) {
        setIsSettingsDialogOpen(true);
      } else {
        fetchBuckets();
      }
    }
  }, []);

  // Fetch buckets when credentials change
  useEffect(() => {
    if (hasCredentials) {
      fetchBuckets();
    }
  }, [hasCredentials]);

  // Filter buckets when search query changes
  useEffect(() => {
    if (buckets.length > 0) {
      setFilteredBuckets(
        buckets.filter((bucket) =>
          bucket.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, buckets]);

  // Update the fetchBuckets function to use pagination and filtering
  const fetchBuckets = async (resetCursor = true) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get filter from URL if present
      const urlNameFilter = searchParams.get("filter") || "";
      if (urlNameFilter && urlNameFilter !== nameFilter) {
        setNameFilter(urlNameFilter);
      }

      // Use the direct Cloudflare API client with pagination and filtering
      const result = await listBuckets({
        cursor: resetCursor ? "" : currentCursor || "",
        direction: sortDirection,
        nameContains: nameFilter || urlNameFilter,
        perPage: perPage,
      });

      setBuckets(result.buckets);
      setFilteredBuckets(result.buckets);
      setNextCursor(result.pagination?.cursor || null);

      if (resetCursor) {
        setCurrentCursor(null);
      }
    } catch (err: any) {
      console.error("Error fetching buckets:", err);
      setError(
        err.message ||
          "Failed to load buckets. Please check your Cloudflare credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBucket = async () => {
    if (!newBucketName.trim()) {
      toast.error("Error", { description: "Bucket name is required." });
      return;
    }

    setIsCreating(true);

    try {
      // Use the direct Cloudflare API client
      const newBucket = await createCloudflareR2Bucket(newBucketName, {
        publicAccess,
      });

      // Add the new bucket to the list
      setBuckets((prev) => [...prev, newBucket]);

      toast.success("Success", {
        description: `Bucket "${newBucketName}" created successfully`,
      });

      // Reset form and close dialog
      setNewBucketName("");
      setPublicAccess(false);
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to create bucket",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied!", { description: "URL copied to clipboard" });
  };

  const handleDeleteBucket = async (bucketName: string) => {
    try {
      // Use the direct Cloudflare API client
      await deleteCloudflareR2Bucket(bucketName);

      // Remove the bucket from the list
      setBuckets((prev) => prev.filter((bucket) => bucket.name !== bucketName));

      toast.success("Success!", {
        description: `Bucket "${bucketName}" deleted successfully`,
      });
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to delete bucket",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Format the bucket size
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return "0 B";

    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Add a function to handle pagination
  const handleNextPage = () => {
    if (nextCursor) {
      setCurrentCursor(nextCursor);
      fetchBuckets(false);
    }
  };

  const handlePreviousPage = () => {
    // For previous page, we need to reset and fetch from the beginning
    // This is because Cloudflare's API doesn't support backward pagination directly
    setCurrentCursor(null);
    fetchBuckets(true);
  };

  // Update the search handling
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search filter
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("filter", searchQuery);
    } else {
      params.delete("filter");
    }
    router.push(`/dashboard/buckets?${params.toString()}`);

    setNameFilter(searchQuery);
    fetchBuckets(true);
  };

  // No credentials state
  if (!hasCredentials && !isSettingsDialogOpen) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buckets</h1>
            <p className="text-muted-foreground">
              Manage your R2 storage buckets
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure Cloudflare
          </Button>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800/30 dark:bg-amber-900/10">
          <h3 className="text-lg font-medium text-amber-800 dark:text-amber-500 mb-2">
            Cloudflare Credentials Required
          </h3>
          <p className="text-amber-700 dark:text-amber-400 mb-4">
            Please configure your Cloudflare credentials to access your R2
            buckets.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure Cloudflare
          </Button>
        </div>

        <SettingsDialog
          open={isSettingsDialogOpen}
          onOpenChange={(open) => {
            setIsSettingsDialogOpen(open);
            if (!open && typeof window !== "undefined") {
              // Check if credentials were added when dialog is closed
              setHasCredentials(hasCloudflareCredentials());
            }
          }}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buckets</h1>
            <p className="text-muted-foreground">
              Manage your R2 storage buckets
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Create Bucket
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search buckets..."
                className="pl-8"
                disabled
              />
            </div>
            <Button variant="outline" size="icon" disabled>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Public Access</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <SettingsDialog
          open={isSettingsDialogOpen}
          onOpenChange={(open) => {
            setIsSettingsDialogOpen(open);
            if (!open && typeof window !== "undefined") {
              // Check if credentials were added when dialog is closed
              setHasCredentials(hasCloudflareCredentials());
            }
          }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buckets</h1>
            <p className="text-muted-foreground">
              Manage your R2 storage buckets
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure Cloudflare
          </Button>
        </div>

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Error Loading Buckets
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => fetchBuckets}>Retry</Button>
            <Button
              variant="outline"
              onClick={() => setIsSettingsDialogOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Check Settings
            </Button>
          </div>
        </div>

        <SettingsDialog
          open={isSettingsDialogOpen}
          onOpenChange={(open) => {
            setIsSettingsDialogOpen(open);
            if (!open && typeof window !== "undefined") {
              // Check if credentials were added when dialog is closed
              setHasCredentials(hasCloudflareCredentials());
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedBucket ? (
        <BucketDetails
          bucketName={selectedBucket}
          onBack={() => setSelectedBucket(null)}
        />
      ) : (
        <>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Buckets</h1>
              <p className="text-muted-foreground">
                Manage your R2 storage buckets
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Bucket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new bucket</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new R2 storage bucket
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bucket-name">Bucket name</Label>
                      <Input
                        id="bucket-name"
                        placeholder="my-bucket-name"
                        value={newBucketName}
                        onChange={(e) => setNewBucketName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Bucket names must be unique and can only contain
                        lowercase letters, numbers, hyphens, and periods.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="public-access"
                        checked={publicAccess}
                        onCheckedChange={(checked) =>
                          setPublicAccess(checked === true)
                        }
                      />
                      <Label htmlFor="public-access">
                        Enable public access
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Public access allows anyone with the URL to access objects
                      in this bucket.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBucket} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Bucket"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search buckets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  fetchBuckets(true);
                }}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">
                  Sort {sortDirection === "asc" ? "Descending" : "Ascending"}
                </span>
              </Button>
            </form>
            <Button variant="outline" size="sm" onClick={() => fetchBuckets}>
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Public Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuckets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {searchQuery
                        ? "No buckets found matching your search."
                        : "No buckets found. Create your first bucket!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBuckets.map((bucket) => (
                    <TableRow key={bucket.name}>
                      <TableCell className="font-medium">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:text-primary"
                          onClick={() => setSelectedBucket(bucket.name)}
                        >
                          <Database className="h-4 w-4 text-muted-foreground" />
                          {bucket.name}
                        </div>
                      </TableCell>
                      <TableCell>{formatBytes(bucket.size)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bucket.public_access?.enabled
                              ? "default"
                              : "outline"
                          }
                        >
                          {bucket.public_access?.enabled ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(bucket.creation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/files?bucket=${bucket.name}`
                                )
                              }
                            >
                              <FolderOpen className="mr-2 h-4 w-4" />
                              <span>Browse Files</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Access Control</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download All</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete the bucket "${bucket.name}"? This action cannot be undone.`
                                  )
                                ) {
                                  handleDeleteBucket(bucket.name);
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredBuckets.length}{" "}
              {filteredBuckets.length === 1 ? "bucket" : "buckets"}
              {nameFilter && ` matching "${nameFilter}"`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!currentCursor}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!nextCursor}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={(open) => {
          setIsSettingsDialogOpen(open);
          if (!open && typeof window !== "undefined") {
            // Check if credentials were added when dialog is closed
            setHasCredentials(hasCloudflareCredentials());
          }
        }}
      />
    </div>
  );
}
