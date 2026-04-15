import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/cv-analyzer",
  "/cv-builder",
  "/skill-gap",
  "/roadmap",
  "/doc-builder",
  "/mock-interview",
  "/job-fit",
  "/checklist",
  "/quiz",
  "/saved-jobs",
  "/history",
  "/profile",
];

// Routes that require ADMIN role
const ADMIN_PREFIXES = ["/admin"];

// Public routes (no auth needed)
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/onboarding",
  "/market",
  "/",
  "/api/auth",
  "/design-preview",
  "/_next",
  "/favicon",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) =>
      pathname === p ||
      pathname.startsWith(p + "/") ||
      pathname.startsWith("/_next")
  );
}

function requiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function requiresAdmin(pathname: string): boolean {
  return ADMIN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and static assets
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check session cookie (fast check, no DB call)
  const sessionCookie = getSessionCookie(request);

  const needsAuth = requiresAuth(pathname);
  const needsAdmin = requiresAdmin(pathname);

  if ((needsAuth || needsAdmin) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
