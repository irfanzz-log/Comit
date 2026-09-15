import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireRole, getAuthPayload } from "@/lib/auth";

const VALID_STATUS = ["Hadir", "Izin", "Sakit", "Alpha"];

export async function POST(req) {
    const unauthorized = requireRole(req);
    if (unauthorized) return unauthorized;

    try {
        const body = await req.json();
        const { user_id, status_absen, keterangan, acara } = body;

        if (!user_id || !status_absen) {
            return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
        }

        if (!VALID_STATUS.includes(status_absen)) {
            return NextResponse.json({ message: "Status absen tidak valid" }, { status: 400 });
        }

        const userIdNum = parseInt(user_id, 10);
        if (isNaN(userIdNum)) {
            return NextResponse.json({ message: "User ID tidak valid" }, { status: 400 });
        }

        const keteranganValue = keterangan ? String(keterangan).trim().slice(0, 500) : null;
        const acaraValue = acara ? String(acara).trim().slice(0, 200) : null;

        const result = await query(
            "INSERT INTO attendance (user_id, status_absen, keterangan, acara, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id",
            [userIdNum, status_absen, keteranganValue, acaraValue]
        );

        return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
    } catch (error) {
        console.error("POST /api/insertAttendance error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}