import { getAllEmployees } from "../../data/database.js";

import express from "express";
const employeesRouter = express.Router();

employeesRouter.get("/", async (req, res) => {
  const allEmployees = await getAllEmployees();
  res.send(allEmployees);
});

export default employeesRouter;
