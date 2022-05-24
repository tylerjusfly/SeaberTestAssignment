import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { pool } from "./database";
import { IncomingPackets } from "./types";
import { QueryResult } from "pg";

export const integrate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jsonData: IncomingPackets = req.body;
  try {
    // checking if orderid exists
    // if (!jsonData.extOrderId || !jsonData.type) {
    //   throw new Error("All Fields Are Required!");
    // }
    // check if id exist
    let uid: QueryResult = await pool.query("SELECT * FROM orders WHERE orderid = $1", [jsonData.extOrderId]);

    //id does not exist
    if (uid.rowCount === 0 && jsonData.type == "cargo") {
      await pool.query("INSERT INTO orders(orderid, cargoType, cargoAmount)VALUES($1, $2, $3)", [
        jsonData.extOrderId,
        jsonData.cargoType,
        jsonData.cargoAmount,
      ]);
    }

    if (uid.rowCount === 0 && jsonData.type == "to") {
      await pool.query("INSERT INTO orders(orderid, toLocation )VALUES($1, $2)", [jsonData.extOrderId, jsonData.toLocation]);
    }
    if (uid.rowCount === 0 && jsonData.type == "from") {
      await pool.query("INSERT INTO orders(orderid, fromLocation )VALUES($1, $2)", [jsonData.extOrderId, jsonData.fromLocation]);
    }

    // if id exists
    if (uid.rowCount == 1 && jsonData.type == "to") {
      await pool.query("UPDATE orders SET toLocation = $1, updated_at = $2 WHERE orderid = $3 AND toLocation IS NULL", [
        jsonData.toLocation,
        "Now()",
        jsonData.extOrderId,
      ]);
    }
    if (uid.rowCount == 1 && jsonData.type == "from") {
      await pool.query("UPDATE orders SET fromLocation = $1, updated_at = $2 WHERE orderid = $3 AND fromLocation IS NULL", [
        jsonData.fromLocation,
        "Now()",
        jsonData.extOrderId,
      ]);
    }
    if (uid.rowCount == 1 && jsonData.type == "cargo") {
      await pool.query(
        "UPDATE orders SET cargoType = $1, cargoAmount = $2, updated_at = $3 WHERE orderid = $4 AND (cargoType, cargoAmount) IS NULL",
        [jsonData.cargoType, jsonData.cargoAmount, "Now()", jsonData.extOrderId],
      );
    }

    // Getting updated/saved data to display
    const savedResult = await pool.query("SELECT * FROM orders WHERE orderid = $1", [jsonData.extOrderId]);

    res.json(savedResult);

    // Returning all fields if complete
    const allField = await pool.query(
      "SELECT * FROM orders WHERE (fromLocation, toLocation, cargoType, cargoAmount) IS NOT NULL AND ordersent = $1 AND orderid = $2",
      [false, jsonData.extOrderId],
    );

    if (allField.rows.length > 0) {
      const response = await axios.post("https://seaber-task.herokuapp.com/create", {
        data: allField.rows[0],
      });
      if (response.status === 201) {
        await pool.query("UPDATE orders SET ordersent = $1 where orderid = $2", [true, response.data]);
      } //return fields end
    }
  } catch (error) {
    next(error);
  }
};
