import { count, eq, like } from "drizzle-orm";
import { db } from "../db";
import { santri, TypeSantri } from "../models";

export const updateSantri = async (id: number, data: Partial<TypeSantri>) => {
  return await db.update(santri).set(data).where(eq(santri.id, id)).returning();
};

export const findOneSantri = async (id: number) => {
  return await db.query.santri.findFirst({
    where: eq(santri.id, id),
  });
};

export const findManySantri = async (page: number = 1, limit: number = 10, search?: string) => {
  const totalCount = await db.select({ count: count() }).from(santri);
  const totalPages = Math.ceil(totalCount[0].count / limit);
  const santriList = await db.query.santri.findMany({
    where: search ? like(santri.fullname, `%${search}%`) : undefined,
    limit: limit,
    offset: (page - 1) * limit,
  });

  return {
    data: santriList,
    totalData: totalCount[0].count,
    totalPages: totalPages,
    currentPage: page,
  };
};

export const deleteSantri = async (id: number) => {
  return await db.delete(santri).where(eq(santri.id, id));
};

export const createSantri = async (data: TypeSantri) => {
  return await db.insert(santri).values(data).returning();
};
