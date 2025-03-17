import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import santriController from "../controllers/santri.controller";
import { ROLES } from "../utils/enum";

const router = express.Router();

router.post("/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], santriController.create);
router.get("/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], santriController.findAll);
router.get("/santri/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], santriController.findOne);
router.get("/santri/me/details", [authMiddleware, aclMiddleware([ROLES.SANTRI])], santriController.me);
router.put("/santri/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], santriController.update);
router.put("/santri/me/details", [authMiddleware, aclMiddleware([ROLES.SANTRI])], santriController.updateMe);
router.delete("/santri/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], santriController.delete);

export default router;
