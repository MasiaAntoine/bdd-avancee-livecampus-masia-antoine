import { connexion } from "./database.js";

export const cleanUp = async () => {
  await connexion.query(`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      office_number INT
    );
  `);

  await connexion.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      salary NUMERIC(10, 2),
      service_id INT,
      CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services (id)
    );
  `);

  await connexion.query(`
    CREATE TABLE IF NOT EXISTS manage (
      service_id INT,
      employee_id INT,
      start_date DATE,
      PRIMARY KEY (service_id, employee_id),
      CONSTRAINT fk_manage_service FOREIGN KEY (service_id) REFERENCES services (id),
      CONSTRAINT fk_manage_employee FOREIGN KEY (employee_id) REFERENCES employees (id)
    );
  `);

  await connexion.query("DELETE FROM manage");
  await connexion.query("DELETE FROM employees");
  await connexion.query("DELETE FROM services");
};
