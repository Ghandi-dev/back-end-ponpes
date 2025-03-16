import { pgTable, serial, text, varchar, boolean, timestamp, date, uniqueIndex } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { ROLES } from "../utils/enum";
import { z } from "zod";
import { santri } from "./santri.model";

export const user = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    fullname: text("fullname").notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: [ROLES.ADMIN, ROLES.SANTRI] })
      .default(ROLES.SANTRI)
      .notNull(),
    profilePicture: text("profile_picture").default("user.jpg"),
    isActive: boolean("is_active").default(false),
    activationCode: text("activation_code"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [uniqueIndex("idx_user_email").on(table.email)]
);

export type TypeUser = typeof user.$inferInsert;

export const userRealations = relations(user, ({ one }) => ({
  santri: one(santri),
}));

const validatePassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const userLoginDTO = z.object({
  email: z.string().min(1, "Identifier is required"),
  password: validatePassword,
});

export const userUpdatePasswordDTO = z
  .object({
    oldPassword: validatePassword,
    password: validatePassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Error ditampilkan pada confirmPassword
  });

export const userDTO = z
  .object({
    fullname: z.string().min(1, "Fullname is required"),
    email: z.string().email("Invalid email format"),
    password: validatePassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
