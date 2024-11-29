// @ts-nocheck
import * as database from "./data/database.js";

import express from "express";

import employeesRouter from "./routers/employees/employees.js";

const app = express();

app.use(express.json());

app.use("/employees", employeesRouter);

app.get("/", (req, res) => {
  console.log(req);
  res.send();
});

app.listen(3000, async () => {
  console.log("le serveur lancé");
});
