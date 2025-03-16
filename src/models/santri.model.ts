import { pgTable, serial, integer, varchar, date, text, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./user.model"; // Pastikan path sesuai dengan file schema user
import { GENDERS } from "../utils/enum";

// Enum untuk gender
export const genderEnum = pgEnum("gender", [GENDERS.MALE, GENDERS.FEMALE]);

// Enum untuk status santri
export const statusEnum = pgEnum("santri_status", ["active", "inactive", "graduated"]);

export const santri = pgTable("santri", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull(),
  schoolOrigin: varchar("school_origin", { length: 255 }).notNull(),
  nisn: varchar("nisn", { length: 20 }).notNull(),
  nik: varchar("nik", { length: 20 }).notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  familyCardNumber: varchar("family_card_number", { length: 20 }).notNull(),
  status: statusEnum("status").notNull(),
});
