// @ts-nocheck
import request from "supertest";
import express from "express";
import manageRouter from "../src/routers/manage/manage.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";

const app = express();
app.use(express.json());
app.use("/manage", manageRouter);

let serviceId;
let employeeId;

beforeAll(async () => {
  await cleanUp();

  const serviceResult = await connexion.query(
    "INSERT INTO services (name, office_number) VALUES ($1, $2) RETURNING id",
    ["IT", 101]
  );
  serviceId = serviceResult.rows[0].id;

  const employeeResult = await connexion.query(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    ["John", "Doe", "john.doe@example.com", 50000, serviceId]
  );
  employeeId = employeeResult.rows[0].id;

  await connexion.query(
    "INSERT INTO manage (service_id, employee_id, start_date) VALUES ($1, $2, $3)",
    [serviceId, employeeId, "2023-01-01"]
  );
});

afterAll(async () => {
  await closeConnection();
});

test("GET /manage/recup/:serviceId - should return manager details for a given service ID", async () => {
  const response = await request(app).get(`/manage/recup/${serviceId}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    salary: "50000.00",
  });
});

test("GET /manage/recup/:serviceId - should return 404 if manager not found", async () => {
  const response = await request(app).get("/manage/recup/999");
  expect(response.status).toBe(404);
  expect(response.text).toBe("Manager non trouvé.");
});

test("GET /manage/list-managers-and-services - should list all managers and their services", async () => {
  const response = await request(app).get("/manage/list-managers-and-services");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("GET /manage/list-managers-and-services - should return 500 if there is an error", async () => {
  await closeConnection();
  const response = await request(app).get("/manage/list-managers-and-services");
  expect(response.status).toBe(500);
  expect(response.text).toBe("Erreur lors de la récupération des données.");
});
