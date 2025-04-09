import { IReqUser } from "../utils/interface";
import { Response } from "express";
import response from "../utils/response";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import {
  registerUserSchema,
  SelectUserSchemaType,
  updatePasswordUserSchema,
  updateSantriSchema,
  UpdateSantriSchemaType,
  updateUserSchema,
  UpdateUserSchemaType,
} from "../models";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import userService from "../service/user.service";
import santriService from "../service/santri.service";
export default {
  async register(req: IReqUser, res: Response) {
    try {
      const { fullname, email, password, confirmPassword } = req.body;

      const payload = { fullname, email, password, confirmPassword };
      registerUserSchema.parse(payload);

      const user = (await userService.register(payload, fullname)) as SelectUserSchemaType;

      const activationLink = `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`;
      const html = await renderMailHtml("registration-success.ejs", {
        fullname,
        email: user.email,
        activationCode: user.activationCode,
        createdAt: user.createdAt,
        activationLink,
      });

      await sendMail({
        from: EMAIL_SMTP_USER,
        to: user.email,
        subject: "Registration Success",
        html,
      });

      response.success(res, user, "Register Success");
    } catch (error) {
      response.error(res, error, "Error Registering");
    }
  },

  async login(req: IReqUser, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.findOne({ email });

      if (!user) return response.unauthorized(res, "User not found");
      if (!user.isActive) return response.unauthorized(res, "User is not active");

      const isPasswordValid = encrypt(password) === user.password;
      if (!isPasswordValid) return response.unauthorized(res, "Invalid credentials");

      const santri = await santriService.findOne({ userId: user.id });
      if (!santri) return response.unauthorized(res, "Santri Not Found");

      const token = generateToken({
        id: user.id,
        role: user.role,
        santriId: santri?.id,
      });

      response.success(res, token, "Login Success");
    } catch (error) {
      response.error(res, error, "Error Logging In");
    }
  },

  async activation(req: IReqUser, res: Response) {
    try {
      const { code } = req.body as { code: string };
      const user = await userService.activate(code);

      if (!user) return response.unauthorized(res, "Invalid Activation Code");

      response.success(res, user, "Activation Success");
    } catch (error) {
      response.error(res, error, "Error Activating Account");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return response.unauthorized(res, "User not found");

      const result = await userService.findMe(userId);
      if (!result) return response.unauthorized(res, "User not found");

      response.success(res, result, "Get User Data Success");
    } catch (error) {
      response.error(res, error, "Error Getting User Data");
    }
  },

  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return response.unauthorized(res, "User not found");

      const data: UpdateSantriSchemaType & UpdateUserSchemaType = req.body;
      updateSantriSchema.parse(data);
      updateUserSchema.parse(data);

      if (data.password) {
        return response.error(res, null, "Password cannot be updated here");
      }

      const result = await userService.update(userId, data);

      response.success(res, result, "Update Profile Success");
    } catch (error) {
      response.error(res, error, "Error Updating Profile");
    }
  },

  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return response.unauthorized(res, "User not found");

      const { oldPassword, password, confirmPassword } = req.body;
      updatePasswordUserSchema.parse({ oldPassword, password, confirmPassword });

      const user = await userService.findOne({ id: userId });

      if (!user || user.password !== encrypt(oldPassword)) {
        return response.unauthorized(res, "Invalid old password");
      }

      const result = await userService.update(userId, {
        password: encrypt(password),
      });

      response.success(res, result, "Update Password Success");
    } catch (error) {
      response.error(res, error, "Error Updating Password");
    }
  },
};
