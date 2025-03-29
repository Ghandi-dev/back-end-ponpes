import { Response } from "express";
import { IReqUser } from "../utils/interface";
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
  async single(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Media']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
     #swagger.requestBody = {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary'
                        }
                    }
                }
            }
        }
     }
     */
    if (!req.file) {
      response.error(res, null, "File not found");
    }
    try {
      const result = await uploader.uploadSingle(req.file as Express.Multer.File);
      response.success(res, result, "success upload file");
    } catch {
      response.error(res, null, "failed to upload file");
    }
  },
  async multiple(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Media']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
        #swagger.requestBody = {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            files: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    }
                }
            }
        }
     */
    if (!req.files || req.files.length === 0) {
      response.error(res, null, "Files not found");
    }
    try {
      const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
      response.success(res, result, "success upload files");
    } catch {
      response.error(res, null, "failed to upload files");
    }
  },
  async remove(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Media']
     #swagger.security = [{ 
     "bearerAuth": [] 
     }]
        #swagger.requestBody = {
            required: true,
            schema: {
            $ref:"#/components/schemas/RemoveMediaRequest"
            }
        }
     */
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      response.success(res, result, "success remove file");
    } catch {
      response.error(res, null, "failed to remove file");
    }
  },
};
