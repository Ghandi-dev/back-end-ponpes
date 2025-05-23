import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/register-admin", [authMiddleware /*aclMiddleware([ROLES.ADMIN])*/], authController.registerAdmin);
router.post("/auth/login", authController.login);
router.post("/auth/activation", authController.activation);
router.post("/auth/update-profile", authMiddleware, authController.updateProfile);
router.post("/auth/update-password", authMiddleware, authController.updatePassword);
router.get("/auth/me", authMiddleware, authController.me);

export default router;
