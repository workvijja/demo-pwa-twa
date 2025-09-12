// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = "http://159.65.139.117:20000";

async function handler(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    // Construct target URL with path + query
    const {slug} = await params;
    const targetUrl = `${BACKEND_BASE}/api/${slug.join("/")}${req.nextUrl.search}`;

    // Forward request to backend
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // Forward headers (filter out host)
        ...Object.fromEntries(req.headers),
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    });

    // Pipe backend response back
    const data = await backendRes.text();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: backendRes.headers,
    });
  } catch (err) {
    return NextResponse.json(
      {message: "Proxy failed", code: "internal_error", error: (err as Error).message},
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP verbs
export async function GET(req: NextRequest, opt: { params: Promise<{ slug: string[] }> }) {
  return handler(req, opt);
}
export async function POST(req: NextRequest, opt: { params: Promise<{ slug: string[] }> }) {
  return handler(req, opt);
}
export async function PUT(req: NextRequest, opt: { params: Promise<{ slug: string[] }> }) {
  return handler(req, opt);
}
export async function DELETE(req: NextRequest, opt: { params: Promise<{ slug: string[] }> }) {
  return handler(req, opt);
}
export async function PATCH(req: NextRequest, opt: { params: Promise<{ slug: string[] }> }) {
  return handler(req, opt);
}

// Export for all methods
// export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
