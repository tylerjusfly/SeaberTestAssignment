import { Request, Response, NextFunction } from "express";
import { pool, checkTable } from "./database";
import { IncomingPackets } from "./types";
import { QueryResult } from "pg";

export const integrate = async (req: Request, res: Response, next: NextFunction) => {
  const jsonData: IncomingPackets = req.body;

  if (!jsonData.extOrderId || !jsonData.type) {
    return res.status(400).json({ message: "All Fields Are Required!" });
  }
  try {
    //checking if orderid exists
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

    // checking if table is complete
    checkTable(false, jsonData.extOrderId);

    // Getting updated/saved data to display
    const savedResult = await pool.query("SELECT * FROM orders WHERE orderid = $1", [jsonData.extOrderId]);

    return res.status(200).json(savedResult.rows);

    // Returning all fields if complete
  } catch (error) {
    next(error);
  }
};
