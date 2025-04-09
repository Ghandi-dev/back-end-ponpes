import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { santri } from "./santri.model";
import { z } from "zod";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const parents = pgTable("parent", {
  id: serial("id").primaryKey(),
  santriId: integer("santri)id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  phoneNumber: text("phone_number").notNull(),
  job: text("job").notNull(),
  income: integer("income").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

export const parentRelations = relations(parents, ({ one }) => ({
  santri: one(santri, { fields: [parents.santriId], references: [santri.id] }),
}));

// Zod schema for insert
export const insertParentSchema = createInsertSchema(parents);

// Zod schema for select
export const selectParentSchema = createSelectSchema(parents);
export const updateParentSchema = createUpdateSchema(parents);

// Types
export type InsertParentSchemaType = typeof insertParentSchema._type;
export type SelectParentSchemaType = typeof selectParentSchema._type;
export type UpdateParentSchemaType = typeof updateParentSchema._type;
