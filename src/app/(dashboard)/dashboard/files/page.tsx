"use client";

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
import { toast } from "sonner";

// Define the object type based on the API response
type BucketObject = {
  key: string;
  size: number;
  lastModified: string;
  etag: string;
  contentType: string;
};

export default function FilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bucketName = searchParams.get("bucket") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [objects, setObjects] = useState<BucketObject[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<BucketObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for uploading a file
  const [uploadKey, setUploadKey] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if no bucket is specified
  useEffect(() => {
    if (!bucketName) {
      router.push("/dashboard/buckets");
    }
  }, [bucketName, router]);

  // Fetch objects on component mount
  useEffect(() => {
    if (bucketName) {
      fetchObjects();
    }
  }, [bucketName]);

  // Filter objects when search query changes
  useEffect(() => {
    if (objects.length > 0) {
      setFilteredObjects(
        objects.filter((obj) =>
          obj.key.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, objects]);

  const fetchObjects = async () => {
    if (!bucketName) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/buckets/${bucketName}/objects`);

      if (!response.ok) {
        throw new Error("Failed to fetch objects");
      }

      const data = await response.json();
      setObjects(data);
      setFilteredObjects(data);
    } catch (err) {
      console.error("Error fetching objects:", err);
      setError("Failed to load objects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadObject = async () => {
    if (!uploadKey.trim()) {
      toast.error("Error", { description: "Object key is required" });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch(`/api/buckets/${bucketName}/objects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: uploadKey,
          size: Math.floor(Math.random() * 10000000) + 1000, // Random size between 1KB and 10MB
          contentType: getContentTypeFromKey(uploadKey),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload object");
      }

      const newObject = await response.json();

      // Add the new object to the list
      setObjects((prev) => [...prev, newObject]);
      toast.success("Success", {
        description: `Object "${uploadKey}" uploaded successfully`,
      });

      // Reset form and close dialog
      setUploadKey("");
      setIsUploadDialogOpen(false);
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to upload object",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getContentTypeFromKey = (key: string): string => {
    const extension = key.split(".").pop()?.toLowerCase() || "";

    const contentTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      svg: "image/svg+xml",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      txt: "text/plain",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
      zip: "application/zip",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "audio/ogg",
      wav: "audio/wav",
    };

    return contentTypes[extension] || "application/octet-stream";
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const toggleFileSelection = (key: string) => {
    setSelectedFiles((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAllFiles = () => {
    if (selectedFiles.length === filteredObjects.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredObjects.map((obj) => obj.key));
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/buckets">
                  Buckets
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Skeleton className="h-4 w-32" />
              </BreadcrumbItem>
            </Breadcrumb>
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
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/buckets">
                  Buckets
                </BreadcrumbLink>
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
          <Button onClick={fetchObjects}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
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
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            {bucketName}
          </h1>
          <p className="text-muted-foreground">Manage files in this bucket</p>
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
                    placeholder="path/to/your/file.jpg"
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
                      Drag & drop files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse files
                    </p>
                    <Input type="file" className="hidden" id="file-upload" />
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
                <Button onClick={uploadObject} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
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
                    filteredObjects.length > 0 &&
                    selectedFiles.length === filteredObjects.length
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
            {filteredObjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery
                    ? "No files found matching your search."
                    : "No files found in this bucket. Upload your first file!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredObjects.map((object) => (
                <TableRow key={object.key}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.includes(object.key)}
                      onCheckedChange={() => toggleFileSelection(object.key)}
                      aria-label={`Select ${object.key}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getFileIcon(object.contentType)}
                      {object.key.split("/").pop()}
                    </div>
                    {object.key.includes("/") && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {object.key.substring(0, object.key.lastIndexOf("/"))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatBytes(object.size)}</TableCell>
                  <TableCell>
                    {new Date(object.lastModified).toLocaleString()}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
