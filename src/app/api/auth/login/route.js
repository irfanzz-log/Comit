import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { comparePassword } from "@/lib/hash";

export async function POST(req) {
    const { npm, password } = await req.json();

    //user
    const res = await query('SELECT id, user_npm, password, user_role FROM users WHERE user_npm = $1', [npm]);
    const user = res.rows[0];
    
    
    //check npm
    if (!user) {
      return Response.json({error : "NPM tidak ditemukan"}, {status: 401});
    }
        
    //check password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
        return Response.json({error : "Password salah"}, {status:401});
    }
    //generate token
    const token = signToken({
        id: user.id,
        npm: user.user_npm,
        role: user.user_role
    });

    const response = NextResponse.json({ success: true});
    response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
    });

    return response;
}
