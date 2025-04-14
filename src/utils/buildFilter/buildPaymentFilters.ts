import { SQL, eq, and, ilike, inArray, gte, lte } from "drizzle-orm";
import { payment, santri, STATUS_PAYMENT, TYPE_PAYMENT } from "../../models";

type QueryParams = {
  santriId?: number;
  fullname?: string;
  status?: string;
  month?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
};

export const buildPaymentFilters = ({ santriId, fullname, status, month, type, fromDate, toDate }: QueryParams): SQL<unknown> | undefined => {
  const filters: (SQL<unknown> | undefined)[] = [];

  // Filter berdasarkan santriId
  if (santriId) {
    filters.push(eq(payment.santriId, santriId));
  }

  // Filter berdasarkan fullname
  if (fullname) {
    filters.push(ilike(santri.fullname, `%${fullname}%`));
  }

  // Filter berdasarkan type
  if (type) {
    const typeArray = type.split(",").map((t) => t.trim() as TYPE_PAYMENT);
    filters.push(inArray(payment.type, typeArray));
  }

  // Filter berdasarkan month
  if (month) {
    filters.push(eq(payment.month, +month));
  }

  // Filter berdasarkan status
  if (status) {
    const statusArray = status.split(",").map((s) => s.trim() as STATUS_PAYMENT);
    if (statusArray.length > 0) {
      filters.push(inArray(payment.status, statusArray));
    }
  }

  // Filter berdasarkan tanggal (fromDate dan toDate)
  if (fromDate) {
    filters.push(gte(payment.createdAt, new Date(fromDate)));
  }

  if (toDate) {
    filters.push(lte(payment.createdAt, new Date(toDate)));
  }

  // Jika ada filter, gabungkan semuanya dengan AND
  return filters.length > 0 ? and(...filters) : undefined;
};
