import { pgTable, serial, text, varchar, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";
import { santri } from "./santri.model";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

// Role Enum
export const USER_ROLES = {
  ADMIN: "admin",
  SANTRI: "santri",
} as const;

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: [USER_ROLES.ADMIN, USER_ROLES.SANTRI] })
      .default(USER_ROLES.SANTRI)
      .notNull(),
    profilePicture: text("profile_picture").default("https://res.cloudinary.com/diton4fcf/image/upload/v1742373868/avatar-1_ksjehz.svg"),
    isActive: boolean("is_active").default(false),
    activationCode: text("activation_code"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("idx_user_email").on(table.email)]
);

export const userRelations = relations(users, ({ one }) => ({
  santri: one(santri, { fields: [users.id], references: [santri.userId] }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = createUpdateSchema(users);

const validatePassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number");

// Zod schema for insert
export const registerUserSchema = createInsertSchema(users, {
  email: () => z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
  password: () => validatePassword,
  role: () => z.enum([USER_ROLES.ADMIN, USER_ROLES.SANTRI]).optional(),
})
  .extend({
    fullname: z.string().min(1, "Nama tidak boleh kosong"),
    confirmPassword: z.string().min(1, "Konfirmasi password tidak boleh kosong"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["passwordConfirm"],
    message: "Konfirmasi password tidak cocok",
  });

export const updatePasswordUserSchema = createUpdateSchema(users, {
  password: validatePassword,
})
  .extend({
    oldPassword: validatePassword,
    confirmPassword: validatePassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });

// Types
export type InsertUserSchemaType = typeof insertUserSchema._type;
export type SelectUserSchemaType = typeof selectUserSchema._type;
export type UpdateUserSchemaType = typeof updateUserSchema._type;
