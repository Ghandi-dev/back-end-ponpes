import { IReqUser } from "../utils/interface";
import { Response } from "express";
import response from "../utils/response";
import { createUser, getUserByIdentifier, userActivate } from "../service/user.service";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { userDTO, userLoginDTO } from "../models";
export default {
  async register(req: IReqUser, res: Response) {
    try {
      const { fullname, email, password, confirmPassword } = req.body;
      userDTO.parse({ fullname, email, password, confirmPassword });
      const user = await createUser(fullname, email, password);
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
      const result = await getUserByIdentifier({ id: user?.id });
      if (!result) {
        return response.unauthorized(res, "User not found");
      }
      response.success(res, result, "Success get user data");
    } catch (error) {
      response.error(res, error, "Failed to get user data");
    }
  },
};
