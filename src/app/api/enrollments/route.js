import { query } from "@/lib/db";
import { NextResponse } from "next/server";


// ======================================================
// GET /api/enrollments
// ======================================================

export async function GET() {
    try {
        const result = await query(`
            SELECT
                id,
                nama,
                npm,
                no_telpon,
                jurusan,
                alasan,
                status,
                created_at,
                updated_at
            FROM enrollments
            ORDER BY created_at DESC
            LIMIT 10
        `);

        return Response.json({
            success: true,
            data: result.rows,
        });

    } catch (error) {
        console.error("GET enrollments error:", error);

        return Response.json(
            {
                success: false,
                message: "Gagal mengambil data pendaftaran",
            },
            {
                status: 500,
            }
        );
    }
}


// ======================================================
// POST /api/enrollments
// ======================================================

export async function POST(request) {
    try {

        const body = await request.json();

        console.log("POST ENROLLMENT BODY:", body);

        // Ambil sesuai dengan field dari sign/page.js
        const nama = body.nama;
        const npm = body.npm;
        const no_telpon = body.no_telpon;
        const jurusan = body.jurusan;
        const alasan = body.alasan;

        // ==================================================
        // VALIDASI
        // ==================================================

        if (
            nama === undefined ||
            npm === undefined ||
            no_telpon === undefined ||
            jurusan === undefined ||
            alasan === undefined
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Field tidak lengkap",
                },
                { status: 400 }
            );
        }

        // ==================================================
        // NORMALISASI
        // ==================================================

        const namaValue = String(nama).trim();
        const npmValue = String(npm).trim();
        const noTelponValue = String(no_telpon).trim();
        const jurusanValue = String(jurusan).trim();
        const alasanValue = String(alasan).trim();

        console.log("DATA SETELAH NORMALISASI:", {
            namaValue,
            npmValue,
            noTelponValue,
            jurusanValue,
            alasanValue,
        });

        // ==================================================
        // VALIDASI KOSONG
        // ==================================================

        if (
            namaValue === "" ||
            npmValue === "" ||
            noTelponValue === "" ||
            jurusanValue === "" ||
            alasanValue === ""
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Semua field wajib diisi",
                },
                { status: 400 }
            );
        }

        // ==================================================
        // CEK USER BERDASARKAN NPM
        // ==================================================

        const existingUser = await query(
            `
            SELECT id
            FROM users
            WHERE user_npm = $1
            LIMIT 1
            `,
            [npmValue]
        );

        if (existingUser.rows.length > 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "NPM tersebut sudah memiliki akun",
                },
                { status: 409 }
            );
        }

        // ==================================================
        // CEK PENDAFTARAN SEBELUMNYA
        // ==================================================

        const existingEnrollment = await query(
            `
            SELECT
                id,
                status
            FROM enrollments
            WHERE npm = $1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [npmValue]
        );

        if (existingEnrollment.rows.length > 0) {

            const existing = existingEnrollment.rows[0];

            // Masih pending
            if (existing.status === "pending") {

                return NextResponse.json(
                    {
                        success: false,
                        message: "NPM masih dalam proses pendaftaran",
                    },
                    { status: 409 }
                );
            }

            // Sudah diterima
            if (existing.status === "approved") {

                return NextResponse.json(
                    {
                        success: false,
                        message: "NPM tersebut sudah diterima",
                    },
                    { status: 409 }
                );
            }

            // rejected -> boleh daftar lagi
        }

        // ==================================================
        // INSERT
        // ==================================================

        const result = await query(
            `
            INSERT INTO enrollments
            (
                nama,
                npm,
                no_telpon,
                jurusan,
                alasan,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                'pending'
            )
            RETURNING
                id,
                nama,
                npm,
                no_telpon,
                jurusan,
                alasan,
                status,
                created_at,
                updated_at
            `,
            [
                namaValue,
                npmValue,
                noTelponValue,
                jurusanValue,
                alasanValue,
            ]
        );

        // ==================================================
        // SUCCESS
        // ==================================================

        return NextResponse.json(
            {
                success: true,
                message: "Pendaftaran berhasil dikirim",
                data: result.rows[0],
            },
            { status: 201 }
        );

    } catch (error) {

        console.error("POST enrollments error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal menyimpan pendaftaran",
                error: error.message,
            },
            { status: 500 }
        );
    }
}