// @ts-nocheck
import { connexion } from "../database.js";

export const getAllServices = async () => {
  try {
    const res = await connexion.query("SELECT * FROM services");
    return res.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getServiceById = async (id) => {
  try {
    const res = await connexion.query("SELECT * FROM services WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addService = async (name, officeNumber) => {
  try {
    const res = await connexion.query(
      "INSERT INTO services (name, office_number) VALUES ($1, $2) RETURNING *",
      [name, officeNumber]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteService = async (id) => {
  try {
    const res = await connexion.query(
      "DELETE FROM services WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateService = async (id, name, officeNumber) => {
  try {
    const res = await connexion.query(
      "UPDATE services SET name = $1, office_number = $2 WHERE id = $3 RETURNING *",
      [name, officeNumber, id]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
