// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/vote(.*)', 
  '/admin(.*)', 
  '/success(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Simple check: If trying to access a protected route, just ensure they are logged in.
  // We will check if they are actually an ADMIN inside the page code itself (Server Actions).
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};