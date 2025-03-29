import { eq } from "drizzle-orm";
import { db } from "../db";
import { files, TypeFiles } from "../models";

export const createFile = async (data: TypeFiles) => {
  return await db.insert(files).values(data).returning();
};

export const updateFile = async (santriId: number, data: Partial<TypeFiles>) => {
  return await db.update(files).set(data).where(eq(files.santriId, santriId)).returning();
};

export const findOneFile = async (santriId: number) => {
  return await db.query.files.findFirst({ where: eq(files.santriId, santriId) });
};
