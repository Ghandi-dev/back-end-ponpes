import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import paymentService from "../service/payment.service";
import { STATUS_PAYMENT, SANTRI_STATUS, TYPE_PAYMENT } from "../utils/enum";
import { getId } from "../utils/id";
import paymentUtils from "../utils/paymentUtils";
import { InsertPaymentSchemaType } from "../models";
import santriService from "../service/santri.service";
import { buildPaymentFilters } from "../utils/buildFilter/buildPaymentFilters";

export default {
  async createMe(req: IReqUser, res: Response) {
    try {
      const data = req.body as InsertPaymentSchemaType;
      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const amount = data.type === TYPE_PAYMENT.REGISTRATION ? 250000 : 500000;

      const paymentId = getId();

      const detail = await paymentUtils.createLink({
        transaction_details: {
          gross_amount: amount,
          order_id: paymentId,
        },
      });

      const payload: InsertPaymentSchemaType = {
        ...data,
        santriId,
        amount,
        paymentId,
        detail,
        month,
        year,
      };

      const result = await paymentService.create(payload);
      response.success(res, result, "Create Payment Success");
    } catch (error) {
      response.error(res, error, "Error Creating Payment");
    }
  },

  async findMeRegistration(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const result = await paymentService.findOne({
        santriId,
        type: TYPE_PAYMENT.REGISTRATION,
      });

      response.success(res, result, "Get Registration Payment Success");
    } catch (error) {
      response.error(res, error, "Error Getting Registration Payment");
    }
  },

  async findMe(req: IReqUser, res: Response) {
    try {
      const santriId = req.user?.identifier;
      const { page = 1, limit = 10, ...query } = req.query;
      // Panggil utility function untuk membangun filter
      const where = buildPaymentFilters({ ...query, santriId });

      const result = await paymentService.findMany(+page, +limit, where);

      response.pagination(
        res,
        result.data,
        {
          total: result.totalData,
          totalPages: result.totalPages,
          current: result.currentPage,
        },
        "Get All Payment by Santri Success"
      );
    } catch (error) {
      response.error(res, error, "Error Getting Payment");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { paymentId } = req.params;
      const result = await paymentService.findOne({ id: +paymentId });
      response.success(res, result, "Get Payment Success");
    } catch (error) {
      response.error(res, error, "Error Getting Payment");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const { page = 1, limit = 10, ...query } = req.query;

      // Panggil utility function untuk membangun filter
      const where = buildPaymentFilters(query);

      const result = await paymentService.findMany(+page, +limit, where);
      response.pagination(
        res,
        result.data,
        {
          total: result.totalData,
          totalPages: result.totalPages,
          current: result.currentPage,
        },
        "Get All Payment Success"
      );
    } catch (error) {
      response.error(res, error, "Error Get All Payment");
    }
  },

  async pending(req: IReqUser, res: Response) {
    await updatePaymentStatus(req, res, STATUS_PAYMENT.PENDING, "Pending");
  },

  async completed(req: IReqUser, res: Response) {
    try {
      const { paymentId } = req.params;
      const payment = await paymentService.findOne({ paymentId });
      if (payment?.status === STATUS_PAYMENT.COMPLETED) {
        return response.error(res, null, "Payment already completed");
      }

      if (!payment) return response.notFound(res, "Payment not found");
      const result = await paymentService.update(paymentId, {
        status: STATUS_PAYMENT.COMPLETED,
      });

      const santriId = req.user?.identifier;
      if (!santriId) return response.unauthorized(res, "Santri ID is missing");

      const santri = await santriService.findOne({ id: santriId });

      if (santri?.status === SANTRI_STATUS.FILES_COMPLETED) {
        await santriService.update(santriId, {}, SANTRI_STATUS.PAYMENT_COMPLETED);
      }

      return response.success(res, result, "Payment Completed");
    } catch (error) {
      response.error(res, error, "Error Completing Payment");
    }
  },

  async canceled(req: IReqUser, res: Response) {
    await updatePaymentStatus(req, res, STATUS_PAYMENT.CANCELED, "Canceled");
  },
};

// 🔁 Reusable function to reduce repetition
async function updatePaymentStatus(req: IReqUser, res: Response, status: STATUS_PAYMENT, label: string) {
  try {
    const { paymentId } = req.params;
    const result = await paymentService.update(paymentId, { status });
    response.success(res, result, `Payment ${label} Success`);
  } catch (error) {
    response.error(res, error, `Error Updating Payment to ${label}`);
  }
}
