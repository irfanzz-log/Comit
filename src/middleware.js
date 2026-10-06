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
    if (PUBLIC_INTERNAL_ROUTES.has(req.nextUrl.pathname)) {
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
    matcher: ["/internal/:path*"],
};
