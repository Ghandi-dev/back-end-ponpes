import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import paymentController from "../controllers/payment.controller";

const router = express.Router();

router.get("/payment", [authMiddleware, aclMiddleware([ROLES.ADMIN])], paymentController.findAll);
router.post("/payment", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.createMe);
router.get("/payment/me-registration", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.findMeRegistration);
router.put("/payment/:paymentId/pending", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.pending);
router.put("/payment/:paymentId/completed", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.completed);
router.put("/payment/:paymentId/canceled", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.canceled);

export default router;
