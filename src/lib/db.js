import { Pool } from "pg";

const pool = new Pool({
  host: "103.247.9.247",
  user: "comit",
  password: "fz$W9YNE6$WVFW",
  database: "comit_db",
  port: 5432,
});

export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}
