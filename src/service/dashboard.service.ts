import { and, count, eq, sql, sum } from "drizzle-orm";
import { db } from "../db";
import { payment, santri, SANTRI_STATUS, TYPE_PAYMENT } from "../models";

const dashboardService = {
  async getDashboardSummaryAdmin() {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 9;

    const [{ count: totalSantri }] = await db.select({ count: count() }).from(santri).where(eq(santri.status, SANTRI_STATUS.ACTIVE));

    const [{ sum: totalRegistrasi }] = await db
      .select({ sum: sum(payment.amount).as("sum") })
      .from(payment)
      .where(eq(payment.type, TYPE_PAYMENT.REGISTRATION));

    const [{ sum: totalSPP }] = await db
      .select({ sum: sum(payment.amount).as("sum") })
      .from(payment)
      .where(eq(payment.type, TYPE_PAYMENT.SPP));

    const santriPerYear = await db
      .select({
        year: sql<string>`EXTRACT(YEAR FROM ${santri.createdAt})::TEXT`.as("year"),
        count: count().as("count"),
      })
      .from(santri)
      .where(and(eq(santri.status, SANTRI_STATUS.ACTIVE), sql`EXTRACT(YEAR FROM ${santri.createdAt}) >= ${minYear}`))
      .groupBy(sql`EXTRACT(YEAR FROM ${santri.createdAt})`)
      .orderBy(sql`year`);

    const registrasiPerYear = await db
      .select({
        year: sql<string>`EXTRACT(YEAR FROM ${payment.createdAt})::TEXT`.as("year"),
        sum: sum(payment.amount).as("sum"),
      })
      .from(payment)
      .where(and(eq(payment.type, TYPE_PAYMENT.REGISTRATION), sql`EXTRACT(YEAR FROM ${payment.createdAt}) >= ${minYear}`))
      .groupBy(sql`EXTRACT(YEAR FROM ${payment.createdAt})`)
      .orderBy(sql`year`);

    const sppPerYear = await db
      .select({
        year: sql<string>`EXTRACT(YEAR FROM ${payment.createdAt})::TEXT`.as("year"),
        sum: sum(payment.amount).as("sum"),
      })
      .from(payment)
      .where(and(eq(payment.type, TYPE_PAYMENT.SPP), sql`EXTRACT(YEAR FROM ${payment.createdAt}) >= ${minYear}`))
      .groupBy(sql`EXTRACT(YEAR FROM ${payment.createdAt})`)
      .orderBy(sql`year`);

    return {
      totalSantri,
      totalRegistrasi: totalRegistrasi ?? 0,
      totalSPP: totalSPP ?? 0,
      santriPerYear,
      registrasiPerYear,
      sppPerYear,
    };
  },
};

export default dashboardService;
