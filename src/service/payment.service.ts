import { and, count, eq, SQL } from "drizzle-orm";
import { db } from "../db";
import { payment, InsertPaymentSchemaType, SelectPaymentSchemaType, UpdatePaymentSchemaType } from "../models/payment.model";
import { buildFilters } from "../utils/buildFilter";
import { santri } from "../models";

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
        with: { santri: true },
      })) ?? null
    );
  },

  findMany: async (page = 1, limit = 10, where?: SQL<unknown>) => {
    const data = await db
      .select()
      .from(payment)
      .leftJoin(santri, eq(payment.santriId, santri.id)) // wajib join santri
      .where(where)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalCount = await db.select({ count: count() }).from(payment).leftJoin(santri, eq(payment.santriId, santri.id)).where(where);

    const merged = data.map(({ payment, santri }) => ({
      ...payment,
      santri,
    }));

    return {
      data: merged,
      totalData: totalCount[0].count,
      totalPages: Math.ceil(totalCount[0].count / limit),
      currentPage: page,
    };
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
