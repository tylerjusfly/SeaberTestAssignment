import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { pool } from "./database";
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
    // Getting updated/saved data to display
    const savedResult = await pool.query("SELECT * FROM orders WHERE orderid = $1", [jsonData.extOrderId]);

    return res.status(200).json(savedResult.rows);
  } catch (error) {
    next(error);
  }
};
