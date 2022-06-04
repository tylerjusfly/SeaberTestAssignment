import { Pool, Connection } from "pg";
import * as cron from "node-cron";
import dotenv from "dotenv";
import axios from "axios";
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

export function makeMockDb<TResult>(results: TResult): Pool {
  const db = {} as Pool;

  function query(sql: string, values?: unknown[]) {
    return [results, []];
  }
  // @ts-ignore
  db.query = query;

  return db;
}

export const deleteRecords = async () => {
  const allTablesDate = await pool.query("DELETE FROM orders WHERE updated_at <= NOW() - INTERVAL '5 day'");

  console.log("......Deleted all records that is 5 days and above ");
};

// Function to check if table is complete
export const checkTable = async (bool: Boolean, id: String) => {
  const allField = await pool.query(
    "SELECT * FROM orders WHERE (fromLocation, toLocation, cargoType, cargoAmount) IS NOT NULL AND ordersent = $1 AND orderid = $2",
    [bool, id],
  );

  // check if allField exists
  if (allField.rows.length > 0) {
    const response = await axios.post("http://localhost:5000/create", {
      data: allField.rows[0],
    });

    if (response.status === 201) {
      await pool.query("UPDATE orders SET ordersent = $1 where orderid = $2", [true, response.data]);
    } //return fields end
    else {
      console.log("order not successfully posted");
    }
  }
};

// running the Delete Records function by 4pm Every Friday and Tuesday
const Job = cron.schedule("0 16 * * friday,tuesday", () => {
  console.log("Deleting Records That is 5 days and Above");
  deleteRecords();
});
// Starting Job
Job.start();
