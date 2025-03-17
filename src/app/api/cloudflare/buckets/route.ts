import { type NextRequest, NextResponse } from "next/server";

// Proxy endpoint for Cloudflare R2 bucket operations
export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor") || "";
  const direction = searchParams.get("direction") || "asc";
  const nameContains = searchParams.get("name_contains") || "";
  const order = searchParams.get("order") || "name";
  const perPage = searchParams.get("per_page") || "100";
  const startAfter = searchParams.get("start_after") || "";
  const jurisdiction = searchParams.get("jurisdiction") || "default";

  // Get credentials from request headers
  const accountId = request.headers.get("x-cf-account-id");
  const apiToken = request.headers.get("x-cf-api-token");

  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: "Missing Cloudflare credentials" },
      { status: 400 }
    );
  }

  // Build query parameters for Cloudflare API
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (direction) params.append("direction", direction);
  if (nameContains) params.append("name_contains", nameContains);
  if (order) params.append("order", order);
  if (perPage) params.append("per_page", perPage);
  if (startAfter) params.append("start_after", startAfter);

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets?${params.toString()}`,
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
          error: data.errors?.[0]?.message || "Failed to fetch buckets",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to Cloudflare:", error);
    return NextResponse.json(
      { error: "Failed to communicate with Cloudflare API" },
      { status: 500 }
    );
  }
}

// Create bucket
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.errors?.[0]?.message || "Failed to create bucket",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to Cloudflare:", error);
    return NextResponse.json(
      { error: "Failed to communicate with Cloudflare API" },
      { status: 500 }
    );
  }
}
