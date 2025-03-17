import express from "express";
import userRoutes from "./auth.routes";
import santriRoutes from "./santri.routes";

const router = express.Router();

router.use(userRoutes);
router.use(santriRoutes);

export default router;
