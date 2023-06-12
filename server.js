import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import connectDB from "./config/db.js";
import cors from "cors";
import path from "paths";

// configure env file
dotenv.config();

// database config
connectDB();

// express app
const app = express();

// Cross origin
app.use(cors());

// to display api hit result
app.use(morgan("dev"));
app.use(express.json()); // now we can send json data in response

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/payment", paymentRoutes);

// static files
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});


// PORT
const PORT = process.env.PORT || 8000;

// start server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
