import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Daftar rute yang dapat diakses oleh staff
const staffAccessibleRoutes = ["/clients", "/kpi-client", "/kpi-admin", "/login", "/logout"]

export function middleware(request: NextRequest) {
  // Mendapatkan cookie user
  const userCookie = request.cookies.get("user")?.value
  const isLoggedIn = !!userCookie

  // Path saat ini
  const path = request.nextUrl.pathname

  // Paths yang tidak memerlukan autentikasi
  const publicPaths = ["/login"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Jika user tidak login dan mencoba mengakses rute terproteksi
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Jika user sudah login dan mencoba mengakses halaman login
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Memeriksa peran pengguna jika sudah login
  if (isLoggedIn && !isPublicPath) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie))
      const isStaff = userData.role === "staff"

      // Jika staff mencoba mengakses halaman yang tidak diizinkan
      if (isStaff) {
        const isAllowed = staffAccessibleRoutes.some((route) => path.startsWith(route))

        if (!isAllowed) {
          // Redirect ke halaman yang diizinkan
          return NextResponse.redirect(new URL("/clients", request.url))
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      // Jika terjadi error, logout user
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("user")
      return response
    }
  }

  return NextResponse.next()
}

// Konfigurasi matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
