import express from 'express';

import verifyToken from '../middleware/authMiddleware.js';
import { addItemToCart,getUserCart } from '../controllers/cartController.js';

const router = express.Router();

router.post("/add",verifyToken,addItemToCart);
router.get("/",verifyToken,getUserCart);


export default router;  