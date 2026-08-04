import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  
  const isAuthPage =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register" ||
    req.nextUrl.pathname === "/forgot-password" ||
    req.nextUrl.pathname === "/reset-password" ||
    req.nextUrl.pathname === "/"; // Assuming the landing page is also an auth/public page and logged in users go to dashboard

  // If the user is on an auth/public page but is already authenticated, redirect to dashboard
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Define protected routes
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/upload") ||
    req.nextUrl.pathname.startsWith("/parsing") ||
    req.nextUrl.pathname.startsWith("/statements") ||
    req.nextUrl.pathname.startsWith("/analysis") ||
    req.nextUrl.pathname.startsWith("/security") ||
    req.nextUrl.pathname.startsWith("/settings") ||
    req.nextUrl.pathname.startsWith("/insights");

  // If the user is NOT authenticated and tries to access a protected route, redirect to login
  if (!isAuth && isProtectedRoute) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg (icon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
