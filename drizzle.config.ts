import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/index.ts",
  dialect: "postgresql",
  schemaFilter: "public",
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      ca: process.env.CA_CERTIFICATE,
      rejectUnauthorized: true,
    },
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "my-migrations-table",
    schema: "public",
  },
});
