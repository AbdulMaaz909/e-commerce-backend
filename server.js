import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js"
import couponRoutes from "./src/routes/couponRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

//auth Routes
app.use("/api", authRoutes);
//Cart Routes
app.use("/api",cartRoutes);

//Coupon Routes
app.use("/api",couponRoutes)

// order Routes
app.use("/api",orderRoutes);

//admin routes
app.use("/api",adminRoutes)

//get products
app.use("/api",productRoutes)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
