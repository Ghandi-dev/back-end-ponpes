import { and, count, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { InsertAdminSchemaType, admins, UpdateAdminSchemaType, InsertUserSchemaType, users } from "../models";
import { buildFilters } from "../utils/buildFilter";
import { encrypt } from "../utils/encryption";
import { ROLES } from "../utils/enum";

const adminsService = {
  createAdminWithUser: async (userData: Omit<InsertUserSchemaType, "id">, adminData: Omit<InsertAdminSchemaType, "id" | "userId">) => {
    return await db.transaction(async (tx) => {
      const hashedPassword = encrypt(userData.password);

      // 1. Insert ke tabel users
      const insertedUsers = await tx
        .insert(users)
        .values({
          ...userData,
          isActive: true,
          password: hashedPassword,
          role: ROLES.ADMIN,
        })
        .returning();

      const newUser = insertedUsers[0];

      // 2. Insert ke tabel admins dengan relasi userId
      const insertedAdmins = await tx
        .insert(admins)
        .values({
          ...adminData,
          userId: newUser.id,
        })
        .returning();

      return {
        user: newUser,
        admin: insertedAdmins[0],
      };
    });
  },

  update: async (id: number, data?: UpdateAdminSchemaType) => {
    return await db
      .update(admins)
      .set({ ...data })
      .where(eq(admins.id, id))
      .returning();
  },

  delete: async (id: number) => {
    return await db.transaction(async (tx) => {
      // Ambil userId yang terkait dengan admins
      const santriData = await tx.select({ userId: admins.userId }).from(admins).where(eq(admins.id, id)).limit(1);

      const userId = santriData[0]?.userId;

      // Hapus admins
      await tx.delete(admins).where(eq(admins.id, id));

      // Hapus user jika ada
      if (userId) {
        await tx.delete(users).where(eq(users.id, userId));
      }
    });
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
