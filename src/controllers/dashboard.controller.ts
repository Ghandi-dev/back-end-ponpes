import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import dashboardService from "../service/dashboard.service";

export default {
  getDashboardSummaryAdmin: async (req: IReqUser, res: Response) => {
    try {
      const result = await dashboardService.getDashboardSummaryAdmin();
      response.success(res, result, "Get Dashboard Summary Success");
    } catch (error) {
      response.error(res, error, "Error Get Dashboard Summary");
    }
  },
};
