import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import fileController from "../controllers/file.controller";

const router = express.Router();

router.post("/files/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], fileController.create);
router.post("/files/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], fileController.createMe);
router.get("/files/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], fileController.findOne);
router.get("/files/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], fileController.findMe);
router.put("/files/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], fileController.update);
router.put("/files/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], fileController.updateMe);
// router.delete("/files/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], fileController.delete);

export default router;
