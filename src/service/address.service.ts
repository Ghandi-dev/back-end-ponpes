import { eq } from "drizzle-orm";
import { db } from "../db";
import { address, TypeAddress } from "../models";

export const createAddress = async (data: TypeAddress) => {
  return await db.insert(address).values(data).returning();
};

export const updateAddress = async (santriId: number, data: Partial<TypeAddress>) => {
  return await db.update(address).set(data).where(eq(address.santriId, santriId)).returning();
};

export const findOneAddress = async (santriId: number) => {
  return await db.query.address.findFirst({ where: eq(address.santriId, santriId) });
};

export const removeAddress = async (santriId: number) => {
  return await db.delete(address).where(eq(address.santriId, santriId));
};
