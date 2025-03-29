import express from "express";
import userRoutes from "./auth.routes";
import santriRoutes from "./santri.routes";
import addressRoutes from "./address.routes";

const router = express.Router();

router.use(userRoutes);
router.use(santriRoutes);
router.use(addressRoutes);

export default router;
