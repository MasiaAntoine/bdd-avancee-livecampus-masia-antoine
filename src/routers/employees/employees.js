import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  salaryGap,
} from "../../data/queries/employeesQueries.js";

const router = express.Router();

router.get("/all/", async (req, res) => {
  const employees = await getAllEmployees();
  if (employees) {
    res.json(employees);
  } else {
    res.status(500).send("Erreur lors de la récupération des employés.");
  }
});

router.get("/recup/:id", async (req, res) => {
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

router.post("/create/", async (req, res) => {
  const { first_name, last_name, email, salary, service_id } = req.body;
  const newEmployee = await addEmployee(
    first_name,
    last_name,
    email,
    salary,
    service_id
  );
  if (newEmployee) {
    res.status(201).json(newEmployee);
  } else {
    res.status(500).send("Erreur lors de l'ajout de l'employé.");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const employeeId = req.params.id;
  const deletedEmployee = await deleteEmployee(employeeId);
  if (deletedEmployee) {
    res.json(deletedEmployee);
  } else {
    res.status(404).send("Employé non trouvé.");
  }
});

router.put("/edit/:id", async (req, res) => {
  const employeeId = req.params.id;
  const { first_name, last_name, email, salary, service_id } = req.body;
  const updatedEmployee = await updateEmployee(
    employeeId,
    first_name,
    last_name,
    email,
    salary,
    service_id
  );
  if (updatedEmployee) {
    res.json(updatedEmployee);
  } else {
    res.status(500).send("Erreur lors de la mise à jour de l'employé.");
  }
});

router.get("/salary-gap", async (req, res) => {
  const result = await salaryGap();
  if (result !== null) {
    res.json({ salary_gap: result });
  } else {
    res.status(500).send("Erreur lors de la récupération de l'écart salarial.");
  }
});

export default router;
