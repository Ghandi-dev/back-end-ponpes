import { and, eq, SQL } from "drizzle-orm";
import { db } from "../db";
import { payment, InsertPaymentSchemaType, SelectPaymentSchemaType, UpdatePaymentSchemaType } from "../models/payment.model";
import { buildFilters } from "../utils/bulildFilter";

const paymentService = {
  create: async (data: InsertPaymentSchemaType) => {
    return (await db.insert(payment).values(data).returning()).at(0);
  },

  findOne: async (query: Partial<SelectPaymentSchemaType>) => {
    const filters = buildFilters(query, {
      paymentId: payment.paymentId,
      santriId: payment.santriId,
      status: payment.status,
      type: payment.type,
    });

    return (
      (await db.query.payment.findFirst({
        where: and(...filters),
      })) ?? null
    );
  },

  findMany: async () => {
    // implementasi nanti
    return [];
  },

  update: async (paymentId: string, data: UpdatePaymentSchemaType) => {
    return (await db.update(payment).set(data).where(eq(payment.paymentId, paymentId)).returning()).at(0);
  },

  remove: async () => {
    // implementasi nanti
    return;
  },
};

export default paymentService;
