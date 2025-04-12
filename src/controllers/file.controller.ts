import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { SANTRI_STATUS } from "../utils/enum";
import { insertFileSchema, InsertFileSchemaType, UpdateFileSchemaType, updateUserSchema } from "../models";
import fileService from "../service/file.service";
import santriService from "../service/santri.service";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      const data: InsertFileSchemaType = { ...req.body, santriId };

      insertFileSchema.parse(data);

      const result = await fileService.create(data);
      response.success(res, result, "Create Files Success");
    } catch (error) {
      response.error(res, error, "Error Create Files");
    }
  },
  async createMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      const data: InsertFileSchemaType = { ...req.body, santriId };

      if (!santriId) throw new Error("Santri ID is missing");
      insertFileSchema.parse(data);
      const payload: InsertFileSchemaType = {
        ...data,
        santriId,
      };

      const result = await fileService.create(payload);
      const santri = await santriService.findOne({ id: req.user?.identifier as number });
      await santriService.update(
        req.user?.identifier as number,
        {},
        santri?.status === SANTRI_STATUS.ADDRESS_COMPLETED ? SANTRI_STATUS.FILES_COMPLETED : santri?.status
      );
      response.success(res, result, "Create Files Success");
    } catch (error) {
      response.error(res, error, "Error Create Files");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await fileService.findOne(id);
      response.success(res, result, "Get Files Success");
    } catch (error) {
      response.error(res, error, "Error Get Files");
    }
  },
  async findMe(req: IReqUser, res: Response) {
    try {
      const result = await fileService.findOne(req.user?.identifier as number);
      response.success(res, result, "Get Files Success");
    } catch (error) {
      response.error(res, error, "Error Get Files");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const id = Number(req.params.id);
      const data: UpdateFileSchemaType = req.body;
      updateUserSchema.parse(data);
      const result = await fileService.update(id, data);
      response.success(res, result, "Update Files Success");
    } catch (error) {
      response.error(res, error, "Error Update Files");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const data: UpdateFileSchemaType = req.body;
      updateUserSchema.parse(data);
      const result = await fileService.update(req.user?.identifier as number, data);
      response.success(res, result, "Update Files Success");
    } catch (error) {
      response.error(res, error, "Error Update Files");
    }
  },
};
