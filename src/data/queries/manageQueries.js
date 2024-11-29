// @ts-nocheck
import { connexion } from "../database.js";

export const getManagerByServiceId = async (serviceId) => {
  try {
    const res = await connexion.query(
      `
      SELECT e.id, e.first_name, e.last_name, e.email, e.salary
      FROM employees e
      JOIN manage m ON e.id = m.employee_id
      WHERE m.service_id = $1
    `,
      [serviceId]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const listManagersAndServices = async () => {
  try {
    const res = await connexion.query(
      "SELECT * FROM list_managers_and_services()"
    );
    return res.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};
