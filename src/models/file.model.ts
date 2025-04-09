import { integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { santri } from "./santri.model";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  santriId: integer("santri_id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  birthCertificate: text("birth_certificate").notNull(),
  familyCard: text("family_card").notNull(),
  educationCertificate: text("education_certificate").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

export const fileRelations = relations(files, ({ one }) => ({ santri: one(santri, { fields: [files.santriId], references: [santri.id] }) }));

// Zod schema for insert
export const insertFileSchema = createInsertSchema(files);

// Zod schema for select
export const selectFileSchema = createSelectSchema(files);
export const updateFileSchema = createUpdateSchema(files);

// Types
export type InsertFileSchemaType = typeof insertFileSchema._type;
export type SelectFileSchemaType = typeof selectFileSchema._type;
export type UpdateFileSchemaType = typeof updateFileSchema._type;
