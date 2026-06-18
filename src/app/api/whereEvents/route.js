import { query } from "@/lib/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get('uuid');

    try {
        const result = await query(
            `SELECT * FROM events WHERE uuid = $1`,
            [uuid]
        )
        return Response.json(result.rows);
    } catch(err) {
        console.error(err);
        return Response.json({ error : err}, {status : 500});
    }
}