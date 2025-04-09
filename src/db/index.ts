import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/index";
import { DATABASE_URL } from "../utils/env";

const connectionString = DATABASE_URL || "";
const client = new Pool({
  connectionString,
});

export const db = drizzle(client, { schema });

const checkConnection = async () => {
  try {
    await client.query("SELECT 1"); // ✅ query test
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export { checkConnection };
