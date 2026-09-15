import { Resend } from "resend";
import { NextResponse } from "next/server";

// Simple text sanitizer to prevent HTML injection in email content
function sanitizeText(str) {
    if (typeof str !== "string") return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Basic email format check
function isValidEmail(email) {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "Semua field wajib diisi" }, { status: 400 });
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({ success: false, error: "Format email tidak valid" }, { status: 400 });
        }

        const nameValue = String(name).trim().slice(0, 100);
        const messageValue = String(message).trim().slice(0, 2000);

        if (!nameValue || !messageValue) {
            return NextResponse.json({ success: false, error: "Nama dan pesan tidak boleh kosong" }, { status: 400 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: "COMIT <onboarding@resend.dev>",
            to: "comit.unipi@gmail.com",
            reply_to: email,
            subject: `Pesan dari ${sanitizeText(nameValue)}`,
            html: `<p>Hallo saya ${sanitizeText(nameValue)}, Memiliki pesan untuk COMIT!</p><p>${sanitizeText(messageValue)}</p>`,
        });

        if (error) {
            console.error("Error sending email:", error);
            return NextResponse.json({ success: false, error: "Gagal mengirim email" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("POST /api/contact error:", error);
        return NextResponse.json({ success: false, error: "Gagal mengirim email" }, { status: 500 });
    }
}