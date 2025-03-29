import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { deleteSantri, findManySantri, findOneSantri, updateSantri } from "../service/santri.service";
import { santriUpdateDTO, TypeSantri } from "../models";
import { STATUS_SANTRI } from "../utils/enum";

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
      const santri = await findOneSantri({ id: +id });
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
      const santriId = req.user?.santriId;

      const result = await findOneSantri({ id: santriId as number });
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
      const data = req.body as Partial<TypeSantri>;
      if (data.status) {
        return response.error(res, null, "Status cannot be updated");
      }
      const santri = await findOneSantri({ id: +id });
      if (!santri) {
        return response.notFound(res, "Santri not found");
      }
      const result = await updateSantri(+id, data);
      response.success(res, result, "Update Santri Success");
    } catch (error) {
      response.error(res, error, "Error Update Santri");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.santriId;
      const data = req.body as Partial<TypeSantri>;
      if (data.status) {
        return response.error(res, null, "Status cannot be updated");
      }

      santriUpdateDTO.parse(data);
      const santri = await findOneSantri({ id: santriId });
      const result = await updateSantri(
        santriId!,
        data,
        santri?.status === STATUS_SANTRI.PENDING_REGISTRATION ? STATUS_SANTRI.COMPLETED_PROFILE : santri?.status
      );
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
