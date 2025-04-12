import { Column, eq, SQL } from "drizzle-orm";

export function buildFilters<T>(data: Partial<T>, columnMap: Partial<Record<keyof T, Column>>): SQL[] {
  const filters: SQL[] = [];

  for (const key in data) {
    const column = columnMap[key];
    const value = data[key];
    if (column && value !== undefined) {
      filters.push(eq(column, value));
    }
  }

  return filters;
}
