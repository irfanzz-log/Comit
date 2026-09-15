import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { comparePassword } from "@/lib/hash";

export async function POST(req) {
    try {
        const { npm, password, remembered } = await req.json();

        // Validasi input sebelum menyentuh database
        if (typeof npm !== "string" || npm.trim() === "" || typeof password !== "string" || password === "") {
            return NextResponse.json({ error: "NPM atau password salah" }, { status: 401 });
        }

        //user
        const res = await query('SELECT id, user_npm, password, user_role FROM users WHERE user_npm = $1', [npm]);
        const user = res.rows[0];

        //check npm (pesan generik agar tidak membocorkan keberadaan akun)
        if (!user) {
            return NextResponse.json({ error: "NPM atau password salah" }, { status: 401 });
        }

        //check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "NPM atau password salah" }, { status: 401 });
        }

        //generate token
        const token = signToken({
            id: user.id,
            npm: user.user_npm,
            role: user.user_role,
        }, {
            expiresIn: remembered ? '30d' : '1d'
        });

        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: remembered ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return response;
    } catch (error) {
        console.error("POST /api/auth/login error:", error);
        return NextResponse.json({ error: "Login gagal" }, { status: 500 });
    }
}
