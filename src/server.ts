import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from "express";
import { Server } from "http";
import createError from "http-errors";
import { integrate } from "./integrated-layer";
import { seaberApi, getAllOrders } from "./seaberApi";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.post("/integrate", integrate);
app.post("/create", seaberApi);
app.get("/seaber/orders", getAllOrders);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
};
app.use(errorHandler);

const server: Server = app.listen(PORT, () => {
  console.log(`🔥 Server running on ${PORT}`);
});
