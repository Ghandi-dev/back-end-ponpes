import { integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { santri } from "./santri.model";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  santriId: integer("santri_id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  address: text("address").notNull(),
  rt: text("rt").notNull(),
  rw: text("rw").notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  village: text("village").notNull(),
  postalCode: text("postal_code").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

export const addressRelations = relations(address, ({ one }) => ({ santri: one(santri, { fields: [address.santriId], references: [santri.id] }) }));

// Zod schema for insert
export const insertAddressSchema = createInsertSchema(address);

// Zod schema for select
export const selectAddressSchema = createSelectSchema(address);
export const updateAddressSchema = createUpdateSchema(address);

// Types
export type InsertAddressSchemaType = typeof insertAddressSchema._type;
export type SelectAddressSchemaType = typeof selectAddressSchema._type;
export type UpdateAddressSchemaType = typeof updateAddressSchema._type;
