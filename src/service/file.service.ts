import { eq } from "drizzle-orm";
import { db } from "../db";
import { files, InsertFileSchemaType, UpdateFileSchemaType } from "../models";

const fileService = {
  create: async (data: InsertFileSchemaType) => {
    return await db.insert(files).values(data).returning();
  },

  update: async (santriId: number, data: UpdateFileSchemaType) => {
    return await db.update(files).set(data).where(eq(files.santriId, santriId)).returning();
  },

  findOne: async (santriId: number) => {
    return (
      (await db.query.files.findFirst({
        where: eq(files.santriId, santriId),
      })) ?? null
    );
  },
};

export default fileService;
