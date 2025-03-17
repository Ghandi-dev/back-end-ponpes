import { IReqUser } from "../utils/interface";
import { Response } from "express";
import response from "../utils/response";
import { createUser, getMe, getUserByIdentifier, updateUser, userActivate } from "../service/user.service";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { TypeUser, userDTO, userLoginDTO, userUpdatePasswordDTO } from "../models";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
export default {
  async register(req: IReqUser, res: Response) {
    try {
      const { fullname, email, password, confirmPassword } = req.body;
      // validate request
      userDTO.parse({ fullname, email, password, confirmPassword });
      // create user
      const user = (await createUser(fullname, email, password)) as unknown as TypeUser;
      // send email activation
      console.log("send email activation", user.email);
      const contentMail = await renderMailHtml("registration-success.ejs", {
        fullname: fullname,
        email: user.email,
        activationCode: user.activationCode,
        createdAt: user.createdAt,
        activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
      });
      await sendMail({
        from: EMAIL_SMTP_USER,
        to: user.email,
        subject: "Registration Success",
        html: contentMail,
      });
      response.success(res, user, "Register Success");
    } catch (error) {
      response.error(res, error, "Error Register");
    }
  },
  async login(req: IReqUser, res: Response) {
    try {
      const { email, password } = req.body;
      userLoginDTO.parse({ email, password });
      const user = await getUserByIdentifier({ email });
      if (!user) {
        return response.unauthorized(res, "User not found");
      }
      if (!user.isActive) {
        return response.unauthorized(res, "User is not active");
      }
      const validatePassword: boolean = encrypt(password) === user.password;
      if (!validatePassword) {
        return response.unauthorized(res, "Invalid credentials");
      }
      const token = generateToken({
        id: user.id,
        role: user.role,
      });
      response.success(res, token, "Login Success");
    } catch (error) {
      response.error(res, error, "Error Login");
    }
  },
  async activation(req: IReqUser, res: Response) {
    try {
      const { code } = req.body as { code: string };
      const user = await userActivate(code);
      if (!user) {
        return response.unauthorized(res, "Invalid Activation Code");
      }
      response.success(res, user, "Activation Success");
    } catch (error) {
      response.error(res, error, "Error Activation");
    }
  },
  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await getMe(user?.id!);
      if (!result) {
        return response.unauthorized(res, "User not found");
      }
      response.success(res, result, "Success get user data");
    } catch (error) {
      response.error(res, error, "Failed to get user data");
    }
  },
  async updateProfile(req: IReqUser, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return response.unauthorized(res, "User not found");
      }
      const data = req.body;
      if (data.password) {
        return response.error(res, null, "Password cannot be updated here");
      }
      const result = await updateUser(user.id, data);
      return response.success(res, result, "Update Profile Success");
    } catch (error) {
      response.error(res, error, "Error Update Profile");
    }
  },
  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return response.unauthorized(res, "User not found");
      }
      const { oldPassword, password, confirmPassword } = req.body;
      userUpdatePasswordDTO.parse({ oldPassword, password, confirmPassword });
      const user = await getUserByIdentifier({ id: userId });
      if (!user || user.password !== encrypt(oldPassword)) {
        return response.unauthorized(res, "User not found or invalid old password");
      }
      const result = await updateUser(userId, { password: encrypt(password) });
      return response.success(res, result, "Update Password Success");
    } catch (error) {
      response.error(res, error, "Error Update Password");
    }
  },
};
