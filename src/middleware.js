import { NextResponse } from "next/server";

export async function middleware(req) {
    if (req.nextUrl.pathname === "/internal/login" || req.nextUrl.pathname === "/internal/sign") {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/internal/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/internal/:path*"],
}
