import { Request } from "express";
import { InferSelectModel } from "drizzle-orm";
import { user } from "../models/user.model";
import { santri } from "../models";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IUserToken
  extends Omit<
    InferSelectModel<typeof user>,
    "password" | "activationCode" | "isActive" | "email" | "fullname" | "profilePicture" | "createdAt" | "updatedAt"
  > {
  id: number;
  santriId: number;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}
