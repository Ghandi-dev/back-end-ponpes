import { integer, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";
import { santri } from "./santri.model";
import { relations } from "drizzle-orm";

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  userId: integer("santri_id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull(),
  address: text("address").notNull(),
  rt: text("rt").notNull(),
  rw: text("rw").notNull(),
  province: integer("province").notNull(),
  city: integer("city").notNull(),
  district: integer("district").notNull(),
  village: integer("village").notNull(),
  postalCode: numeric("postal_code").notNull(),
});

export type TypeAddress = typeof address.$inferSelect;

export const addressRelations = relations(address, ({ one }) => ({ santri: one(santri, { fields: [address.userId], references: [santri.id] }) }));
