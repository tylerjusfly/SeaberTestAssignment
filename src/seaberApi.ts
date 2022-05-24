import express, { Request, Response, NextFunction } from "express";
import { pool } from "./database";
import { IOrder } from "./types";

export const seaberApi = async (req: Request, res: Response, next: NextFunction) => {
  const { orderid, tolocation, fromlocation, cargotype, cargoamount }: IOrder = req.body.data;

  if (!orderid || !tolocation || !fromlocation || !cargotype || !cargoamount) {
    console.log({ message: "missing Fields" });
    res.status(400).json({ message: "missing Fields" });
  }

  try {
    const newOrder = await pool.query(
      "INSERT INTO seaberorder(orderid, tolocation, fromlocation, cargotype, cargoamount)VALUES($1, $2, $3, $4, $5)",

      [orderid, tolocation, fromlocation, cargotype, cargoamount],
    );
    res.status(201).json(orderid);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allOrders = await pool.query("SELECT * FROM seaberorder");
    return res.json(allOrders.rows);
  } catch (error) {
    next(error);
  }
};
