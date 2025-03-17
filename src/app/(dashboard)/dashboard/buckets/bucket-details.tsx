"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Database,
  Download,
  Edit,
  Globe,
  Settings,
  Shield,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBucket } from "@/lib/cloudflare";

type BucketDetailsProps = {
  bucketName: string;
  onBack: () => void;
};

export function BucketDetails({ bucketName, onBack }: BucketDetailsProps) {
  const router = useRouter();
  const [bucket, setBucket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBucketDetails();
  }, [bucketName]);

  const fetchBucketDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const bucketData = await getBucket(bucketName);
      console.log("Bucket data:", bucketData); // Debug log
      setBucket(bucketData);
    } catch (err: any) {
      console.error("Error fetching bucket details:", err);
      setError(err.message || "Failed to load bucket details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to buckets
          </Button>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to buckets
          </Button>
        </div>

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Error Loading Bucket Details
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchBucketDetails}>Retry</Button>
        </div>
      </div>
    );
  }

  // Ensure bucket data is available
  if (!bucket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to buckets
          </Button>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800/30 dark:bg-amber-900/10">
          <h3 className="text-lg font-medium text-amber-800 dark:text-amber-500 mb-2">
            No Bucket Data Available
          </h3>
          <p className="text-amber-700 dark:text-amber-400 mb-4">
            Could not retrieve bucket details. Please try again.
          </p>
          <Button onClick={fetchBucketDetails}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to buckets
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">{bucketName}</h1>
          <Badge
            variant={bucket.public_access?.enabled ? "default" : "outline"}
            className="ml-2"
          >
            {bucket.public_access?.enabled ? "Public" : "Private"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/files?bucket=${bucketName}`)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/files?bucket=${bucketName}`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bucket Information</CardTitle>
                <CardDescription>
                  Basic details about this bucket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{bucket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">
                    {formatDate(bucket.creation_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">
                    {bucket.location || "Default"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Storage Class:</span>
                  <span className="text-sm">
                    {bucket.storage_class || "Standard"}
                  </span>
                </div>
                {bucket.jurisdiction && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Jurisdiction:</span>
                    <span className="text-sm">{bucket.jurisdiction}</span>
                  </div>
                )}
                {bucket.size !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm">{bucket.size} bytes</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Properties
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Settings</CardTitle>
                <CardDescription>
                  Public access and domain configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Public Access:</span>
                  <Badge
                    variant={
                      bucket.public_access?.enabled ? "default" : "outline"
                    }
                  >
                    {bucket.public_access?.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Downloadable:</span>
                  <Badge
                    variant={
                      bucket.public_access?.downloadable ? "default" : "outline"
                    }
                  >
                    {bucket.public_access?.downloadable ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Custom Domain:</span>
                  <span className="text-sm">
                    {bucket.custom_domain || "None"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Access
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common operations for this bucket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() =>
                    router.push(`/dashboard/files?bucket=${bucketName}`)
                  }
                >
                  <Download className="h-5 w-5" />
                  <span>Browse Files</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configure CORS</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                >
                  <Globe className="h-5 w-5" />
                  <span>Set Up Domain</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Bucket Settings</CardTitle>
              <CardDescription>
                Configure your bucket properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings content will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Manage permissions and access policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access control content will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
