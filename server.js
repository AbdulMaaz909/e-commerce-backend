import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
