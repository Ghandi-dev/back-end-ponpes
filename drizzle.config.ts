import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/index.ts",
  dialect: "postgresql",
  schemaFilter: "public",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
