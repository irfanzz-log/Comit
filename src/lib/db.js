import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "comit_db",
  port: Number(process.env.PGPORT) || 5432,
});

export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}
