import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", verifyToken, loginUser);

export default router;
