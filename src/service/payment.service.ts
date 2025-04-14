import { and, count, eq, SQL } from "drizzle-orm";
import { db } from "../db";
import {
  payment,
  InsertPaymentSchemaType,
  SelectPaymentSchemaType,
  UpdatePaymentSchemaType,
  TYPE_PAYMENT,
  STATUS_PAYMENT,
  selectPaymentSchema,
} from "../models/payment.model";

import { santri, SANTRI_STATUS } from "../models";
import { buildFilters } from "../utils/buildFilter";
import { getId } from "../utils/id";
import paymentUtils from "../utils/paymentUtils";

const paymentService = {
  create: async (data: InsertPaymentSchemaType) => {
    return (await db.insert(payment).values(data).returning()).at(0);
  },

  createSpp: async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Ambil semua santri
    const allSantri = await db.select().from(santri).where(eq(santri.status, SANTRI_STATUS.ACTIVE));

    for (const s of allSantri) {
      // Cek apakah sudah ada tagihan SPP untuk bulan ini
      const existing = await db.query.payment.findFirst({
        where: and(eq(payment.santriId, s.id), eq(payment.month, month), eq(payment.year, year), eq(payment.type, TYPE_PAYMENT.SPP)),
      });

      // Jika belum ada, buat tagihan
      if (!existing) {
        const paymentId = getId();

        const detail = await paymentUtils.createLink({
          transaction_details: {
            gross_amount: 500000, // nominal default, bisa dinamis
            order_id: paymentId,
          },
        });
        await db.insert(payment).values({
          santriId: s.id,
          paymentId: paymentId, // unik per santri & bulan
          amount: 500000, // nominal default, bisa dinamis
          type: TYPE_PAYMENT.SPP,
          status: STATUS_PAYMENT.PENDING,
          note: `Tagihan SPP bulan ${month} ${year}`,
          detail: detail,
          month,
          year,
        });
      }
    }

    console.log("✅ Tagihan SPP berhasil dibuat (jika belum ada) untuk semua santri.");
  },
  async checkIfSppExists(query: Partial<SelectPaymentSchemaType>) {
    const filters = buildFilters(query, {
      month: payment.month,
      year: payment.year,
      type: payment.type,
    });
    const result = await db.query.payment.findFirst({
      where: and(...filters),
    });

    return !!result; // Return true if the SPP bill already exists
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
