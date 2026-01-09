import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllOrders,
  getUserCartAdmin,
  getOrderDetails,
} from "../controllers/adminController.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/getallusers", verifyToken, isAdmin, getAllUsers);
router.get("/getallorders", verifyToken, isAdmin, getAllOrders);
router.get("/user-cart/:id", verifyToken, isAdmin, getUserCartAdmin);
router.get("/order-details/:id",verifyToken,getOrderDetails);//remove isAdmin from here

export default router;
