import { db } from "../db";
import { user, userLoginDTO } from "../models";
import { and, eq, SQL } from "drizzle-orm";
import { encrypt } from "../utils/encryption";
import { ROLES } from "../utils/enum";

export const createUser = (fullname: string, email: string, password: string) => {
  const hashedPassword = encrypt(password);
  const activationCode = encrypt(email);
  return db.insert(user).values({ fullname, email, password: hashedPassword, role: ROLES.SANTRI, activationCode: activationCode }).returning();
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
