// @ts-nocheck
import pg from "pg";
import dotenv from "dotenv";

let isConnectionClosed = false;

const { Pool } = pg;
const envFile =
  process.env.NODE_ENV === "test"
    ? "./config/env/.env.test"
    : `./config/env/.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

export const connexion = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

export const closeConnection = async () => {
  if (connexion && !isConnectionClosed) {
    isConnectionClosed = true;
    return connexion.end();
  }
};
