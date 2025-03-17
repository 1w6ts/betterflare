// Client-side utility for Cloudflare R2 operations

/**
 * Client-side utility for Cloudflare R2 operations
 * This uses credentials stored in localStorage
 */

// Check if credentials are set in localStorage
export const hasCloudflareCredentials = (): boolean => {
  return !!(
    localStorage.getItem("cloudflare_account_id") &&
    localStorage.getItem("cloudflare_api_token")
  );
};

// Get credentials from localStorage
export const getCloudflareCredentials = () => {
  return {
    accountId: localStorage.getItem("cloudflare_account_id") || "",
    apiToken: localStorage.getItem("cloudflare_api_token") || "",
    accessKeyId: localStorage.getItem("cloudflare_access_key_id") || "",
    secretAccessKey: localStorage.getItem("cloudflare_secret_access_key") || "",
    endpoint: localStorage.getItem("cloudflare_r2_endpoint") || "",
    region: localStorage.getItem("cloudflare_region") || "auto",
  };
};

// List all buckets - using our proxy API
export const listBuckets = async ({
  cursor = "",
  direction = "asc",
  nameContains = "",
  order = "name",
  perPage = 100,
  startAfter = "",
  jurisdiction = "default",
} = {}) => {
  const { accountId, apiToken } = getCloudflareCredentials();

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials not found");
  }

  // Build query parameters
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (direction) params.append("direction", direction);
  if (nameContains) params.append("name_contains", nameContains);
  if (order) params.append("order", order);
  if (perPage) params.append("per_page", perPage.toString());
  if (startAfter) params.append("start_after", startAfter);
  if (jurisdiction) params.append("jurisdiction", jurisdiction);

  try {
    // Use our proxy API instead of calling Cloudflare directly
    const response = await fetch(
      `/api/cloudflare/buckets?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-cf-account-id": accountId,
          "x-cf-api-token": apiToken,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to list buckets");
    }

    const data = await response.json();
    return {
      buckets: data.result?.buckets || [],
      pagination: data.result_info || { cursor: null, per_page: perPage },
    };
  } catch (error) {
    console.error("Error listing buckets:", error);
    throw error;
  }
};

// Get a single bucket
export const getBucket = async (
  bucketName: string,
  jurisdiction = "default"
) => {
  const { accountId, apiToken } = getCloudflareCredentials();

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials not found");
  }

  try {
    // Use our proxy API
    const response = await fetch(`/api/cloudflare/buckets/${bucketName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-cf-account-id": accountId,
        "x-cf-api-token": apiToken,
        "x-cf-jurisdiction": jurisdiction,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get bucket");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error getting bucket ${bucketName}:`, error);
    throw error;
  }
};

// Create a new bucket
export const createBucket = async (
  bucketName: string,
  options: { publicAccess?: boolean } = {}
) => {
  const { accountId, apiToken } = getCloudflareCredentials();

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials not found");
  }

  try {
    // Use our proxy API
    const response = await fetch(`/api/cloudflare/buckets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cf-account-id": accountId,
        "x-cf-api-token": apiToken,
      },
      body: JSON.stringify({
        name: bucketName,
        ...(options.publicAccess
          ? {
              public_access: {
                enabled: true,
                downloadable: true,
              },
            }
          : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create bucket");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    throw error;
  }
};

// Delete a bucket
export const deleteBucket = async (bucketName: string) => {
  const { accountId, apiToken } = getCloudflareCredentials();

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare credentials not found");
  }

  try {
    // Use our proxy API
    const response = await fetch(`/api/cloudflare/buckets/${bucketName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-cf-account-id": accountId,
        "x-cf-api-token": apiToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete bucket");
    }

    return true;
  } catch (error) {
    console.error(`Error deleting bucket ${bucketName}:`, error);
    throw error;
  }
};

// List objects in a bucket using the S3-compatible API
export const listObjects = async (
  bucketName: string,
  options: {
    prefix?: string;
    delimiter?: string;
    maxKeys?: number;
    continuationToken?: string;
  } = {}
) => {
  const { accountId, apiToken, accessKeyId, secretAccessKey, endpoint } =
    getCloudflareCredentials();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials not found");
  }

  // Build query parameters
  const params = new URLSearchParams();
  if (options.prefix) params.append("prefix", options.prefix);
  if (options.delimiter) params.append("delimiter", options.delimiter);
  if (options.maxKeys) params.append("max-keys", options.maxKeys.toString());
  if (options.continuationToken)
    params.append("continuation-token", options.continuationToken);

  try {
    // Use our proxy API
    const response = await fetch(
      `/api/cloudflare/buckets/${bucketName}/objects?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-cf-account-id": accountId,
          "x-cf-api-token": apiToken,
          "x-cf-access-key-id": accessKeyId,
          "x-cf-secret-access-key": secretAccessKey,
          "x-cf-endpoint":
            endpoint || `https://${accountId}.r2.cloudflarestorage.com`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to list objects");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error listing objects in bucket ${bucketName}:`, error);
    throw error;
  }
};

// Get content type based on file extension
export const getContentTypeFromKey = (key: string): string => {
  const extension = key.split(".").pop()?.toLowerCase() || "";

  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
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

// Format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
