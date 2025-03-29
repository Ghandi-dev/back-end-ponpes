import { date, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { santri } from "./santri.model";

export const parent = pgTable("parent", {
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
});

export type Parent = typeof parent.$inferInsert;

export const parentRelations = relations(parent, ({ one }) => ({
  santri: one(santri, { fields: [parent.santriId], references: [santri.id] }),
}));
