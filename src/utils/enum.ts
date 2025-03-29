export enum GENDERS {
  MALE = "male",
  FEMALE = "female",
}

export enum ROLES {
  ADMIN = "admin",
  SANTRI = "santri",
}

export enum STATUS_SANTRI {
  PENDING_REGISTRATION = "pending_registration", // Akun baru dibuat, belum mengisi data pribadi
  COMPLETED_PROFILE = "completed_profile", // Sudah mengisi data pribadi
  COMPLETED_ADDRESS = "completed_address", // Sudah mengisi data alamat
  COMPLETED_FILE = "completed_file", // Sudah mengisi data file
  PAYMENT_PENDING = "payment_pending", // Menunggu pembayaran pendaftaran
  PAYMENT_CONFIRMED = "payment_confirmed", // Pembayaran dikonfirmasi
  RE_REGISTRATION_PENDING = "re_registration_pending", // Menunggu daftar ulang
  RE_REGISTERED = "re_registered", // Sudah daftar ulang
  ACTIVE_SANTRI = "active_santri", // Sudah menjadi santri aktif
  INACTIVE = "inactive", // Status tidak aktif (misalnya mengundurkan diri)
}
