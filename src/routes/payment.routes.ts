import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import paymentController from "../controllers/payment.controller";

const router = express.Router();

// ADMIN
router.get("/payments", [authMiddleware, aclMiddleware([ROLES.ADMIN])], paymentController.findAll);

// SANTRI (ME = current user)
router.get("/my/payments", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.findMe);
router.post("/my/payments", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.createMe);
router.get("/my/payments/registration", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.findMeRegistration);

// UPDATE PAYMENT STATUS
router.post("/payments/notification", paymentController.txNotification);
router.put("/payments/:paymentId/pending", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.pending);
router.put("/payments/:paymentId/completed", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.completed);
router.put("/payments/:paymentId/canceled", [authMiddleware, aclMiddleware([ROLES.SANTRI])], paymentController.canceled);

export default router;
