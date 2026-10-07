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

// App Router menuliskan payload RSC sebagai INLINE script
// (`<script>self.__next_f.push([1,"…"])</script>`) — tidak di-hash, tidak
// di-hosting di URL manapun. Karena itu `script-src 'self'` TANPA nonce
// memblokir payload tersebut dan halaman tidak pernah terhidrasi (blank).
//
// Kombinasi yang dipakai: `'self'` membolehkan chunk eksternal
// (webpack-*.js, main-app-*.js) yang di-load dari domain sendiri, dan
// `'nonce-…'` membolehkan inline flight script. Perhatikan: JANGAN
// tambahkan `strict-dynamic` — di CSP Level 3 keyword itu membuat semua
// host-source expression (`'self'`) diabaikan, sehingga chunk eksternal
// malah diblokir.
//
// Nonce harus diset pada REQUEST header (`x-nonce`) agar Next
// memasangnya pada inline script yang di-emiten-nya sendiri.
function buildCsp(nonce) {
    const dev = process.env.NODE_ENV !== "production";
    return [
        "default-src 'self'",
        // Turbopack/Fast Refresh butuh eval di dev.
        `script-src 'self' 'nonce-${nonce}'${
            dev ? " 'unsafe-eval'" : ""
        }`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' https://utfs.io data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
    ].join("; ");
}

export async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Nonce harus unpredictable per-request (nonce yang dipakai ulang pada
    // response ter-cache sama sekali tidak melindungi apa-apa).
    const nonce = btoa(crypto.randomUUID());
    const csp = buildCsp(nonce);

    // Injek ke REQUEST header — Next membaca nonce dari sini untuk inline
    // script yang di-emiten-nya.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("content-security-policy", csp);
    const next = () => NextResponse.next({ request: { headers: requestHeaders } });

    // ---------------------------------------------------- /api/* → cache headers
    // Semua endpoint API di-cache di client (src/lib/apiCache.js) yang
    // sudah scoped per-user. Browser/proxy shared cache TIDAK boleh
    // menyimpan respons ini — akan membocorkan data satu user ke user lain
    // pada infra yang dipakai bersama (CDN, service worker, proxy kantor).
    if (pathname.startsWith("/api/")) {
        const res = next();
        res.headers.set(
            "Cache-Control",
            "private, no-store, must-revalidate"
        );
        // CSP di respons agar JSON tidak dieksekusi sebagai script oleh
        // browser yang melakukan sniffing tipe konten.
        res.headers.set("Content-Security-Policy", csp);
        return res;
    }

    if (!pathname.startsWith("/internal/")) {
        // Rute publik (/, /about, /announcement, /sertifikat/[id], …).
        // Mereka masuk middleware hanya untuk mendapatkan CSP nonce —
        // JANGAN jalankan cek autentikasi di sini, atau seluruh web
        // publik akan diarahkan ke halaman login.
        const res = next();
        res.headers.set("x-nonce", nonce);
        res.headers.set("Content-Security-Policy", csp);
        return res;
    }

    if (PUBLIC_INTERNAL_ROUTES.has(pathname)) {
        // Halaman login/sign adalah satu-satunya rute di bawah /internal
        // yang boleh diakses tanpa sesi. Tanpa pengecualian ini, middleware
        // akan mengarahkannya ke login-nya sendiri → ERR_TOO_MANY_REDIRECTS.
        const res = next();
        res.headers.set("x-nonce", nonce);
        res.headers.set("Content-Security-Policy", csp);
        return res;
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
        const res = NextResponse.redirect(loginUrl);
        // Redirect juga harus membawa nonce dan CSP, bukan hanya halaman HTML.
        res.headers.set("x-nonce", nonce);
        res.headers.set("Content-Security-Policy", csp);
        return res;
    }

    const res = next();
    res.headers.set("x-nonce", nonce);
    res.headers.set("Content-Security-Policy", csp);
    return res;
}

export const config = {
    // Middleware berjalan pada SEMUA rute non-aset, karena CSP nonce
    // diperlukan oleh setiap halaman yang terhidrasi. Pembagian:
    //   /internal/:path* → proteksi autentikasi + CSP nonce
    //   /api/:path*      → header cache private + CSP
    //   sisanya          → CUMA CSP nonce, tanpa cek autentikasi
    //     (rute publik: /, /about, /announcement, /sertifikat/[id], …)
    //
    // Pengecualian: aset statis & API tidak butuh nonce inline script.
    matcher: [
        "/internal/:path*",
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico|logo|sw.js|manifest|api|internal).*)",
    ],
};

