import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    if (req.nextUrl.pathname === "/internal/login" || req.nextUrl.pathname === "/internal/sign") {
        return NextResponse.next();
   }

   if (!token) {
        console.log('tidak ada token');
        return NextResponse.redirect(new URL("/internal/login", req.url));
   }

    return NextResponse.next();
}

export const config = {
    matcher: ["/internal/:path*"],
}   