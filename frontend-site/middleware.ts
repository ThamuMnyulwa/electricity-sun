import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwtToken } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth"]
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`[Middleware] Public route: ${pathname}, allowing access`)
    return NextResponse.next()
  }

  // Get auth token from cookies
  const token = request.cookies.get("auth-token")?.value

  console.log(`[Middleware] Protected route: ${pathname}, token exists: ${!!token}`)

  // If no token, redirect to sign-in
  if (!token) {
    console.log(`[Middleware] No token found, redirecting to sign-in`)
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Verify token
  try {
    const payload = await verifyJwtToken(token)

    if (!payload) {
      console.log(`[Middleware] Invalid token, redirecting to sign-in`)
      const signInUrl = new URL("/sign-in", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Role-based access control
    const role = payload.role as string
    console.log(`[Middleware] User authenticated with role: ${role}, accessing: ${pathname}`)

    // Check for role-specific access
    if (role === "applicant" && pathname.startsWith("/admin")) {
      console.log(`[Middleware] Applicant trying to access admin route, redirecting`)
      return NextResponse.redirect(new URL("/applicant/dashboard", request.url))
    }

    if (role === "applicant" && pathname.startsWith("/organization")) {
      console.log(`[Middleware] Applicant trying to access organization route, redirecting`)
      return NextResponse.redirect(new URL("/applicant/dashboard", request.url))
    }

    if (role === "admin" && pathname.startsWith("/applicant")) {
      console.log(`[Middleware] Admin trying to access applicant route, redirecting`)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    if (role === "admin" && pathname.startsWith("/organization")) {
      console.log(`[Middleware] Admin trying to access organization route, redirecting`)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    if (role === "organization" && pathname.startsWith("/admin")) {
      console.log(`[Middleware] Organization trying to access admin route, redirecting`)
      return NextResponse.redirect(new URL("/organization/dashboard", request.url))
    }

    if (role === "organization" && pathname.startsWith("/applicant")) {
      console.log(`[Middleware] Organization trying to access applicant route, redirecting`)
      return NextResponse.redirect(new URL("/organization/dashboard", request.url))
    }

    console.log(`[Middleware] Access granted to ${pathname}`)
    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
