import { and, count, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { InsertAdminSchemaType, admins, UpdateAdminSchemaType } from "../models";
import { buildFilters } from "../utils/buildFilter";

const adminsService = {
  create: async (data: InsertAdminSchemaType) => {
    return await db.insert(admins).values(data).returning();
  },

  update: async (id: number, data?: UpdateAdminSchemaType) => {
    return await db
      .update(admins)
      .set({ ...data })
      .where(eq(admins.id, id))
      .returning();
  },

  delete: async (id: number) => {
    return await db.delete(admins).where(eq(admins.id, id));
  },

  findOne: async (data: { id?: number; userId?: number }) => {
    const filters =
      buildFilters(data, {
        id: admins.id,
        userId: admins.userId,
      }) ?? null;

    return await db.query.admins.findFirst({ where: and(...filters) });
  },

  findMany: async (page = 1, limit = 10, search?: string) => {
    const totalCount = await db.select({ count: count() }).from(admins);
    const totalPages = Math.ceil(totalCount[0].count / limit);
    const adminsList = await db.query.admins.findMany({
      where: search ? ilike(admins.fullname, `%${search}%`) : undefined,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: adminsList,
      totalData: totalCount[0].count,
      totalPages,
      currentPage: page,
    };
  },
};

export default adminsService;
