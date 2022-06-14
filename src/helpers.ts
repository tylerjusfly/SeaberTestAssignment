import { pool } from "./database";
import axios from "axios";
import * as cron from "node-cron";
import { IOrder } from "./types";

export const deleteRecords = async () => {
  await pool.query("DELETE FROM orders WHERE updated_at <= NOW() - INTERVAL '5 day'");

  console.log("......Deleted all records that is 5 days and above ");
};

// Function to check if table is complete
export const checkTable = async (bool: Boolean, id: String): Promise<IOrder> => {
  const allField = await pool.query(
    "SELECT * FROM orders WHERE (fromLocation, toLocation, cargoType, cargoAmount) IS NOT NULL AND ordersent = $1 AND orderid = $2",
    [bool, id],
  );
  SEABER_API_SENDER(allField.rows[0]);
  return allField.rows[0];
};

// Send TO SEABER API FUNCTION
const SEABER_API_SENDER = async (result: IOrder) => {
  if (checkTable.length > 0) {
    const response = await axios.post("http://localhost:5000/create", {
      data: result,
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
