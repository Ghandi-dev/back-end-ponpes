import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import addressController from "../controllers/address.controller";

const router = express.Router();

router.post("/address/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], addressController.create);
router.post("/address/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], addressController.createMe);
router.put("/address/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], addressController.update);
router.put("/address/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], addressController.updateMe);
router.get("/address/:id/santri", [authMiddleware, aclMiddleware([ROLES.ADMIN])], addressController.findOne);
router.get("/address/me", [authMiddleware, aclMiddleware([ROLES.SANTRI])], addressController.findMe);

export default router;
