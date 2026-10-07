import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { consumeRateLimit, resetRateLimit } from "@/lib/rateLimit";

// Ambang kegagalan per akun (NPM). Lebih rendah dari limit per-IP: user
// valid yang salah ketik tidak akan terkunci (resetRateLimit dipanggil
// setelah login berhasil), tapi penyerang yang menebar tebakan ke banyak
// IP untuk NPM yang sama akan terhenti di sini.
const MAX_FAILS_PER_NPM = 5;

export async function POST(req) {
    try {
        const { npm, password, remembered } = await req.json();

        // Validasi input sebelum menyentuh database
        if (typeof npm !== "string" || npm.trim() === "" || typeof password !== "string" || password === "") {
            return NextResponse.json({ error: "NPM atau password salah" }, { status: 401 });
        }

        // Rate limit per IP untuk membatasi brute-force password. Key hanya
        // IP (bukan NPM) — memakai NPM sebagai key membuat attacker bisa
        // mengunci akun user lain hanya dengan menebak passwordnya (DoS).
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
        const rateKey = `login:${ip}`;
        const rate = consumeRateLimit(rateKey);
        if (!rate.allowed) {
            return NextResponse.json(
                { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
                { status: 429 }
            );
        }

        // Pertahanan kedua: batasi kegagalan per NPM. Tanpa ini, penyerang
        // yang memakai banyak IP (rotating proxy / X-Forwarded-For palsu)
        // bisa menejak NPM yang sama tanpa batas efektif. Ambang lebih
        // rendah dari limit IP dan hanya mengunci sementara.
        const npmFailKey = `loginfail:${String(npm).trim()}`;
        const npmFail = consumeRateLimit(npmFailKey, MAX_FAILS_PER_NPM);
        if (!npmFail.allowed) {
            return NextResponse.json(
                { error: "Akun ini terlalu banyak percobaan gagal. Coba lagi nanti." },
                { status: 429 }
            );
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

        // Login berhasil: reset counter rate-limit IP ini agar user valid
        // tidak terpengaruh oleh tebakan gagal dari IP yang sama.
        resetRateLimit(rateKey);
        // Login berhasil — hapus juga penghitung kegagalan NPM agar user
        // yang sebelumnya salah ketik tidak terkunci setelah berhasil.
        resetRateLimit(npmFailKey);

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
