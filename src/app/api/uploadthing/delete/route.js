import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

const utapi = new UTApi();

export async function POST(req) {
    const unauthorized = requireRole(req);
    if (unauthorized) return unauthorized;

    try {
        const { fileKey } = await req.json();

        if (!fileKey || typeof fileKey !== "string" || fileKey.trim() === "") {
            return NextResponse.json({ success: false, error: "fileKey tidak valid" }, { status: 400 });
        }

        await utapi.deleteFiles(fileKey.trim());
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("POST /api/uploadthing/delete error:", error);
        return NextResponse.json({ success: false, error: "Gagal menghapus file" }, { status: 500 });
    }
}