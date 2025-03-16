import { pgTable, serial, integer, varchar, date, text, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./user.model"; // Pastikan path sesuai dengan file schema user
import { GENDERS, STATUS_SANTRI } from "../utils/enum";

export const santri = pgTable("santri", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
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
