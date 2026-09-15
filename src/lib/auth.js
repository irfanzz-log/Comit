import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const STAFF_ROLES = ["developer", "superadmin", "sekretaris", "staff", "bendahara"];

// Returns the JWT payload if the request carries a valid token cookie, else null.
export function getAuthPayload(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

// Returns a 401 NextResponse if not authenticated, else null.
export function requireAuth(req) {
    const payload = getAuthPayload(req);
    if (!payload) {
        return NextResponse.json(
            { success: false, error: "Tidak terautentikasi" },
            { status: 401 }
        );
    }
    return null;
}

// Returns a 401/403 NextResponse if not authenticated / not allowed, else null.
export function requireRole(req, roles = STAFF_ROLES) {
    const payload = getAuthPayload(req);
    if (!payload) {
        return NextResponse.json(
            { success: false, error: "Tidak terautentikasi" },
            { status: 401 }
        );
    }
    if (!roles.includes(payload.role)) {
        return NextResponse.json(
            { success: false, error: "Tidak memiliki akses" },
            { status: 403 }
        );
    }
    return null;
}
