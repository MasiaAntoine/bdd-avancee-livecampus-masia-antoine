import express from "express";
import { getAllEmployees } from "../../data/queries/employeesQueries.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const employees = await getAllEmployees();
  if (employees) {
    res.json(employees);
  } else {
    res.status(500).send("Erreur lors de la récupération des employés.");
  }
});

export default router;
