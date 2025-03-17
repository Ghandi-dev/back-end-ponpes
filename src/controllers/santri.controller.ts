import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { deleteSantri, findManySantri, findOneSantri, updateSantri } from "../service/santri.service";
import { santriUpdateDTO } from "../models";

export default {
  async create(req: IReqUser, res: Response) {},
  async findAll(req: IReqUser, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const santriList = await findManySantri(+page, +limit, search as string);
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
      const santri = await findOneSantri(+id);
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
      const santri = req.user;
      const result = await findOneSantri(santri?.id as number);

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
      const data = req.body;
      const result = await updateSantri(+id, data);
      response.success(res, result, "Update Santri Success");
    } catch (error) {
      response.error(res, error, "Error Update Santri");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const santri = req.user;
      const data = req.body;
      santriUpdateDTO.parse(data);
      const result = await updateSantri(santri?.id!, data);
      response.success(res, result, "Update Profile Santri Success");
    } catch (error) {
      response.error(res, error, "Error Update Profile Santri");
    }
  },
  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await deleteSantri(+id);
      response.success(res, result, "Delete Santri Success");
    } catch (error) {
      response.error(res, error, "Error Delete Santri");
    }
  },
};
