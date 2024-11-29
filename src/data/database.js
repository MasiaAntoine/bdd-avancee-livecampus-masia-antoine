// @ts-nocheck
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config({ path: `./config/env/.env.${process.env.NODE_ENV}` });

// Création d'une connexion à la base de données PostgreSQL
export const connexion = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Fonction pour fermer la connexion
export const closeConnection = async () => {
  if (connexion) return connexion.end();
};

// Fonction pour obtenir tous les employés
export const getAllEmployees = async () => {
  try {
    const res = await connexion.query("SELECT * FROM employees");
    return res.rows;
  } catch (error) {
    console.log(error);
    return null;
  }
};
