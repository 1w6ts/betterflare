import { type NextRequest, NextResponse } from "next/server";

// Get bucket details
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const bucketName = params.name;

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const apiToken = request.headers.get("x-cf-api-token");
  const jurisdiction = request.headers.get("x-cf-jurisdiction") || "default";

  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: "Missing Cloudflare credentials" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          "cf-r2-jurisdiction": jurisdiction,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.errors?.[0]?.message || "Failed to fetch bucket details",
        },
        { status: response.status }
      );
    }

    // Return the full bucket details
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to Cloudflare:", error);
    return NextResponse.json(
      { error: "Failed to communicate with Cloudflare API" },
      { status: 500 }
    );
  }
}

// Delete bucket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const bucketName = params.name;

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const apiToken = request.headers.get("x-cf-api-token");

  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: "Missing Cloudflare credentials" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        {
          error: data.errors?.[0]?.message || "Failed to delete bucket",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error proxying request to Cloudflare:", error);
    return NextResponse.json(
      { error: "Failed to communicate with Cloudflare API" },
      { status: 500 }
    );
  }
}
