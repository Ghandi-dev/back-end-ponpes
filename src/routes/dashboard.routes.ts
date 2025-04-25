import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import dashboardController from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/dashboard/dashboard-admin", [authMiddleware, aclMiddleware([ROLES.ADMIN])], dashboardController.getDashboardSummaryAdmin);

export default router;
