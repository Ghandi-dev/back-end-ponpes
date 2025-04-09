import { eq } from "drizzle-orm";
import { db } from "../db";
import { address, InsertAddressSchemaType, UpdateAddressSchemaType } from "../models";

const addressService = {
  create: async (data: InsertAddressSchemaType) => {
    return await db.insert(address).values(data).returning();
  },

  update: async (santriId: number, data: UpdateAddressSchemaType) => {
    return await db.update(address).set(data).where(eq(address.santriId, santriId)).returning();
  },

  findOne: async (santriId: number) => {
    return (
      (await db.query.address.findFirst({
        where: eq(address.santriId, santriId),
      })) ?? null
    );
  },

  delete: async (santriId: number) => {
    return await db.delete(address).where(eq(address.santriId, santriId));
  },
};

export default addressService;
