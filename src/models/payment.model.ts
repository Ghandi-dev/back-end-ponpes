import { integer, json, pgEnum, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { santri } from "./santri.model";
import { TypeResponseMidtrans } from "../utils/paymentUtils";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export enum STATUS_PAYMENT {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export enum TYPE_PAYMENT {
  REGISTRATION = "registration",
  SPP = "spp",
}

export const payment = pgTable(
  "payment",
  {
    id: serial("id").primaryKey(),
    santriId: integer("santri_id")
      .references(() => santri.id, { onDelete: "cascade" })
      .notNull(),
    paymentId: text("payment_id").notNull().unique(),
    status: text("status", {
      enum: [STATUS_PAYMENT.PENDING, STATUS_PAYMENT.COMPLETED, STATUS_PAYMENT.CANCELED],
    }).default(STATUS_PAYMENT.PENDING),
    amount: integer("amount").notNull(),
    type: text("type", {
      enum: [TYPE_PAYMENT.REGISTRATION, TYPE_PAYMENT.SPP],
    }),
    note: text("note"),
    detail: json().$type<TypeResponseMidtrans>(),
    month: integer("month")
      .notNull()
      .$default(() => new Date().getMonth() + 1),
    year: integer("year")
      .notNull()
      .$default(() => new Date().getFullYear()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_payment_payment_id").on(table.paymentId),
    uniqueIndex("idx_payment_unique").on(table.santriId, table.month, table.year, table.type),
  ]
);

export const paymentRelations = relations(payment, ({ one }) => ({
  santri: one(santri, { fields: [payment.santriId], references: [santri.id] }),
}));

// Zod schema for insert
export const insertPaymentSchema = createInsertSchema(payment);

// Zod schema for select
export const selectPaymentSchema = createSelectSchema(payment);
export const updatePaymentSchema = createUpdateSchema(payment);

// Types
export type InsertPaymentSchemaType = typeof insertPaymentSchema._type;
export type SelectPaymentSchemaType = typeof selectPaymentSchema._type;
export type UpdatePaymentSchemaType = typeof updatePaymentSchema._type;
