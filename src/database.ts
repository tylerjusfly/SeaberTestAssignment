import { Pool } from "pg";
import * as cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: 5432,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

export const deleteRecords = async () => {
  const allTablesDate = await pool.query("DELETE FROM orders WHERE updated_at <= NOW() - INTERVAL '5 day'");

  console.log("......Deleted all records that is 5 days and above ");
};

// running the Delete Records function by 4pm Every Friday and Tuesday
const Job = cron.schedule("0 16 * * friday,tuesday", () => {
  console.log("Deleting Records That is 5 days and Above");
  deleteRecords();
});
// Starting Job
Job.start();
