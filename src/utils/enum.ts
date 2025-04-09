export enum GENDERS {
  MALE = "male",
  FEMALE = "female",
}

export enum ROLES {
  ADMIN = "admin",
  SANTRI = "santri",
}

export enum SANTRI_STATUS {
  PENDING_REGISTRATION = "pending_registration",
  PROFILE_COMPLETED = "profile_completed",
  ADDRESS_COMPLETED = "address_completed",
  FILES_COMPLETED = "files_completed",
  PAYMENT_COMPLETED = "payment_completed", // Sedang dalam tahap pembayaran registrasi
  RE_REGISTERED = "re_registered",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum STATUS_PAYMENT {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export enum TYPE_PAYMENT {
  REGISTRATION = "registration",
  SPP = "spp",
}
