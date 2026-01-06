import express from "express";
import { addUser, fetchUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/createuser", addUser);
router.get("/getuser", fetchUser);

export default router;