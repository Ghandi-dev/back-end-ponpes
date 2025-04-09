import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

import { SANTRI_STATUS } from "../utils/enum";
import { insertAddressSchema, InsertAddressSchemaType, updateAddressSchema, UpdateAddressSchemaType } from "../models";
import addressService from "../service/address.service";
import santriService from "../service/santri.service";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const data: InsertAddressSchemaType = req.body;
      insertAddressSchema.parse(data);
      const result = await addressService.create(data);
      response.success(res, result, "Create Address Success");
    } catch (error) {
      response.error(res, error, "Error Create Address");
    }
  },
  async createMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const payload: InsertAddressSchemaType = {
        ...req.body,
        santriId,
      };
      insertAddressSchema.parse(payload);

      const result = await addressService.create(payload);

      const santri = await santriService.findOne({ id: santriId });
      const nextStatus = santri?.status === SANTRI_STATUS.PROFILE_COMPLETED ? SANTRI_STATUS.ADDRESS_COMPLETED : santri?.status;

      await santriService.update(santriId, {}, nextStatus);

      response.success(res, result, "Create Address Success");
    } catch (error) {
      response.error(res, error, "Error Create Address");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await addressService.findOne(id);
      response.success(res, result, "Get Address Success");
    } catch (error) {
      response.error(res, error, "Error Get Address");
    }
  },

  async findMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const result = await addressService.findOne(santriId);
      response.success(res, result, "Get Address Success");
    } catch (error) {
      response.error(res, error, "Error Get Address");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const id = Number(req.params.id);
      const data: InsertAddressSchemaType = req.body;
      updateAddressSchema.parse(data);

      const result = await addressService.update(id, data);
      response.success(res, result, "Update Address Success");
    } catch (error) {
      response.error(res, error, "Error Update Address");
    }
  },

  async updateMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const data: UpdateAddressSchemaType = req.body;
      updateAddressSchema.parse(data);
      const result = await addressService.update(santriId, data);

      const santri = await santriService.findOne({ id: santriId });
      const nextStatus = santri?.status === SANTRI_STATUS.PROFILE_COMPLETED ? SANTRI_STATUS.ADDRESS_COMPLETED : santri?.status;

      await santriService.update(santriId, {}, nextStatus);

      response.success(res, result, "Update Address Success");
    } catch (error) {
      response.error(res, error, "Error Update Address");
    }
  },

  async delete(req: IReqUser, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await addressService.delete(id);
      response.success(res, result, "Delete Address Success");
    } catch (error) {
      response.error(res, error, "Error Delete Address");
    }
  },
};
