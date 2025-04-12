import { and, count, eq, ilike, SQL } from "drizzle-orm";
import { db } from "../db";
import { InsertSantriSchemaType, santri, UpdateSantriSchemaType } from "../models";
import { SANTRI_STATUS } from "../utils/enum";
import { buildFilters } from "../utils/buildFilter";

const santriService = {
  create: async (data: InsertSantriSchemaType) => {
    return await db.insert(santri).values(data).returning();
  },

  update: async (id: number, data?: UpdateSantriSchemaType, status?: SANTRI_STATUS) => {
    return await db
      .update(santri)
      .set({ ...data, status })
      .where(eq(santri.id, id))
      .returning();
  },

  delete: async (id: number) => {
    return await db.delete(santri).where(eq(santri.id, id));
  },

  findOne: async (data: { id?: number; userId?: number }) => {
    const filters =
      buildFilters(data, {
        id: santri.id,
        userId: santri.userId,
      }) ?? null;

    return await db.query.santri.findFirst({ where: and(...filters) });
  },

  findMany: async (page = 1, limit = 10, where?: SQL<unknown> | undefined) => {
    const totalCount = await db.select({ count: count() }).from(santri).where(where);
    const totalPages = Math.ceil(totalCount[0].count / limit);
    const santriList = await db.query.santri.findMany({
      where: where,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: santriList,
      totalData: totalCount[0].count,
      totalPages,
      currentPage: page,
    };
  },
};

export default santriService;
