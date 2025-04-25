import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env",
});

export const PORT: number = Number(process.env.PORT) || 3001;
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const CA_CERTIFICATE: string = process.env.CA_CERTIFICATE || "";
export const DATABASE_HOST: string = process.env.DATABASE_HOST || "localhost";
export const DATABASE_PORT: number = Number(process.env.DATABASE_PORT) || 5432;
export const DATABASE_USER: string = process.env.DATABASE_USER || "postgres";
export const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "postgres";
export const DATABASE_NAME: string = process.env.DATABASE_NAME || "postgres";

export const SECRET: string = process.env.SECRET || "";

export const EMAIL_SMTP_SECURE: boolean = Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || "";
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || "";
export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || "";
export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME || "";
export const CLIENT_HOST: string = process.env.CLIENT_HOST || "http://localhost:3000";

export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || "";

export const MIDTRANS_SERVER_KEY: string = process.env.MIDTRANS_SERVER_KEY || "";
export const MIDTRANS_CLIENT_KEY: string = process.env.MIDTRANS_CLIENT_KEY || "";
export const MIDTRANS_TRANSACTION_URL: string = process.env.MIDTRANS_TRANSACTION_URL || "";

export const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";
