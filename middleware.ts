import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is authenticated, the token will be available in req.nextauth.token
    const token = req.nextauth.token;
    const isAdmin = token?.email === process.env.ADMIN_EMAIL || token?.email === "admin@ascend.lk"; // Fallback for demo

    // If accessing admin routes and not an admin, redirect to home
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure user is logged in
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
