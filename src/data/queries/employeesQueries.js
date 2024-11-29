// @ts-nocheck
import { connexion } from "../database.js";

export const getAllEmployees = async () => {
  try {
    const res = await connexion.query("SELECT * FROM employees");
    return res.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEmployeeById = async (id) => {
  try {
    console.log(`Executing query to fetch employee with ID: ${id}`);
    const res = await connexion.query(
      `
      SELECT e.id, e.first_name, e.last_name, e.email, e.salary, s.name as service_name
      FROM employees e
      JOIN services s ON e.service_id = s.id
      WHERE e.id = $1
    `,
      [id]
    );
    console.log(`Query result: ${JSON.stringify(res.rows)}`);
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addEmployee = async (
  firstName,
  lastName,
  email,
  salary,
  serviceId
) => {
  try {
    const res = await connexion.query(
      `
      INSERT INTO employees (first_name, last_name, email, salary, service_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [firstName, lastName, email, salary, serviceId]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await connexion.query(
      `
      DELETE FROM employees
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateEmployee = async (
  id,
  firstName,
  lastName,
  email,
  salary,
  serviceId
) => {
  try {
    const res = await connexion.query(
      `
      UPDATE employees
      SET first_name = $1, last_name = $2, email = $3, salary = $4, service_id = $5
      WHERE id = $6
      RETURNING *
    `,
      [firstName, lastName, email, salary, serviceId, id]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
