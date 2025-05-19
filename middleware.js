

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only these routes need auth
const isProtectedRoute = createRouteMatcher([
    "/organization(.*)",
    "/project(.*)",
    "/issue(.*)",
    "/onboarding",

])

export default clerkMiddleware(async (auth, req) => {
    const {userId,orgId} = await auth();

    // If it's a protected route and no userId => redirect to sign-in
    if (!userId && isProtectedRoute(req)) {
        const url = new URL("/sign-in", req.url); // Absolute URL
    return NextResponse.redirect(url);
    }

    if(userId && !orgId && req.nextUrl.pathname !=='/onboarding' && req.nextUrl.pathname !== "/"){
      return NextResponse.redirect(new URL('/onboarding',req.url));
    }
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // IMPORTANT: also allow x/inngest
    '/x/inngest(.*)',
  ],
};
