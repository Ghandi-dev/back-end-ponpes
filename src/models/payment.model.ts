import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { santri } from "./santri.model";

export const payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  santriId: integer("santri)id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  status: text("status").notNull(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  paymentProof: text("payment_proof").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Payment = typeof payment.$inferSelect;

export const parentRelations = relations(payment, ({ one }) => ({
  santri: one(santri, { fields: [payment.santriId], references: [santri.id] }),
}));
