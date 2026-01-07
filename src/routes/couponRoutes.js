import express from 'express';
import { applyCouponToCart } from "../controllers/couponController.js";
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/applycoupon",verifyToken,applyCouponToCart);

export default router;