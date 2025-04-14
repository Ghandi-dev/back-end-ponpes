import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

import { SANTRI_STATUS } from "../utils/enum";
import santriService from "../service/santri.service";
import { santri, updateSantriSchema, UpdateSantriSchemaType } from "../models";
import { and, ilike, inArray, SQL } from "drizzle-orm";
import buildSearchQuery from "../utils/buildSearchQuery";

export default {
  async create(req: IReqUser, res: Response) {},
  async findAll(req: IReqUser, res: Response) {
    try {
      const { page = 1, limit = 10, fullname, status } = req.query;
      // Mengonversi status menjadi array jika ada
      const statusArray: SANTRI_STATUS[] = status ? (status as string).split(",").map((s) => s.trim() as SANTRI_STATUS) : [];

      // Membuat query filter dinamis
      let where: SQL<unknown> | undefined = undefined;

      // Menambahkan kondisi fullname jika ada
      if (fullname) {
        where = and(where, ilike(santri.fullname, `%${fullname}%`));
      }

      // Menambahkan kondisi status jika ada
      if (statusArray.length > 0) {
        where = and(where, inArray(santri.status, statusArray));
      }

      const result = await santriService.findMany(+page, +limit, where);
      response.pagination(
        res,
        result.data,
        {
          total: result.totalData,
          totalPages: result.totalPages,
          current: result.currentPage,
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
      const santri = await santriService.findOne({ id: +id });
      if (!santri) {
        return response.notFound(res, "Santri not found");
      }
      const result = await santriService.update(+id, data, data.status ?? santri.status);
      response.success(res, result, "Update Santri Success");
    } catch (error) {
      console.log(error);

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
