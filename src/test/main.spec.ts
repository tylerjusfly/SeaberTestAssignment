import request from "supertest";
import { app } from "../server";
import { IncomingPackets } from "../types";

test("should return status 200 and Hello World", async () => {
  const result = await request(app).get("/").send();

  expect(result.status).toBe(200);
  expect(result.body).toEqual({ message: "hello world" });
});

test("Require all Fields in integrated layer", async () => {
  const data: IncomingPackets = {
    extOrderId: "",
    type: "cargo",
    cargoAmount: 10,
    cargoType: "corn",
  };
  const response = await request(app).post("/integrate").send(data);

  expect(response.status).toBe(400);
  expect(typeof response.body).toBe("object");
  expect(response.body).toEqual({ message: "All Fields Are Required!" });
});

test("Returning rows Of data", async () => {
  const data: IncomingPackets = {
    extOrderId: "56we-are23-the000",
    type: "cargo",
    cargoAmount: 10,
    cargoType: "corn",
  };
  const response = await request(app).post("/integrate").send(data);
  expect(response.status).toBe(200);
  expect(response.body[0].orderid).toBe("56we-are23-the000");
  console.log(response.body[0]);
});
