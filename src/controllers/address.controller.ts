import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { TypeAddress } from "../models";
import { createAddress, findOneAddress, updateAddress } from "../service/address.service";
import { findOneSantri, updateSantri } from "../service/santri.service";
import { STATUS_SANTRI } from "../utils/enum";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const data = req.body as TypeAddress;
      const result = await createAddress(data);
      response.success(res, result, "Create Address Success");
    } catch (error) {
      response.error(res, error, "Error Create Address");
    }
  },
  async createMe(req: IReqUser, res: Response) {
    try {
      const data = req.body as TypeAddress;
      const payload = {
        ...data,
        santriId: req.user?.santriId,
      } as TypeAddress;

      const result = await createAddress(payload);

      const santri = await findOneSantri({ id: req.user?.santriId as number });
      await updateSantri(
        req.user?.santriId as number,
        {},
        santri?.status === STATUS_SANTRI.COMPLETED_PROFILE ? STATUS_SANTRI.COMPLETED_ADDRESS : santri?.status
      );
      response.success(res, result, "Create Address Success");
    } catch (error) {
      response.error(res, error, "Error Create Address");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await findOneAddress(+id);
      response.success(res, result, "Get Address Success");
    } catch (error) {
      response.error(res, error, "Error Get Address");
    }
  },
  async findMe(req: IReqUser, res: Response) {
    try {
      const result = await findOneAddress(req.user?.santriId as number);
      response.success(res, result, "Get Address Success");
    } catch (error) {
      response.error(res, error, "Error Get Address");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as Partial<TypeAddress>;
      const result = await updateAddress(+id, data);
      response.success(res, result, "Update Address Success");
    } catch (error) {
      response.error(res, error, "Error Update Address");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const data = req.body as Partial<TypeAddress>;

      const result = await updateAddress(req.user?.santriId as number, data);
      const santri = await findOneSantri({ id: req.user?.santriId as number });
      await updateSantri(
        req.user?.santriId as number,
        {},
        santri?.status === STATUS_SANTRI.COMPLETED_PROFILE ? STATUS_SANTRI.COMPLETED_ADDRESS : santri?.status
      );

      response.success(res, result, "Update Address Success");
    } catch (error) {
      response.error(res, error, "Error Update Address");
    }
  },
  async delete(req: IReqUser, res: Response) {},
};
