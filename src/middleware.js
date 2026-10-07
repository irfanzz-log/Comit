import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Rute publik di bawah /internal yang tidak memerlukan autentikasi.
const PUBLIC_INTERNAL_ROUTES = new Set(["/internal/login", "/internal/sign"]);

// Middleware berjalan di Edge runtime, sehingga tidak bisa memakai paket
// `jsonwebtoken` (butuh Node crypto). Verifikasi HS256 dilakukan dengan
// `jose` yang Edge-safe, memakai secret yang sama dengan src/lib/jwt.js.
async function verifyTokenEdge(token, secret) {
    try {
        const key = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // ---------------------------------------------------- /api/* → cache headers
    // Semua endpoint API di-cache di client (src/lib/apiCache.js) yang
    // sudah scoped per-user. Browser/proxy shared cache TIDAK boleh
    // menyimpan respons ini — akan membocorkan data satu user ke user lain
    // pada infra yang dipakai bersama (CDN, service worker, proxy kantor).
    if (pathname.startsWith("/api/")) {
        const res = NextResponse.next();
        res.headers.set(
            "Cache-Control",
            "private, no-store, must-revalidate"
        );
        return res;
    }

    if (PUBLIC_INTERNAL_ROUTES.has(pathname)) {
        return NextResponse.next();
    }

    // Cek keberadaan token saja tidak cukup — diverifikasi dulu, agar
    // cookie token palsu/kedaluwarsa tidak lolos ke halaman internal.
    const token = req.cookies.get("token")?.value;
    const payload = token
        ? await verifyTokenEdge(token, process.env.JWT_SECRET)
        : null;

    if (!payload) {
        const loginUrl = new URL("/internal/login", req.url);
        loginUrl.searchParams.set("from", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // /internal/:path* → proteksi autentikasi.
    // /api/:path*     → lampirkan header cache pada respons API. Middleware
    //                   membaca request, jadi kita bisa set header di satu
    //                   tempat untuk semua endpoint, bukan duplikasi di
    //                   12 file route.
    matcher: ["/internal/:path*", "/api/:path*"],
};
