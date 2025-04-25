import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/index";

import fs from "fs";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER } from "../utils/env";
const CA_CERTIFICATION = fs.readFileSync("ca.pem", "utf8");

const client = new Pool({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: {
    ca: CA_CERTIFICATION,
    rejectUnauthorized: true,
  },
});

export const db = drizzle(client, { schema });

const checkConnection = async () => {
  try {
    await client.query("SELECT 1"); // ✅ query test
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.log(DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_NAME, DATABASE_PASSWORD);

    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export { checkConnection };
