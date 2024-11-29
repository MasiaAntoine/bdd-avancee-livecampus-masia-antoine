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
