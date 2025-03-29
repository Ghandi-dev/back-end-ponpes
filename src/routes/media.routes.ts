import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/enum";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";

const router = express.Router();

router.post("/media/upload-single", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SANTRI]), mediaMiddleware.single("file")], mediaController.single);
router.post(
  "/media/upload-multiple",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SANTRI]), mediaMiddleware.multiple("files")],
  mediaController.multiple
);
router.delete("/media/remove", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.SANTRI])], mediaController.remove);

export default router;
