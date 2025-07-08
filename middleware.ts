import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Halaman yang memerlukan autentikasi
const protectedRoutes = [
  "/dashboard",
  "/kpi-admin",
  "/kpi-client",
  "/keuangan",
  "/calendar",
  "/clients",
  "/reports",
  "/settings",
]

// Halaman yang hanya bisa diakses jika belum login
const authRoutes = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cek apakah user sudah login (ada token)
  const token = request.cookies.get("token")?.value
  const isAuthenticated = !!token

  // Jika mengakses halaman auth tapi sudah login, redirect ke dashboard
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Jika mengakses halaman protected tapi belum login, redirect ke login
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect root ke dashboard jika sudah login, ke login jika belum
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
