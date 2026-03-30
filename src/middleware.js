import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    if (req.nextUrl.pathname === "/internal/login" || req.nextUrl.pathname === "/internal/sign") {
        return NextResponse.next();
   }

   if (!token) {
        return NextResponse.redirect(new URL("/internal/login", req.url));
   }

   try {
    verifyToken(token);
    return NextResponse.next();
   } catch (error) {
    return NextResponse.redirect(new URL("/internal/login", req.url));
   }
}

export const config = {
    matcher: ["/internal/:path*"],
}   