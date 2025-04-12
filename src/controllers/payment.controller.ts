import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import paymentService from "../service/payment.service";
import { STATUS_PAYMENT, SANTRI_STATUS, TYPE_PAYMENT } from "../utils/enum";
import { getId } from "../utils/id";
import paymentUtils from "../utils/paymentUtils";
import { InsertPaymentSchemaType, payment, santri } from "../models";
import santriService from "../service/santri.service";
import { and, eq, ilike, inArray, like, SQL } from "drizzle-orm";

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
    // implement me function
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
      const { page = 1, limit = 10, fullname, status, month, type } = req.query;
      // Mengonversi status menjadi array jika ada
      const statusArray: STATUS_PAYMENT[] = status ? (status as string).split(",").map((s) => s.trim() as STATUS_PAYMENT) : [];

      // Membuat query filter dinamis
      let where: SQL<unknown> | undefined = undefined;

      // Menambahkan kondisi fullname jika ada
      if (fullname) {
        where = and(where, ilike(santri.fullname, `%${fullname}%`));
      }

      // Menambahkan kondisi type jika ada
      if (type) {
        where = and(where, eq(payment.type, type as TYPE_PAYMENT));
      }

      // Menambahkan kondisi month jika ada
      if (month) {
        where = and(where, eq(payment.month, +month));
      }

      // Menambahkan kondisi status jika ada
      if (statusArray.length > 0) {
        where = and(where, inArray(payment.status, statusArray));
      }

      const santriList = await paymentService.findMany(+page, +limit, where);
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

  async pending(req: IReqUser, res: Response) {
    await updatePaymentStatus(req, res, STATUS_PAYMENT.PENDING, "Pending");
  },

  async completed(req: IReqUser, res: Response) {
    try {
      const { paymentId } = req.params;
      const result = await paymentService.update(paymentId, {
        status: STATUS_PAYMENT.COMPLETED,
      });

      const santriId = req.user?.identifier;
      if (!santriId) throw new Error("Santri ID is missing");

      const santri = await santriService.findOne({ id: santriId });

      if (santri?.status === SANTRI_STATUS.FILES_COMPLETED) {
        await santriService.update(santriId, {}, SANTRI_STATUS.PAYMENT_COMPLETED);
      }

      response.success(res, result, "Payment Completed");
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
