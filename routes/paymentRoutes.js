import express from "express";
import {
  generateTokenController,
  btPaymentController,
} from "../controllers/paymentController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

/// token generation
router.get("/generate-token", generateTokenController);

// payment
router.post("/client-payment", protectRoute, btPaymentController);
export default router;
