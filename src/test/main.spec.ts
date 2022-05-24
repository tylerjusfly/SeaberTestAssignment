import request from "supertest";
import { app } from "../server";

test("should return status 200 and Hello World", async () => {
  const result = await request(app).get("/").send();

  expect(result.status).toBe(200);
  expect(result.body).toEqual({ message: "hello world" });
});

test("Require all Fields in integrated layer", async () => {
  const jsonData = {
    orderid: "bda56cd2-40a0-50e5-bd0b-5br3c907ge47",
    type: "cargo",
    cargoamount: 10,
    cargotype: "corn",
  };
  const response = await request(app).post("/integrate").send(jsonData);

  expect(response.status).toBe(500);
  expect(typeof response.body).toBe("object");
  expect(response.body).toEqual({ status: 500, message: "All Fields Are Required!" });
  console.log(response.body);
});
