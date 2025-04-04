import express from "express";
import userRoutes from "./auth.routes";
import santriRoutes from "./santri.routes";
import addressRoutes from "./address.routes";
import fileRoutes from "./file.routes";
import mediaRoutes from "./media.routes";

const router = express.Router();

router.use(userRoutes);
router.use(santriRoutes);
router.use(addressRoutes);
router.use(fileRoutes);
router.use(mediaRoutes);

export default router;
