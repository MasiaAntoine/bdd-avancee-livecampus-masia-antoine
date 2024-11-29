// @ts-nocheck
import {
  getAllServices,
  getServiceById,
  addService,
  deleteService,
  updateService,
  employeeCountByService,
  top5ServicesByPayroll,
} from "../src/data/queries/serviceQueries.js";
import { closeConnection, connexion } from "../src/data/database.js";
import { cleanUp } from "../src/data/dbCleanup.js";

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

test("getAllServices should return all services", async () => {
  const services = await getAllServices();
  expect(services.length).toBeGreaterThan(0);
});

test("getServiceById should return service details for a given ID", async () => {
  const service = await getServiceById(serviceId);
  expect(service).toEqual({
    id: serviceId,
    name: "IT",
    office_number: 101,
  });
});

test("addService should add a new service", async () => {
  const newService = await addService("HR", 102);
  expect(newService).toEqual({
    id: expect.any(Number),
    name: "HR",
    office_number: 102,
  });
});

test("deleteService should delete a service by ID", async () => {
  const serviceResult = await connexion.query(
    "INSERT INTO services (name, office_number) VALUES ($1, $2) RETURNING id",
    ["HR", 102]
  );
  const serviceToDeleteId = serviceResult.rows[0].id;

  const deletedService = await deleteService(serviceToDeleteId);
  expect(deletedService).toEqual({
    id: serviceToDeleteId,
    name: "HR",
    office_number: 102,
  });
});

test("updateService should update a service's details", async () => {
  const updatedService = await updateService(serviceId, "IT Support", 103);
  expect(updatedService).toEqual({
    id: serviceId,
    name: "IT Support",
    office_number: 103,
  });
});

test("employeeCountByService should return the employee count by service", async () => {
  const result = await employeeCountByService();
  expect(result.length).toBeGreaterThan(0);
});

test("top5ServicesByPayroll should return the top 5 services by payroll", async () => {
  const result = await top5ServicesByPayroll();
  expect(result.length).toBeGreaterThan(0);
});
