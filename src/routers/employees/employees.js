import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
} from "../../data/queries/employeesQueries.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const employees = await getAllEmployees();
  if (employees) {
    res.json(employees);
  } else {
    res.status(500).send("Erreur lors de la récupération des employés.");
  }
});

router.get("/:id", async (req, res) => {
  const employeeId = req.params.id;
  console.log(`Fetching employee with ID: ${employeeId}`);

  const employee = await getEmployeeById(employeeId);
  if (employee) {
    const { first_name, last_name, email, salary, service_name } = employee;
    res.json({ first_name, last_name, email, salary, service_name });
  } else {
    console.log(`Employee with ID: ${employeeId} not found.`);
    res.status(404).send("Employé non trouvé.");
  }
});

export default router;
