import { integer, numeric, pgTable, serial, text } from "drizzle-orm/pg-core";
import { santri } from "./santri.model";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  santriId: integer("santri_id")
    .references(() => santri.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  birthCertificate: text("birth_certificate").notNull(),
  familyCard: text("family_card").notNull(),
  educationCertificate: text("education_certificate").notNull(),
});

export type TypeFiles = typeof files.$inferInsert;

export const fileRelations = relations(files, ({ one }) => ({ santri: one(santri, { fields: [files.santriId], references: [santri.id] }) }));

export const fileDTO = z.object({
  birthCertificate: z.string().url().optional(),
  familyCard: z.string().url().optional(),
  educationCertificate: z.string().url().optional(),
});
