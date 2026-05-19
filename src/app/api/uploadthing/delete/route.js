import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

const utapi = new UTApi();

export async function POST(req) {
    const { fileKey } = await req.json();

    try {
        await utapi.deleteFiles(fileKey);
        return NextResponse.json({succes: true}, {status: 200});
    } catch (error) {
        return NextResponse.json({succes: false, error: error.message }, {status: 500});
    }
    
}