import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Mendapatkan cookie user
  const userCookie = request.cookies.get("user")?.value
  const isLoggedIn = !!userCookie

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

  return NextResponse.next()
}

// Konfigurasi matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
