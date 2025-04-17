import { and, count, eq, SQL } from "drizzle-orm";
import { db } from "../db";
import { InsertSantriSchemaType, santri, UpdateSantriSchemaType, users } from "../models";
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
    return await db.transaction(async (tx) => {
      // Ambil userId yang terkait dengan santri
      const santriData = await tx.select({ userId: santri.userId }).from(santri).where(eq(santri.id, id)).limit(1);

      const userId = santriData[0]?.userId;

      // Hapus santri
      await tx.delete(santri).where(eq(santri.id, id));

      // Hapus user jika ada
      if (userId) {
        await tx.delete(users).where(eq(users.id, userId));
      }
    });
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
