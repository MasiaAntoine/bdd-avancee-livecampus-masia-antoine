// @ts-nocheck
import request from "supertest";
import express from "express";
import employeesRouter from "../src/routers/employees/employees.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";
import { getEmployeeById } from "../src/data/queries/employeesQueries.js";

const app = express();
app.use(express.json());
app.use("/employees", employeesRouter);

let serviceId;
let employeeId;

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

  const employeeResult = await connexion.query(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    ["John", "Doe", `john.doe${Date.now()}@example.com`, 50000, serviceId]
  );
  employeeId = employeeResult.rows[0].id;
});

afterAll(async () => {
  await closeConnection();
});

test("GET /employees/all/ should return all employees", async () => {
  const response = await request(app).get("/employees/all/");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("GET /employees/recup/:id should return employee details for a given ID", async () => {
  const response = await request(app).get(`/employees/recup/${employeeId}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    first_name: "John",
    last_name: "Doe",
    email: expect.stringContaining("john.doe"),
    salary: "50000.00",
    service_name: "IT",
  });
});

test("POST /employees/create/ should add a new employee", async () => {
  const response = await request(app)
    .post("/employees/create/")
    .send({
      first_name: "Jane",
      last_name: "Doe",
      email: `jane.doe${Date.now()}@example.com`,
      salary: 60000,
      service_id: serviceId,
    });
  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    id: expect.any(Number),
    first_name: "Jane",
    last_name: "Doe",
    email: expect.stringContaining("jane.doe"),
    salary: "60000.00",
    service_id: serviceId,
  });
});

test("DELETE /employees/delete/:id should delete an employee by ID", async () => {
  const response = await request(app).delete(`/employees/delete/${employeeId}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Doe",
    email: expect.stringContaining("john.doe"),
    salary: "50000.00",
    service_id: serviceId,
  });
});

test("PUT /employees/edit/:id should update an employee's details", async () => {
  const employee = await getEmployeeById(employeeId);
  expect(employee).not.toBeNull();

  const response = await request(app)
    .put(`/employees/edit/${employeeId}`)
    .send({
      first_name: "John",
      last_name: "Smith",
      email: `john.smith${Date.now()}@example.com`,
      salary: 55000,
      service_id: serviceId,
    });
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Smith",
    email: expect.stringContaining("john.smith"),
    salary: "55000.00",
    service_id: serviceId,
  });
});

test("GET /employees/salary-gap should return the salary gap", async () => {
  const response = await request(app).get("/employees/salary-gap");
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("salary_gap");
});
