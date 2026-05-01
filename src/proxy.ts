import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminEnabled = process.env.ADMIN_ENABLED === "true";
  const username = process.env.ADMIN_BASIC_USER;
  const password = process.env.ADMIN_BASIC_PASSWORD;

  // Admin is dark by default in every environment. This prevents accidentally
  // exposing write routes just because the code exists.
  if (!adminEnabled || !username || !password) {
    return new NextResponse("Not found", { status: 404 });
  }

  // UploadThing sends signed server-to-server callbacks after the browser uploads
  // directly to storage. Let those through so the route handler can verify the
  // UploadThing signature; keep browser/admin upload actions behind Basic Auth.
  const uploadThingHook = request.headers.get("uploadthing-hook");
  if (
    pathname === "/admin/api/uploadthing" &&
    (uploadThingHook === "callback" || uploadThingHook === "error")
  ) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const expected = `Basic ${btoa(`${username}:${password}`)}`;
  const adminSession = request.cookies.get("model_home_admin_auth")?.value;

  if (authHeader === expected || adminSession === expected) {
    const response = NextResponse.next();
    if (authHeader === expected && adminSession !== expected) {
      response.cookies.set("model_home_admin_auth", expected, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/admin",
        maxAge: 60 * 60 * 8,
      });
    }
    return response;
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Model Home Art Private Admin v2"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
