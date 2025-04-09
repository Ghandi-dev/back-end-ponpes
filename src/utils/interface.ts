import { Request } from "express";
import { InferSelectModel } from "drizzle-orm";
import { users } from "../models/user.model";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IUserToken
  extends Omit<
    InferSelectModel<typeof users>,
    "password" | "activationCode" | "isActive" | "email" | "fullname" | "profilePicture" | "createdAt" | "updatedAt"
  > {
  id: number;
  identifier: number;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
}
