import { Response } from "express";
import { IReqUser } from "../utils/interface";
import adminsService from "../service/admin.service";
import response from "../utils/response";
import { insertAdminSchema, updateAdminSchema } from "../models";

export default {
  create: async (req: IReqUser, res: Response) => {
    try {
      const data = await insertAdminSchema.parseAsync(req.body);
      const result = await adminsService.create(data);
      response.success(res, result, "Admin created successfully");
    } catch (error) {
      response.error(res, error, "Error creating admin");
    }
  },

  update: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params;
      const data = await updateAdminSchema.parseAsync(req.body);
      const result = await adminsService.update(parseInt(id), data);
      return res.status(200).json(result);
    } catch (error) {
      response.error(res, error, "Error updating admin");
    }
  },

  updateMe: async (req: IReqUser, res: Response) => {
    try {
      const id = req.user?.identifier;
      if (!id) return response.unauthorized(res, "User not found");
      const data = await updateAdminSchema.parseAsync(req.body);
      const result = await adminsService.update(id, data);
      response.success(res, result, "Admin updated successfully");
    } catch (error) {
      response.error(res, error, "Error updating admin");
    }
  },

  delete: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params;
      await adminsService.delete(parseInt(id));
      return res.status(204).send();
    } catch (error) {
      response.error(res, error, "Error deleting admin");
    }
  },

  findOne: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params;
      const result = await adminsService.findOne({ id: parseInt(id) });
      if (!result) {
        return res.status(404).json({ message: "Admin not found" });
      }
      response.success(res, result, "Admin found successfully");
    } catch (error) {
      response.error(res, error, "Error finding admin");
    }
  },

  findMe: async (req: IReqUser, res: Response) => {
    try {
      const id = req.user?.identifier;
      if (!id) return response.unauthorized(res, "User not found");

      const result = await adminsService.findOne({ id });
      if (!result) {
        return response.notFound(res, "Admin not found");
      }
      response.success(res, result, "Admin found successfully");
    } catch (error) {
      response.error(res, error, "Error finding admin");
    }
  },

  findMany: async (req: IReqUser, res: Response) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const result = await adminsService.findMany(parseInt(page as string), parseInt(limit as string), search as string);
      if (!result) {
        return response.notFound(res, "Admins not found");
      }
      response.success(res, result, "Admins found successfully");
    } catch (error) {
      response.error(res, error, "Error finding admins");
    }
  },
};
