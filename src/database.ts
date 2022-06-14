import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
export let pool: Pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: 5432,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });
}
if (process.env.NODE_ENV === "test") {
  pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.TEST_DB,
    password: process.env.password,
    port: 5432,
  });
}

export async function clearDb() {
  await pool.query("TRUNCATE TABLE orders");
}
