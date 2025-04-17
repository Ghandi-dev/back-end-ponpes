import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import adminController from "../controllers/admin.controller";

const router = express.Router();

router.get("/admin", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.findMany);
router.get("/admin/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.findOne);
router.get("/admin/me/details", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.findMe);
router.post("/admin", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.create);
router.put("/admin/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.update);
router.put("/admin/me/details", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.updateMe);
router.delete("/admin/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], adminController.delete);

export default router;
