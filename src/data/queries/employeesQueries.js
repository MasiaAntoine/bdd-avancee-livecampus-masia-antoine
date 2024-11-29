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
