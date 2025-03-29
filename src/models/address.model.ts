import { integer, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";
import { santri } from "./santri.model";
import { relations } from "drizzle-orm";

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
});

export type TypeAddress = typeof address.$inferInsert;

export const addressRelations = relations(address, ({ one }) => ({ santri: one(santri, { fields: [address.santriId], references: [santri.id] }) }));
