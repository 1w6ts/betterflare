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
export const getBucket = async (bucketName: string) => {
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

// List objects in a bucket (using S3 API)
export const listObjects = async (bucketName: string, prefix = "") => {
  // For listing objects, we need to use the S3 API
  // This would require the AWS SDK for JavaScript in the browser
  // For simplicity in this demo, we'll use our mock API
  try {
    const response = await fetch(
      `/api/buckets/${bucketName}/objects?prefix=${prefix}`
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
