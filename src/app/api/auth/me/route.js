import { verifyToken } from "@/lib/jwt";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if(!token) {
        return NextResponse.json({ error : "Token tidak ditemukan"}, {status: 401});
    }

    try {
        const payload = verifyToken(token);
        const res = await query('SELECT u.id, u.user_npm, password, u.user_role, ui.nama FROM users u JOIN users_info ui ON u.id = ui.user_id WHERE u.user_npm = $1', [payload.npm]);
        const user = res.rows[0];
        
        

        if (!user) {
            return NextResponse.json({ error : "From auth/me: User not found"}, {status: 401});
        }
        return NextResponse.json({user}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error : "Invalid token"}, {status: 401});
    }
}