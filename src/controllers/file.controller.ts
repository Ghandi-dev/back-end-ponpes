import { Response } from "express";
import { IReqUser } from "../utils/interface";
import { fileDTO, TypeFiles } from "../models";
import { createFile, findOneFile, updateFile } from "../service/file.service";
import response from "../utils/response";
import { findOneSantri, updateSantri } from "../service/santri.service";
import { STATUS_SANTRI } from "../utils/enum";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const data = req.body as TypeFiles;
      fileDTO.parse(data);
      const result = await createFile(data);
      response.success(res, result, "Create Files Success");
    } catch (error) {
      response.error(res, error, "Error Create Files");
    }
  },
  async createMe(req: IReqUser, res: Response) {
    try {
      const data = req.body as TypeFiles;
      const santriId = req.user?.santriId;
      fileDTO.parse(data);
      const payload = {
        ...data,
        santriId,
      } as TypeFiles;
      const result = await createFile(payload);
      const santri = await findOneSantri({ id: req.user?.santriId as number });
      await updateSantri(req.user?.santriId as number, {}, santri?.status === STATUS_SANTRI.COMPLETED_ADDRESS ? STATUS_SANTRI.COMPLETED_FILE : santri?.status);
      response.success(res, result, "Create Files Success");
    } catch (error) {
      response.error(res, error, "Error Create Files");
    }
  },
  async findMe(req: IReqUser, res: Response) {
    try {
      const result = await findOneFile(req.user?.santriId as number);
      response.success(res, result, "Get Files Success");
    } catch (error) {
      response.error(res, error, "Error Get Files");
    }
  },
  async updateMe(req: IReqUser, res: Response) {
    try {
      const data = req.body as Partial<TypeFiles>;
      const result = await updateFile(req.user?.santriId as number, data);
      response.success(res, result, "Update Files Success");
    } catch (error) {
      response.error(res, error, "Error Update Files");
    }
  },
};
