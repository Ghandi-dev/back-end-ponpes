import { db } from "../db";
import { santri, TypeUser, user, userLoginDTO } from "../models";
import { and, eq, sql, SQL } from "drizzle-orm";
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
          fullname,
          email,
          password: hashedPassword,
          role: ROLES.SANTRI,
          activationCode: activationCode,
        })
        .returning();

      // Insert ke tabel `santri`
      await tx.insert(santri).values({
        userId: res.id,
        status: STATUS_SANTRI.PENDING_REGISTRATION,
      });

      return res;
    } catch (error) {
      return error;
    }
  });
};

export const findMany = async () => {
  return await db.query.user.findMany({
    columns: {
      id: true,
      fullname: true,
      email: true,
      role: true,
    },
  });
};

export const getUserByIdentifier = async ({ id, email }: { id?: number; email?: string }) => {
  const filters: SQL[] = [];
  if (id) filters.push(eq(user.id, id));
  if (email) filters.push(eq(user.email, email));
  return db.query.user.findFirst({ where: and(...filters) });
};

export const userActivate = async (code: string) => {
  const data = await db.select().from(user).where(eq(user.activationCode, code)).limit(1);
  if (data.length === 0) {
    return null;
  }
  return db.update(user).set({ isActive: true }).where(eq(user.id, data[0].id)).returning();
};

export const updateUser = async (id: number, data: Partial<TypeUser>) => {
  return await db
    .update(user)
    .set({ ...data, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(user.id, id))
    .returning();
};
