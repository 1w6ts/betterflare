"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  Download,
  FileText,
  HardDrive,
  Plus,
  Upload,
  Zap,
  Clock,
  AlertCircle,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore, formatBytes, getTimeAgo } from "@/lib/store";
import {
  hasCloudflareCredentials,
  listBuckets,
  listObjects,
} from "@/lib/cloudflare";
import { SettingsDialog } from "@/components/dashboard/settings-dialog";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";

// Skeleton loader component
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [storageProgress, setStorageProgress] = useState(0);

  // Get data from store
  const user = useStore((state) => state.user);
  const activityLogs = useStore((state) => state.activityLogs);
  const getTotalStorageUsed = useStore((state) => state.getTotalStorageUsed);
  const getTotalStorageLimit = useStore((state) => state.getTotalStorageLimit);
  const getStoragePercentage = useStore((state) => state.getStoragePercentage);

  // Add these state variables after the existing useState declarations
  const [buckets, setBuckets] = useState<any[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  // Next Router
  const router = useRouter();

  // Calculate storage stats
  const totalFilesCalc = totalFiles; // We already calculated this from API data
  const storageUsedCalc = storageUsed; // We already calculated this from API data
  const storageLimitCalc = getTotalStorageLimit();
  const storagePercentageCalc = getStoragePercentage();

  // Replace the existing useEffect with this updated version that checks for credentials
  useEffect(() => {
    const checkCredentials = async () => {
      // Check if we're in the browser environment
      if (typeof window !== "undefined") {
        const hasCredentials = hasCloudflareCredentials();

        if (!hasCredentials) {
          setLoading(false);
          return;
        }

        try {
          // Fetch actual data if credentials exist
          const bucketsData = await listBuckets();
          setBuckets(bucketsData.buckets || []);

          // Calculate total files by fetching objects from each bucket
          let totalFilesCount = 0;
          let totalStorageSize = 0;

          for (const bucket of bucketsData.buckets || []) {
            try {
              const objectsData = await listObjects(bucket.name, {
                maxKeys: 1000,
              });
              totalFilesCount += objectsData.objects?.length || 0;

              // Calculate total size
              objectsData.objects?.forEach((obj: any) => {
                totalStorageSize += obj.size || 0;
              });
            } catch (err) {
              console.error(
                `Error fetching objects for bucket ${bucket.name}:`,
                err
              );
            }
          }

          // Update state with actual data
          setTotalFiles(totalFilesCount);
          setStorageUsed(totalStorageSize);
        } catch (err) {
          console.error("Error fetching data:", err);
        }

        // Simulate initial loading
        const timer = setTimeout(() => {
          setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
      }
    };

    checkCredentials();
  }, []);

  // Add this useEffect to check for credentials
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasCredentials(hasCloudflareCredentials());
    }
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setStorageProgress(storagePercentageCalc);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, storagePercentageCalc]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your R2 storage and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <p className="flex gap-1 items-center opacity-15">
            made with <FaHeart /> by 1w6ts
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {loading ? (
          // Skeleton loaders for stats cards
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full mt-3" />
                </CardContent>
              </Card>
            ))
        ) : !hasCredentials ? (
          // No credentials state
          <Card className="col-span-4 overflow-hidden transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cloudflare R2 Not Configured
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Cloudflare R2 Credentials
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please configure your Cloudflare R2 credentials to view your
                  storage statistics.
                </p>
                <Button onClick={() => setIsSettingsDialogOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Cloudflare
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Actual stats cards with real data
          <>
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Storage
                </CardTitle>
                <HardDrive className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(storageUsed)}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {formatBytes(getTotalStorageLimit())} (
                  {Math.round((storageUsed / getTotalStorageLimit()) * 100)}%)
                </p>
                <Progress
                  value={storageProgress}
                  className="mt-3 h-1.5 transition-all duration-1000"
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Buckets
                </CardTitle>
                <Database className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{buckets.length}</div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                  >
                    {buckets.length > 0
                      ? `${buckets.length} active`
                      : "No buckets"}
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1.5">
                    {buckets.length > 0
                      ? "buckets available"
                      : "Create your first bucket"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Files
                </CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFiles}</div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                  >
                    {totalFiles > 0 ? `${totalFiles} files` : "No files"}
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1.5">
                    {totalFiles > 0
                      ? "across all buckets"
                      : "Upload your first file"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            disabled
            value="analytics"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger
            disabled
            value="activity"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        {loading ? (
          // Skeleton loaders for content
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : !hasCredentials ? (
          <Card>
            <CardHeader>
              <CardTitle>Configure Cloudflare R2</CardTitle>
              <CardDescription>
                Set up your Cloudflare R2 credentials to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Cloudflare R2 Credentials
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To use Betterflare, you need to configure your Cloudflare R2
                  credentials. This will allow you to manage your buckets and
                  files.
                </p>
                <Button onClick={() => setIsSettingsDialogOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Cloudflare
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <Card className="lg:col-span-4 transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span>Buckets</span>
                </CardTitle>
                <CardDescription>
                  Your R2 storage buckets and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {buckets.length === 0 ? (
                  <div className="text-center py-6">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Buckets Found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any R2 buckets yet. Create your first
                      bucket to get started.
                    </p>
                    <Button
                      onClick={() =>
                        router.push("/dashboard/buckets?action=create")
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Bucket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {buckets.map((bucket, i) => {
                      const bucketSize = bucket.size || 0;
                      const percentage =
                        storageUsed > 0
                          ? Math.round((bucketSize / storageUsed) * 100)
                          : 0;

                      return (
                        <div key={bucket.name} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {bucket.name}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatBytes(bucketSize)}
                            </div>
                          </div>
                          <Progress
                            value={percentage}
                            className="h-1.5 group-hover:bg-muted/70 transition-colors"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>{bucket.objects_count || 0} files</span>
                            <span>{percentage}% of total</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group"
                      >
                        <Link href="/dashboard/buckets">
                          View all buckets
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && hasCredentials && (
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span>Storage Insights</span>
              </CardTitle>
              <CardDescription>
                Recommendations to optimize your storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageUsed > getTotalStorageLimit() * 0.7 && (
                  <div className="rounded-lg border p-4 bg-amber-500/5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          Storage limit approaching
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You're using{" "}
                          {Math.round(
                            (storageUsed / getTotalStorageLimit()) * 100
                          )}
                          % of your storage limit. Consider upgrading your plan
                          or cleaning up unused files.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">
                            Upgrade Plan
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8">
                            Clean Up
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {buckets.length === 0 ? (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <Database className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          Get Started with R2
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create your first bucket to start storing and managing
                          your files with Cloudflare R2.
                        </p>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              router.push("/dashboard/buckets?action=create")
                            }
                          >
                            Create Bucket
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : totalFiles === 0 ? (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <Upload className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          Upload Your First Files
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have {buckets.length}{" "}
                          {buckets.length === 1 ? "bucket" : "buckets"} ready.
                          Start uploading files to make the most of your R2
                          storage.
                        </p>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              router.push(
                                `/dashboard/files?bucket=${buckets[0]?.name}`
                              )
                            }
                          >
                            Upload Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <Zap className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          Optimize Your Storage
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You have {totalFiles} files across {buckets.length}{" "}
                          {buckets.length === 1 ? "bucket" : "buckets"}.
                          Consider organizing your files for better management.
                        </p>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => router.push("/dashboard/buckets")}
                          >
                            Manage Buckets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Storage Analytics</span>
              </CardTitle>
              <CardDescription>
                Storage usage and trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Analytics charts would be displayed here</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Activity Log</span>
              </CardTitle>
              <CardDescription>
                Detailed log of all actions in your storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {activityLogs.slice(0, 8).map((activity) => {
                  const getActivityColor = (action: string) => {
                    switch (action) {
                      case "upload":
                        return "bg-green-500/10 text-green-500";
                      case "create":
                        return "bg-blue-500/10 text-blue-500";
                      case "download":
                        return "bg-purple-500/10 text-purple-500";
                      case "delete":
                        return "bg-red-500/10 text-red-500";
                      case "share":
                        return "bg-amber-500/10 text-amber-500";
                      default:
                        return "bg-gray-500/10 text-gray-500";
                    }
                  };

                  const getActivityIcon = (action: string) => {
                    switch (action) {
                      case "upload":
                        return Upload;
                      case "create":
                        return Plus;
                      case "download":
                        return Download;
                      case "delete":
                        return FileText;
                      case "share":
                        return ArrowUpRight;
                      default:
                        return FileText;
                    }
                  };

                  const Icon = getActivityIcon(activity.action);

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 border-b pb-4 last:border-0 group"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${getActivityColor(
                          activity.action
                        )} transition-transform group-hover:scale-110`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                            {activity.action.charAt(0).toUpperCase() +
                              activity.action.slice(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          User: {activity.user}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center">
                <Button variant="outline" size="sm">
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {!loading && !hasCredentials && (
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
      )}
    </div>
  );
}
