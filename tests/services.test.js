// @ts-nocheck
import request from "supertest";
import express from "express";
import servicesRouter from "../src/routers/services/services.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";
import { getServiceById } from "../src/data/queries/serviceQueries.js";

const app = express();
app.use(express.json());
app.use("/services", servicesRouter);

let serviceId;

beforeAll(async () => {
  await cleanUp();
});

beforeEach(async () => {
  await cleanUp();

  const serviceResult = await connexion.query(
    "INSERT INTO services (name, office_number) VALUES ($1, $2) RETURNING id",
    ["IT", 101]
  );
  serviceId = serviceResult.rows[0].id;

  await connexion.query(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES ($1, $2, $3, $4, $5)",
    ["John", "Doe", `john.doe${Date.now()}@example.com`, 50000, serviceId]
  );
});

afterAll(async () => {
  await closeConnection();
});

test("GET /services/all/ should return all services", async () => {
  const response = await request(app).get("/services/all/");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("GET /services/recup/:id should return service details for a given ID", async () => {
  const response = await request(app).get(`/services/recup/${serviceId}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: serviceId,
    name: "IT",
    office_number: 101,
  });
});

test("POST /services/create/ should add a new service", async () => {
  const response = await request(app).post("/services/create/").send({
    name: "HR",
    office_number: 102,
  });
  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    id: expect.any(Number),
    name: "HR",
    office_number: 102,
  });
});

test("DELETE /services/delete/:id should delete a service by ID", async () => {
  const serviceResult = await connexion.query(
    "INSERT INTO services (name, office_number) VALUES ($1, $2) RETURNING id",
    ["HR", 102]
  );
  const serviceToDeleteId = serviceResult.rows[0].id;

  const response = await request(app).delete(
    `/services/delete/${serviceToDeleteId}`
  );
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: serviceToDeleteId,
    name: "HR",
    office_number: 102,
  });
});

test("PUT /services/edit/:id should update a service's details", async () => {
  const response = await request(app).put(`/services/edit/${serviceId}`).send({
    name: "IT Support",
    office_number: 103,
  });
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: serviceId,
    name: "IT Support",
    office_number: 103,
  });
});

test("GET /services/employee-count-by-service should return the employee count by service", async () => {
  const response = await request(app).get(
    "/services/employee-count-by-service"
  );
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("GET /services/top-5-services-by-payroll should return the top 5 services by payroll", async () => {
  const response = await request(app).get(
    "/services/top-5-services-by-payroll"
  );
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});
