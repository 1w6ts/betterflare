import { type NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// List objects in a bucket using the S3-compatible API
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const bucketName = params.name;

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const apiToken = request.headers.get("x-cf-api-token");
  const accessKeyId = request.headers.get("x-cf-access-key-id");
  const secretAccessKey = request.headers.get("x-cf-secret-access-key");
  const endpoint =
    request.headers.get("x-cf-endpoint") ||
    `https://${accountId}.r2.cloudflarestorage.com`;

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const prefix = searchParams.get("prefix") || "";
  const delimiter = searchParams.get("delimiter") || "";
  const maxKeys = parseInt(searchParams.get("max-keys") || "1000", 10);
  const continuationToken = searchParams.get("continuation-token") || undefined;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: "Missing required R2 credentials" },
      { status: 400 }
    );
  }

  try {
    // Create S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // List objects in the bucket
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: delimiter || undefined,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    // Transform the response to a more friendly format
    const objects = (response.Contents || []).map((object) => ({
      key: object.Key,
      size: object.Size,
      lastModified: object.LastModified?.toISOString(),
      etag: object.ETag?.replace(/"/g, ""),
      storageClass: object.StorageClass,
    }));

    const commonPrefixes = (response.CommonPrefixes || []).map((prefix) => ({
      prefix: prefix.Prefix,
      isDirectory: true,
    }));

    const result = {
      objects,
      commonPrefixes,
      isTruncated: response.IsTruncated,
      nextContinuationToken: response.NextContinuationToken,
      name: bucketName,
      prefix,
      delimiter,
      maxKeys,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error listing objects:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to list objects in bucket",
        code: error.Code || error.code,
      },
      { status: 500 }
    );
  }
}

// Upload an object to a bucket
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const bucketName = params.name;

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const accessKeyId = request.headers.get("x-cf-access-key-id");
  const secretAccessKey = request.headers.get("x-cf-secret-access-key");
  const endpoint =
    request.headers.get("x-cf-endpoint") ||
    `https://${accountId}.r2.cloudflarestorage.com`;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: "Missing required R2 credentials" },
      { status: 400 }
    );
  }

  try {
    // For file uploads, we'll need to implement multipart form handling
    // This is a placeholder for now
    return NextResponse.json(
      { error: "File upload not yet implemented" },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error uploading object:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload object" },
      { status: 500 }
    );
  }
}

// Delete an object from a bucket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const bucketName = params.name;
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Object key is required" },
      { status: 400 }
    );
  }

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const accessKeyId = request.headers.get("x-cf-access-key-id");
  const secretAccessKey = request.headers.get("x-cf-secret-access-key");
  const endpoint =
    request.headers.get("x-cf-endpoint") ||
    `https://${accountId}.r2.cloudflarestorage.com`;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: "Missing required R2 credentials" },
      { status: 400 }
    );
  }

  try {
    // Create S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // This is a placeholder - we'll implement the actual delete functionality later
    return NextResponse.json(
      { error: "Delete functionality not yet implemented" },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error deleting object:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete object" },
      { status: 500 }
    );
  }
}
