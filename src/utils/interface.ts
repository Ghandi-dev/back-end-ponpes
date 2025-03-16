import { Request } from "express";
import { InferSelectModel } from "drizzle-orm";
import { user } from "../models/user.model"; // Pastikan path ini sesuai

export interface IReqUser extends Request {
  user?: IUserToken;
}

// Mengambil tipe dari Drizzle ORM, lalu menghilangkan beberapa properti
export interface IUserToken
  extends Omit<
    InferSelectModel<typeof user>,
    "password" | "activationCode" | "isActive" | "email" | "fullname" | "profilePicture" | "createdAt" | "updatedAt"
  > {
  id: number;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}
