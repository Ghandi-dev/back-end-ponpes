import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

import { SANTRI_STATUS } from "../utils/enum";
import santriService from "../service/santri.service";
import { updateSantriSchema, UpdateSantriSchemaType } from "../models";

export default {
  async create(req: IReqUser, res: Response) {},
  async findAll(req: IReqUser, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const santriList = await santriService.findMany(+page, +limit, search as string);
      response.pagination(
        res,
        santriList.data,
        {
          total: santriList.totalData,
          totalPages: santriList.totalPages,
          current: santriList.currentPage,
        },
        "Get All Santri Success"
      );
    } catch (error) {
      response.error(res, error, "Error Get All Santri");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const santri = await santriService.findOne({ id: +id });
      if (!santri) {
        return response.notFound(res, "Santri not found");
      }
      response.success(res, santri, "Get Santri Success");
    } catch (error) {
      response.error(res, error, "Error Get Santri");
    }
  },
  async me(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;

      const result = await santriService.findOne({ id: santriId as number });
      if (!result) {
        return response.unauthorized(res, "Santri not found");
      }
      response.success(res, result, "Success get santri data");
    } catch (error) {
      response.error(res, error, "Error Get Profile Santri");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateSantriSchemaType;
      updateSantriSchema.parse(data);
      if (data.status) {
        return response.error(res, null, "Status cannot be updated");
      }
      const santri = await santriService.findOne({ id: +id });
      if (!santri) {
        return response.notFound(res, "Santri not found");
      }
      const result = await santriService.update(+id, data);
      response.success(res, result, "Update Santri Success");
    } catch (error) {
      response.error(res, error, "Error Update Santri");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      const data = req.body as UpdateSantriSchemaType;
      updateSantriSchema.parse(data);
      if (data.status) {
        return response.error(res, null, "Status cannot be updated");
      }
      const santri = await santriService.findOne({ id: santriId });
      const result = await santriService.update(
        santriId!,
        data,
        santri?.status === SANTRI_STATUS.PENDING_REGISTRATION ? SANTRI_STATUS.PROFILE_COMPLETED : santri?.status
      );
      response.success(res, result, "Update Profile Santri Success");
    } catch (error) {
      response.error(res, error, "Error Update Profile Santri");
    }
  },
  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await santriService.delete(+id);
      response.success(res, result, "Delete Santri Success");
    } catch (error) {
      response.error(res, error, "Error Delete Santri");
    }
  },
};
