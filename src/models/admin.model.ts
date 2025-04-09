import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const admins = pgTable("admin", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  fullname: text("full_name").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

export const adminRelations = relations(admins, ({ one }) => ({
  user: one(users, { fields: [admins.id], references: [users.id] }),
}));

// Zod schema for insert
export const insertAdminSchema = createInsertSchema(admins);

// Zod schema for select
export const selectAdminSchema = createSelectSchema(admins);

// Zod schema for update
export const updateAdminSchema = createUpdateSchema(admins);

// Types
// Types
export type InsertAdminSchemaType = typeof insertAdminSchema._type;
export type SelectAdminSchemaType = typeof selectAdminSchema._type;
export type UpdateAdminSchemaType = typeof updateAdminSchema._type;
