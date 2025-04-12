import { db } from "../db";
import { admins, InsertUserSchemaType, santri, UpdateSantriSchemaType, UpdateUserSchemaType, users } from "../models";
import { and, count, eq, like } from "drizzle-orm";
import { encrypt } from "../utils/encryption";
import { ROLES, SANTRI_STATUS } from "../utils/enum";
import { buildFilters } from "../utils/buildFilter";

const userService = {
  register: async (dataUser: InsertUserSchemaType, fullname: string) => {
    return await db.transaction(async (tx) => {
      const hashedPassword = encrypt(dataUser.password);
      const activationCode = encrypt(dataUser.email);

      const [user] = await tx
        .insert(users)
        .values({
          email: dataUser.email,
          password: hashedPassword,
          role: ROLES.SANTRI,
          activationCode,
        })
        .returning();

      await tx.insert(santri).values({
        userId: user.id,
        fullname,
        status: SANTRI_STATUS.PENDING_REGISTRATION,
      });

      return user;
    });
  },

  registerAdmin: async (dataUser: InsertUserSchemaType, fullname: string) => {
    return await db.transaction(async (tx) => {
      const hashedPassword = encrypt(dataUser.password);
      const activationCode = encrypt(dataUser.email);

      const [user] = await tx
        .insert(users)
        .values({
          email: dataUser.email,
          password: hashedPassword,
          role: ROLES.ADMIN,
          isActive: true,
          activationCode,
        })
        .returning();

      await tx.insert(admins).values({
        userId: user.id,
        fullname,
      });
      return user;
    });
  },

  create: async (data: InsertUserSchemaType) => {
    return (await db.insert(users).values(data).returning()).at(0);
  },

  findMany: async (page = 1, limit = 10, search?: string) => {
    const [{ count: totalData }] = await db.select({ count: count() }).from(users);
    const totalPages = Math.ceil(totalData / limit);

    const data =
      (await db
        .select()
        .from(users)
        .leftJoin(santri, eq(users.id, santri.userId))
        .where(search ? like(santri.fullname, `%${search}%`) : undefined)
        .limit(limit)
        .offset((page - 1) * limit)) ?? null;

    return {
      data,
      totalData,
      totalPages,
      currentPage: page,
    };
  },

  findOne: async (query: { id?: number; email?: string }) => {
    const filters =
      buildFilters(query, {
        id: users.id,
        email: users.email,
      }) ?? null;

    return await db.query.users.findFirst({ where: and(...filters) });
  },

  findMe: async (id: number, userRole: string) => {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        email: true,
        role: true,
        profilePicture: true,
      },
      with: userRole === ROLES.ADMIN ? { admin: true } : { santri: true },
    });
  },

  activate: async (code: string) => {
    const user = (await db.select().from(users).where(eq(users.activationCode, code)).limit(1)).at(0);
    if (!user) return null;
    return (await db.update(users).set({ isActive: true }).where(eq(users.id, user.id)).returning()).at(0);
  },

  update: async (id: number, data: UpdateUserSchemaType) => {
    return (await db.update(users).set(data).where(eq(users.id, id)).returning()).at(0);
  },
};

export default userService;
