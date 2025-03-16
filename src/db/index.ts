import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../models/index";
import { DATABASE_URL } from "../utils/env";

const connectionString = DATABASE_URL || "";
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

const checkConnection = async () => {
  try {
    await client`SELECT 1`; // Coba query sederhana
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Hentikan aplikasi jika koneksi gagal
  }
};

export { checkConnection };
