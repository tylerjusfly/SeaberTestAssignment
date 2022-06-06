import request from "supertest";
import { app } from "../server";
import { IncomingPackets } from "../types";
import { checkTable } from "../helpers";

test("should return status 200 and Hello World", async () => {
  const result = await request(app).get("/").send();

  expect(result.status).toBe(200);
  expect(result.body).toEqual({ message: "hello world" });
});

test("Throw require all Fields error in integrated layer When orderId does not exist", async () => {
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

test("Throw require all Fields error in integrated layer When the type of Order does not exist", async () => {
  const data: IncomingPackets = {
    extOrderId: "bda73cd4-30a0-40e5-bd0b-2bc3c907be47",
    type: "",
    cargoAmount: 10,
    cargoType: "corn",
  };
  const response = await request(app).post("/integrate").send(data);

  expect(response.status).toBe(400);
  expect(typeof response.body).toBe("object");
  expect(response.body).toEqual({ message: "All Fields Are Required!" });
});

// Testing when orderId does not exist

test("Returning rows Of data with Id and OrderId and CargoType when Row Count Equals 0", async () => {
  const data: IncomingPackets = {
    extOrderId: "56we-are23-hell0",
    type: "cargo",
    cargoAmount: 10,
    cargoType: "corn",
  };
  const response = await request(app).post("/integrate").send(data);
  expect(response.status).toBe(200);
  expect(response.body[0].id).toBe("8");
  expect(response.body[0].orderid).toBe("56we-are23-hell0");
  expect(response.body[0].cargotype).toBe("corn");
  expect(response.body[0].tolocation).toBeNull;
  expect(response.body[0].fromlocation).toBeNull;
});

test("Return rows of data with orderId and To Location If rowCount Equals 0", async () => {
  const data: IncomingPackets = {
    extOrderId: "bda73cd4-0e5-bd0b-2bc3c907be47",
    type: "to",
    toLocation: "Kokkola",
  };

  const response = await request(app).post("/integrate").send(data);

  expect(response.body[0].orderid).toBe("bda73cd4-0e5-bd0b-2bc3c907be47");
  expect(response.body[0].tolocation).toBe("Kokkola");
  expect(response.body[0].cargotype).toBeNull;
  expect(response.body[0].cargoamount).toBeNull;
  expect(response.body[0].fromlocation).toBeNull;
});

// Testing when orderId Exist
test("Inserting Into column tolocation of NUll where rowcount Equals 1 and orderId exists", async () => {
  const data: IncomingPackets = {
    extOrderId: "56we-are23-hell0",
    type: "to",
    toLocation: "Russia",
  };

  const response = await request(app).post("/integrate").send(data);

  expect(response.status).toBe(200);
  expect(response.body[0].id).toBe("8");
  expect(response.body[0].orderid).toBe("56we-are23-hell0");
  expect(response.body[0].tolocation).toBe("Russia");
});

test("Inserting into column with cargoType of Null when Row Count Equals 1 and OrderId exists", async () => {
  const data: IncomingPackets = {
    extOrderId: "bda73cd4-0e5-bd0b-2bc3c907be47",
    type: "cargo",
    cargoAmount: 150,
    cargoType: "FigTrees",
  };
  const response = await request(app).post("/integrate").send(data);
  expect(response.status).toBe(200);
  expect(response.body[0].orderid).toBe("bda73cd4-0e5-bd0b-2bc3c907be47");
  expect(response.body[0].cargotype).toBe("FigTrees");
  expect(response.body[0].tolocation).toBe("Kokkola");
  expect(response.body[0].fromlocation).toBeNull;
});

test("check database table", async () => {
  let checkTableResult = checkTable(false, "");

  expect(checkTable).toBeDefined;
  expect(checkTableResult).toReturn();
});
