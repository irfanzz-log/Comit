import { query } from "@/lib/db";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const body = await req.json();

        await query(
            `
            INSERT INTO certificates(
                id,
                template_id,
                certificate_number,
                participant_name,
                activity_name,
                activity_info,
                issue_date,
                signer_name,
                signer_position,
                qr_code
            )
            VALUES(
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )
            `,
            [
                randomUUID(),
                body.template_id,
                body.certificate_number,
                body.participant_name,
                body.activity_name,
                body.activity_info,
                body.issue_date,
                body.signer_name,
                body.signer_position,
                body.qr_code
            ]
        );

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        return NextResponse.json(
            {
                success: false,
                message: err.message
            },
            {
                status: 500
            }
        );

    }

}