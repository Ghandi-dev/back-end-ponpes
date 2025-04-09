import { pgTable, serial, integer, varchar, date, text, pgEnum, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./user.model"; // Pastikan path sesuai dengan file schema user
import { relations, sql } from "drizzle-orm";
import { z } from "zod";
import { address } from "./address.model";
import { payment } from "./payment.model";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { files } from "./file.model";
import { parents } from "./parent.model";

export enum GENDERS {
  MALE = "male",
  FEMALE = "female",
}

export enum SANTRI_STATUS {
  PENDING_REGISTRATION = "pending_registration",
  PROFILE_COMPLETED = "profile_completed",
  ADDRESS_COMPLETED = "address_completed",
  FILES_COMPLETED = "files_completed",
  PAYMENT_COMPLETED = "payment_completed",
  RE_REGISTERED = "re_registered",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const santri = pgTable(
  "santri",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    fullname: text("fullname").notNull(),
    placeOfBirth: varchar("place_of_birth", { length: 255 }),
    dateOfBirth: date("date_of_birth"),
    gender: text("gender", { enum: [GENDERS.MALE, GENDERS.FEMALE] }),
    schoolOrigin: varchar("school_origin", { length: 255 }),
    nisn: varchar("nisn", { length: 20 }),
    nik: varchar("nik", { length: 20 }),
    nationality: varchar("nationality", { length: 100 }),
    phoneNumber: varchar("phone_number", { length: 20 }),
    familyCardNumber: varchar("family_card_number", { length: 20 }),
    status: text("status", {
      enum: [
        SANTRI_STATUS.PENDING_REGISTRATION,
        SANTRI_STATUS.PROFILE_COMPLETED,
        SANTRI_STATUS.ADDRESS_COMPLETED,
        SANTRI_STATUS.FILES_COMPLETED,
        SANTRI_STATUS.PAYMENT_COMPLETED,
        SANTRI_STATUS.RE_REGISTERED,
        SANTRI_STATUS.ACTIVE,
        SANTRI_STATUS.INACTIVE,
      ],
    }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_fullname").on(table.fullname)]
);

export const santriRelations = relations(santri, ({ one, many }) => ({
  user: one(users, { fields: [santri.userId], references: [users.id] }),
  address: one(address, { fields: [santri.id], references: [address.santriId] }),
  files: one(files, { fields: [santri.id], references: [files.santriId] }),
  parent: one(parents, { fields: [santri.id], references: [parents.santriId] }),
  payment: many(payment),
}));

// Zod schema for insert
export const insertSantriSchema = createInsertSchema(santri);

// Zod schema for select
export const selectSantriSchema = createSelectSchema(santri);
export const updateSantriSchema = createUpdateSchema(santri);

// Types
export type InsertSantriSchemaType = typeof insertSantriSchema._type;
export type SelectSantriSchemaType = typeof selectSantriSchema._type;
export type UpdateSantriSchemaType = typeof updateSantriSchema._type;
