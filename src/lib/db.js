import { Pool } from "pg";

const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "pg",
  database: "comit",
  port: 5432,
});

export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}