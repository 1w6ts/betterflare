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
  FolderOpen,
  HardDrive,
  Plus,
  Upload,
  Zap,
  Clock,
  AlertCircle,
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setStorageProgress(83);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, Jacob!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your R2 storage and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            New Bucket
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        ) : (
          // Actual stats cards
          <>
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Storage
                </CardTitle>
                <HardDrive className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">207.4 GB</div>
                <p className="text-xs text-muted-foreground">of 250 GB (83%)</p>
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
                <div className="text-2xl font-bold">5</div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                  >
                    +1
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1.5">
                    from last month
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
                <div className="text-2xl font-bold">21,067</div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                  >
                    +342
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1.5">
                    from last week
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2 TB</div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                  >
                    +12%
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1.5">
                    from last month
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                  <div className="space-y-5">
                    {[
                      {
                        name: "assets-production",
                        files: "1,245",
                        size: "32.4 GB",
                        percentage: 15,
                      },
                      {
                        name: "user-uploads",
                        files: "8,901",
                        size: "156.7 GB",
                        percentage: 75,
                      },
                      {
                        name: "backups",
                        files: "42",
                        size: "8.9 GB",
                        percentage: 4,
                      },
                      {
                        name: "static-website",
                        files: "312",
                        size: "5.2 GB",
                        percentage: 3,
                      },
                      {
                        name: "logs",
                        files: "10,567",
                        size: "4.1 GB",
                        percentage: 2,
                      },
                    ].map((bucket, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {bucket.name}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {bucket.size}
                          </div>
                        </div>
                        <Progress
                          value={bucket.percentage}
                          className="h-1.5 group-hover:bg-muted/70 transition-colors"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>{bucket.files} files</span>
                          <span>{bucket.percentage}% of total</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Latest actions in your storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {[
                      {
                        action: "Upload",
                        description: "10 files uploaded to user-uploads",
                        time: "2 minutes ago",
                        icon: Upload,
                        color: "bg-green-500/10 text-green-500",
                      },
                      {
                        action: "Create",
                        description: "New bucket 'static-website' created",
                        time: "1 hour ago",
                        icon: Plus,
                        color: "bg-blue-500/10 text-blue-500",
                      },
                      {
                        action: "Download",
                        description: "Downloaded report-2023.pdf",
                        time: "3 hours ago",
                        icon: Download,
                        color: "bg-purple-500/10 text-purple-500",
                      },
                      {
                        action: "Delete",
                        description: "Deleted 5 old backup files",
                        time: "Yesterday",
                        icon: FileText,
                        color: "bg-amber-500/10 text-amber-500",
                      },
                      {
                        action: "Share",
                        description:
                          "Created shareable link for presentation.pptx",
                        time: "2 days ago",
                        icon: ArrowUpRight,
                        color: "bg-indigo-500/10 text-indigo-500",
                      },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${activity.color} transition-transform group-hover:scale-110`}
                        >
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                            {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="group"
                    >
                      <Link href="/dashboard/activity">
                        View all activity
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && (
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
                          You're using 83% of your storage limit. Consider
                          upgrading your plan or cleaning up unused files.
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

                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <Zap className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          Optimize large files
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          We found 15 large files {"(>50MB)"} that could be
                          compressed to save storage space.
                        </p>
                        <div className="mt-3">
                          <Button size="sm" variant="outline" className="h-8">
                            View Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 border-b pb-4 last:border-0 group"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        i % 5 === 0
                          ? "bg-green-500/10"
                          : i % 5 === 1
                          ? "bg-blue-500/10"
                          : i % 5 === 2
                          ? "bg-purple-500/10"
                          : i % 5 === 3
                          ? "bg-red-500/10"
                          : "bg-amber-500/10"
                      } transition-transform group-hover:scale-110`}
                    >
                      {i % 5 === 0 ? (
                        <Upload className={`h-4 w-4 text-green-500`} />
                      ) : i % 5 === 1 ? (
                        <Download className={`h-4 w-4 text-blue-500`} />
                      ) : i % 5 === 2 ? (
                        <Plus className={`h-4 w-4 text-purple-500`} />
                      ) : i % 5 === 3 ? (
                        <FileText className={`h-4 w-4 text-red-500`} />
                      ) : (
                        <FolderOpen className={`h-4 w-4 text-amber-500`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {i % 5 === 0
                            ? "File Upload"
                            : i % 5 === 1
                            ? "File Download"
                            : i % 5 === 2
                            ? "Bucket Created"
                            : i % 5 === 3
                            ? "File Deleted"
                            : "Folder Created"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i < 2
                            ? "Today"
                            : i < 5
                            ? "Yesterday"
                            : `${i - 3} days ago`}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {i % 5 === 0
                          ? `Uploaded file-${i}.jpg to user-uploads bucket`
                          : i % 5 === 1
                          ? `Downloaded file-${i}.pdf from assets-production bucket`
                          : i % 5 === 2
                          ? `Created new bucket bucket-${i}`
                          : i % 5 === 3
                          ? `Deleted old-file-${i}.txt from logs bucket`
                          : `Created folder folder-${i} in backups bucket`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        User: john.doe@example.com
                      </p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
