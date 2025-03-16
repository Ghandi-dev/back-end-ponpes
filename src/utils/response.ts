import { Response } from "express";
import { ZodError } from "zod";

type Pagination = {
  totalPages: number;
  current: number;
  total: number;
};

export default {
  success: (res: Response, data: any, message: string) => {
    return res.status(200).json({
      meta: {
        message: message,
        status: 200,
      },
      data,
    });
  },
  error: (res: Response, error: unknown, message: string) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        meta: {
          message: message,
          status: 400,
        },
        data: error.formErrors, // Menggunakan format() dari Zod untuk error detail
      });
    }

    if ((error as any)?.code) {
      const _err = error as any;
      return res.status(500).json({
        meta: {
          message: _err.message || "Database error",
          status: 500,
        },
        data: _err,
      });
    }

    return res.status(500).json({
      meta: {
        message: message,
        status: 500,
      },
      data: error,
    });
  },
  unauthorized: (res: Response, message: string = "Unauthorized") => {
    return res.status(403).json({
      meta: {
        message: message,
        status: 403,
      },
      data: null,
    });
  },
  notFound: (res: Response, message: string = "Not Found") => {
    return res.status(404).json({
      meta: {
        message: message,
        status: 404,
      },
      data: null,
    });
  },
  pagination(res: Response, data: any[], pagination: Pagination, message: string) {
    return res.status(200).json({
      meta: {
        message: message,
        status: 200,
      },
      data,
      pagination,
    });
  },
};
