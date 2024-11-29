// @ts-nocheck
import {
  getManagerByServiceId,
  listManagersAndServices,
} from "../src/data/queries/manageQueries.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";

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

test("should return manager details for a given service ID", async () => {
  const manager = await getManagerByServiceId(serviceId);
  expect(manager).toEqual({
    id: employeeId,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    salary: "50000.00",
  });
});

test("should list all managers and their services", async () => {
  const managers = await listManagersAndServices();
  expect(managers).not.toBeNull();
  expect(managers.length).toBeGreaterThan(0);
});
