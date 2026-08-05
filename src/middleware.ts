import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage =
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register" ||
      req.nextUrl.pathname === "/forgot-password" ||
      req.nextUrl.pathname === "/reset-password";

    // If the user is on an auth/public page but is already authenticated, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
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

        if (isProtectedRoute) {
          return !!token;
        }
        // For all other routes, allow the request to proceed to the middleware function
        return true;
      },
    },
    pages: {
      signIn: "/login",
    }
  }
);

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
