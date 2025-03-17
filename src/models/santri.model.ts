import { pgTable, serial, integer, varchar, date, text, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./user.model"; // Pastikan path sesuai dengan file schema user
import { GENDERS, STATUS_SANTRI } from "../utils/enum";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const santri = pgTable("santri", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
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
      STATUS_SANTRI.PENDING_REGISTRATION,
      STATUS_SANTRI.COMPLETED_PROFILE,
      STATUS_SANTRI.PAYMENT_PENDING,
      STATUS_SANTRI.PAYMENT_CONFIRMED,
      STATUS_SANTRI.RE_REGISTRATION_PENDING,
      STATUS_SANTRI.RE_REGISTERED,
      STATUS_SANTRI.ACTIVE_SANTRI,
      STATUS_SANTRI.INACTIVE,
    ],
  }).notNull(),
});

export type TypeSantri = typeof santri.$inferSelect;

export const santriRelations = relations(santri, ({ one }) => ({ user: one(user, { fields: [santri.userId], references: [user.id] }) }));

export const santriDTO = z.object({
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]),
  schoolOrigin: z.string().min(1, "School origin is required"),
  nisn: z.string().min(1, "NISN is required"),
  nik: z.string().min(1, "NIK is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  familyCardNumber: z.string().min(1, "Family card number is required"),
});

export const santriUpdateDTO = z.object({
  fullname: z.string().optional(),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE]).optional(),
  schoolOrigin: z.string().optional(),
  nisn: z.string().optional(),
  nik: z.string().optional(),
  nationality: z.string().optional(),
  phoneNumber: z.string().optional(),
  familyCardNumber: z.string().optional(),
});
