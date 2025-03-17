"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  ChevronRight,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  FolderOpen,
  Image,
  Link2,
  Loader2,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  Upload,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  listObjects,
  formatBytes,
  getContentTypeFromKey,
} from "@/lib/cloudflare";
import { toast } from "sonner";

// Define the object type
type BucketObject = {
  key: string;
  size: number;
  lastModified: string;
  etag: string;
  storageClass: string;
  isDirectory?: boolean;
};

type CommonPrefix = {
  prefix: string;
  isDirectory: true;
};

export default function FilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bucketName = searchParams.get("bucket") || "";
  const currentPrefix = searchParams.get("prefix") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [objects, setObjects] = useState<BucketObject[]>([]);
  const [commonPrefixes, setCommonPrefixes] = useState<CommonPrefix[]>([]);
  const [filteredItems, setFilteredItems] = useState<
    (BucketObject | CommonPrefix)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [continuationToken, setContinuationToken] = useState<string | null>(
    null
  );
  const [isTruncated, setIsTruncated] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Form state for uploading a file
  const [uploadKey, setUploadKey] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Redirect if no bucket is specified
  useEffect(() => {
    if (!bucketName) {
      router.push("/dashboard/buckets");
    }
  }, [bucketName, router]);

  // Fetch objects on component mount or when prefix changes
  useEffect(() => {
    if (bucketName) {
      fetchObjects();
    }
  }, [bucketName, currentPrefix]);

  // Filter objects when search query changes
  useEffect(() => {
    if (objects.length > 0 || commonPrefixes.length > 0) {
      const allItems = [...commonPrefixes, ...objects];

      if (searchQuery) {
        setFilteredItems(
          allItems.filter((item) => {
            const key = "prefix" in item ? item.prefix : item.key;
            return key.toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      } else {
        setFilteredItems(allItems);
      }
    }
  }, [searchQuery, objects, commonPrefixes]);

  const fetchObjects = async (loadMore = false) => {
    if (!bucketName) return;

    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const result = await listObjects(bucketName, {
        prefix: currentPrefix,
        delimiter: "/",
        continuationToken: loadMore
          ? continuationToken ?? undefined
          : undefined,
        maxKeys: 100,
      });

      if (loadMore) {
        setObjects((prev) => [...prev, ...result.objects]);
        setCommonPrefixes((prev) => [...prev, ...result.commonPrefixes]);
      } else {
        setObjects(result.objects);
        setCommonPrefixes(result.commonPrefixes);
      }

      setIsTruncated(result.isTruncated);
      setContinuationToken(result.nextContinuationToken);

      // Initialize filtered items
      if (!searchQuery) {
        setFilteredItems([...result.commonPrefixes, ...result.objects]);
      }
    } catch (err: any) {
      console.error("Error fetching objects:", err);
      setError(
        err.message || "Failed to load objects. Please try again later."
      );
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadFile) {
      toast.error("Error", { description: "Please select a file to upload" });
      return;
    }

    const key = uploadKey || uploadFile.name;
    if (!key.trim()) {
      toast.error("Error", { description: "File name is required" });
      return;
    }

    setIsUploading(true);

    // This is a placeholder for now - we'll implement actual file upload later
    // For now, let's simulate a successful upload
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add the new object to the list
      const newObject: BucketObject = {
        key: currentPrefix + key,
        size: uploadFile.size,
        lastModified: new Date().toISOString(),
        etag: Math.random().toString(36).substring(2),
        storageClass: "STANDARD",
      };

      setObjects((prev) => [...prev, newObject]);
      setFilteredItems((prev) => [...prev, newObject]);

      toast.success("Success!", {
        description: `File "${key}" uploaded successfully`,
      });

      // Reset form and close dialog
      setUploadKey("");
      setUploadFile(null);
      setIsUploadDialogOpen(false);
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
      if (!uploadKey) {
        setUploadKey(e.target.files[0].name);
      }
    }
  };

  const toggleFileSelection = (key: string) => {
    setSelectedFiles((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAllFiles = () => {
    if (selectedFiles.length === filteredItems.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(
        filteredItems
          .filter((item) => !("isDirectory" in item && item.isDirectory))
          .map((item) => ("key" in item ? item.key : ""))
          .filter(Boolean)
      );
    }
  };

  const navigateToFolder = (prefix: string) => {
    router.push(`/dashboard/files?bucket=${bucketName}&prefix=${prefix}`);
  };

  const navigateUp = () => {
    if (!currentPrefix) return;

    // Remove the last folder and the trailing slash
    const parts = currentPrefix.split("/");
    parts.pop(); // Remove the empty string after the last slash
    if (parts.length > 0) {
      parts.pop(); // Remove the last folder
      const newPrefix = parts.join("/") + (parts.length > 0 ? "/" : "");
      router.push(`/dashboard/files?bucket=${bucketName}&prefix=${newPrefix}`);
    } else {
      // If we're at the root level, remove the prefix
      router.push(`/dashboard/files?bucket=${bucketName}`);
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (contentType === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (contentType.startsWith("video/")) {
      return (
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
          className="h-4 w-4 text-purple-500"
        >
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
      );
    } else if (
      contentType === "application/json" ||
      contentType === "text/javascript"
    ) {
      return (
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
          className="h-4 w-4 text-green-500"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    } else if (contentType === "application/zip") {
      return (
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
          className="h-4 w-4 text-amber-500"
        >
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      );
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  // Generate breadcrumbs for the current path
  const renderBreadcrumbs = () => {
    if (!currentPrefix) {
      return (
        <Breadcrumb className="flex items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/buckets">Buckets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/files?bucket=${bucketName}`}>
              {bucketName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      );
    }

    const parts = currentPrefix.split("/").filter(Boolean);
    let currentPath = "";

    return (
      <Breadcrumb className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/buckets">Buckets</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/dashboard/files?bucket=${bucketName}`}>
            {bucketName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((part, index) => {
          currentPath += part + "/";
          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/dashboard/files?bucket=${bucketName}&prefix=${currentPath}`}
                >
                  {part}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </Breadcrumb>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            {renderBreadcrumbs()}
            <h1 className="text-2xl font-bold tracking-tight mt-2">
              <Skeleton className="h-8 w-48" />
            </h1>
            <p className="text-muted-foreground">
              <Skeleton className="h-4 w-64 mt-1" />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            {renderBreadcrumbs()}
            <h1 className="text-2xl font-bold tracking-tight mt-2">
              {bucketName}
            </h1>
          </div>
        </div>

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Error Loading Files
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchObjects}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            {bucketName}
          </h1>
          <p className="text-muted-foreground">
            {currentPrefix
              ? `Browsing ${currentPrefix}`
              : "Manage files in this bucket"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload file</DialogTitle>
                <DialogDescription>
                  Upload a file to the {bucketName} bucket
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file-key">File path/key</Label>
                  <Input
                    id="file-key"
                    placeholder={
                      currentPrefix
                        ? `${currentPrefix}your-file.jpg`
                        : "path/to/your/file.jpg"
                    }
                    value={uploadKey}
                    onChange={(e) => setUploadKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The key is the full path and filename in the bucket
                  </p>
                </div>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">
                      {uploadFile ? uploadFile.name : "Drag & drop files here"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {uploadFile
                        ? `${formatBytes(uploadFile.size)}`
                        : "or click to browse files"}
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUploadFile} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <FolderOpen className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only">Sort</span>
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedFiles.length} selected
            </span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    filteredItems.length > 0 &&
                    selectedFiles.length === objects.length
                  }
                  onCheckedChange={toggleAllFiles}
                  aria-label="Select all files"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPrefix && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="font-medium">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                    onClick={navigateUp}
                  >
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    ../ (Parent Directory)
                  </div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}

            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery
                    ? "No files found matching your search."
                    : "No files found in this location. Upload your first file!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, index) => {
                if ("prefix" in item) {
                  // This is a directory (common prefix)
                  return (
                    <TableRow key={`dir-${index}`}>
                      <TableCell></TableCell>
                      <TableCell className="font-medium">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:text-primary"
                          onClick={() => navigateToFolder(item.prefix)}
                        >
                          <FolderOpen className="h-4 w-4 text-primary" />
                          {item.prefix.split("/").filter(Boolean).pop()}/
                        </div>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
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
                              onClick={() => navigateToFolder(item.prefix)}
                            >
                              <FolderOpen className="mr-2 h-4 w-4" />
                              <span>Open Folder</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Folder</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  // This is a file
                  const fileName = item.key.split("/").pop() || item.key;
                  const contentType = getContentTypeFromKey(fileName);

                  return (
                    <TableRow key={`file-${index}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(item.key)}
                          onCheckedChange={() => toggleFileSelection(item.key)}
                          aria-label={`Select ${item.key}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getFileIcon(contentType)}
                          {fileName}
                        </div>
                      </TableCell>
                      <TableCell>{formatBytes(item.size)}</TableCell>
                      <TableCell>
                        {new Date(item.lastModified).toLocaleString()}
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
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link2 className="mr-2 h-4 w-4" />
                              <span>Copy URL</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            )}
          </TableBody>
        </Table>
      </div>

      {isTruncated && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchObjects(true)}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
