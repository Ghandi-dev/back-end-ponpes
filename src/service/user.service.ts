import { db } from "../db";
import { santri, TypeSantri, TypeUser, user } from "../models";
import { and, count, eq, like, sql, SQL } from "drizzle-orm";
import { encrypt } from "../utils/encryption";
import { ROLES, STATUS_SANTRI } from "../utils/enum";

export const createUser = async (fullname: string, email: string, password: string) => {
  return await db.transaction(async (tx) => {
    try {
      const hashedPassword = encrypt(password);
      const activationCode = encrypt(email);

      // Insert ke tabel `user`
      const [res] = await tx
        .insert(user)
        .values({
          email,
          password: hashedPassword,
          role: ROLES.SANTRI,
          activationCode: activationCode,
        })
        .returning();

      // Insert ke tabel `santri`
      await tx.insert(santri).values({
        userId: res.id,
        fullname,
        status: STATUS_SANTRI.PENDING_REGISTRATION,
      });

      return res;
    } catch (error) {
      return error;
    }
  });
};

export const findManyUser = async (page: number = 1, limit: number = 10, search?: string) => {
  const totalCount = await db.select({ count: count() }).from(user);
  const totalPages = Math.ceil(totalCount[0].count / limit);
  const userList = await db
    .select()
    .from(user)
    .leftJoin(santri, eq(user.id, santri.userId))
    .where(search ? like(santri.fullname, `%${search}%`) : undefined)
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    data: userList,
    totalData: totalCount,
    totalPages: totalPages,
    currentPage: page,
  };
};

export const getUserByIdentifier = async ({ id, email, userId }: { id?: number; email?: string; userId?: number }) => {
  const filters: SQL[] = [];
  if (id) filters.push(eq(user.id, id));
  if (email) filters.push(eq(user.email, email));
  return db.query.user.findFirst({ where: and(...filters) });
};

export const getMe = async (id: number) => {
  return db.query.user.findFirst({
    where: eq(user.id, id),
    with: { santri: true },
    columns: { email: true, role: true, profilePicture: true },
  });
};

export const userActivate = async (code: string) => {
  const data = await db.select().from(user).where(eq(user.activationCode, code)).limit(1);
  if (data.length === 0) {
    return null;
  }
  return db.update(user).set({ isActive: true }).where(eq(user.id, data[0].id)).returning();
};

export const updateUser = async (id: number, data: Partial<TypeUser & TypeSantri>) => {
  return await db.transaction(async (tx) => {
    // Pisahkan data berdasarkan field yang valid untuk masing-masing tabel
    const { email, password, role, ...santriData } = data;

    // Update tabel user (jika ada data yang terkait user)
    if (email || password || role) {
      await tx.update(user).set({ email, password, role }).where(eq(user.id, id));
    }

    // Update tabel santri (jika ada data yang terkait santri)
    if (Object.keys(santriData).length > 0) {
      await tx.update(santri).set(santriData).where(eq(santri.userId, id));
    }

    return db.query.user.findFirst({
      where: eq(user.id, id),
      columns: { email: true, profilePicture: true },
      with: { santri: true },
    });
  });
};
