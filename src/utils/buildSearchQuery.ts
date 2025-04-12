import { SQL, SQLWrapper, and, eq, ilike, like } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

/**
 * Fungsi untuk membangun query pencarian dinamis berdasarkan parameter
 * @param table Tabel database Drizzle ORM
 * @param searchParams Parameter pencarian yang akan digunakan
 * @returns Kondisi SQL untuk digunakan dalam where clause, atau null jika tidak ada parameter
 */
function buildSearchQuery<T extends PgTableWithColumns<any>>(table: T, searchParams: Record<string, any> | undefined): SQL | undefined {
  const searchConditions: SQL[] = [];

  if (!searchParams) return undefined;
  // Iterasi semua parameter search yang dikirim
  for (const [column, value] of Object.entries(searchParams)) {
    // Pastikan kolom adalah properti yang valid dari tabel
    if (column in table) {
      // Cek tipe data untuk menentukan jenis pencarian yang sesuai
      if (typeof value === "string") {
        // Gunakan LIKE untuk pencarian text
        searchConditions.push(ilike(table[column as keyof typeof table], `%${value}%`));
      } else {
        // Gunakan eq (equal) untuk tipe data lainnya
        searchConditions.push(eq(table[column as keyof typeof table], value));
      }
    }
  }

  // Jika tidak ada kondisi, return null (tanpa filter)
  if (searchConditions.length === 0) return undefined;

  // Gabungkan semua kondisi dengan AND
  return and(...searchConditions);
}

export default buildSearchQuery;
