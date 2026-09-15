import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded?.id) {
            return NextResponse.json(
                { error: "Token tidak valid" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            name,
            phone,
            prodi,
            minat,
        } = body;


        // ==========================================
        // Ambil data user
        // ==========================================

        const result = await query(
            `
            SELECT
                u.id,
                u.user_npm,
                u.user_role,
                ui.nama,
                ui.jurusan,
                ui.minat,
                ui.no_telpon
            FROM users u
            LEFT JOIN users_info ui
                ON u.id = ui.user_id
            WHERE u.id = $1
            `,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User tidak ditemukan",
                },
                { status: 404 }
            );
        }

        const currentUser = result.rows[0];


        // ==========================================
        // Data baru
        // ==========================================

        const MAX_FIELD_LENGTH = 100;

        const capLength = (value) =>
            value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value;

        const newName =
            name !== undefined
                ? capLength(String(name).trim())
                : currentUser.nama;

        const newPhone =
            phone !== undefined
                ? capLength(String(phone).trim())
                : currentUser.no_telpon;

        const newProdi =
            prodi !== undefined
                ? capLength(String(prodi).trim())
                : currentUser.jurusan;

        const newMinat =
            minat !== undefined
                ? capLength(String(minat).trim())
                : currentUser.minat;


        // ==========================================
        // Update users_info
        // ==========================================

        await query(
            `
            UPDATE users_info
            SET
                nama = $1,
                no_telpon = $2,
                jurusan = $3,
                minat = $4
            WHERE user_id = $5
            `,
            [
                newName,
                newPhone,
                newProdi,
                newMinat,
                decoded.id,
            ]
        );


        // ==========================================
        // Response
        // ==========================================

        return NextResponse.json(
            {
                success: true,
                message: "Profile berhasil diperbarui",

                user: {
                    id: decoded.id,
                    name: newName,
                    phone: newPhone,
                    prodi: newProdi,
                    minat: newMinat,
                },
            },
            { status: 200 }
        );

    } catch (error) {

        console.error(
            "PUT /api/users/profile error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to update profile",
            },
            { status: 500 }
        );
    }
}