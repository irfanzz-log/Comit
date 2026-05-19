import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "irfanzzs",
  password: "",
  database: "postgres",
  port: 5432,
});

export async function query(text, params = []) {
    const res = await pool.query(text, params);
    return res;
}