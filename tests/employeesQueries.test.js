// @ts-nocheck
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  salaryGap,
} from "../src/data/queries/employeesQueries.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";

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

test("getAllEmployees should return all employees", async () => {
  const employees = await getAllEmployees();
  expect(employees.length).toBeGreaterThan(0);
});

test("getEmployeeById should return employee details for a given ID", async () => {
  const employee = await getEmployeeById(employeeId);
  expect(employee).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Doe",
    email: expect.stringContaining("john.doe"),
    salary: "50000.00",
    service_name: "IT",
  });
});

test("addEmployee should add a new employee", async () => {
  const newEmployee = await addEmployee(
    "Jane",
    "Doe",
    `jane.doe${Date.now()}@example.com`,
    60000,
    serviceId
  );
  expect(newEmployee).toEqual({
    id: expect.any(Number),
    first_name: "Jane",
    last_name: "Doe",
    email: expect.stringContaining("jane.doe"),
    salary: "60000.00",
    service_id: serviceId,
  });
});

test("deleteEmployee should delete an employee by ID", async () => {
  const deletedEmployee = await deleteEmployee(employeeId);
  expect(deletedEmployee).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Doe",
    email: expect.stringContaining("john.doe"),
    salary: "50000.00",
    service_id: serviceId,
  });
});

test("updateEmployee should update an employee's details", async () => {
  const employee = await getEmployeeById(employeeId);
  expect(employee).not.toBeNull();

  const updatedEmployee = await updateEmployee(
    employeeId,
    "John",
    "Smith",
    `john.smith${Date.now()}@example.com`,
    55000,
    serviceId
  );
  expect(updatedEmployee).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Smith",
    email: expect.stringContaining("john.smith"),
    salary: "55000.00",
    service_id: serviceId,
  });
});

test("salaryGap should return the salary gap", async () => {
  const gap = await salaryGap();
  expect(gap).toBeDefined();
});
