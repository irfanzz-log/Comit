import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req) {
    const unauthorized = requireRole(req, ["developer", "superadmin", "sekretaris"]);
    if (unauthorized) return unauthorized;

    try {
        const body = await req.json();

        const {
            template_id,
            certificate_number,
            participant_name,
            activity_name,
            activity_info,
            issue_date,
            signer_name,
            signer_position,
            qr_code,
        } = body;

        if (!template_id || !certificate_number || !participant_name || !activity_name || !issue_date) {
            return NextResponse.json(
                { success: false, message: "Data tidak lengkap" },
                { status: 400 }
            );
        }

        await query(
            `INSERT INTO certificates(
                id, template_id, certificate_number, participant_name,
                activity_name, activity_info, issue_date,
                signer_name, signer_position, qr_code
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [
                randomUUID(),
                template_id,
                String(certificate_number).trim().slice(0, 100),
                String(participant_name).trim().slice(0, 200),
                String(activity_name).trim().slice(0, 200),
                activity_info ? String(activity_info).trim().slice(0, 500) : null,
                issue_date,
                signer_name ? String(signer_name).trim().slice(0, 200) : null,
                signer_position ? String(signer_position).trim().slice(0, 200) : null,
                qr_code ? String(qr_code).trim().slice(0, 500) : null,
            ]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("POST /api/certificates error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menyimpan sertifikat" },
            { status: 500 }
        );
    }
}