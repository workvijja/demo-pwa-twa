// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = "http://159.65.139.117:20000";

export async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Construct target URL with path + query
    const targetUrl = `${BACKEND_BASE}/${params.path.join("/")}${req.nextUrl.search}`;

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

// Export for all methods
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
