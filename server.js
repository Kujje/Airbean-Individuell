import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";

import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import menuRoutes from "./routes/menu.js";
import promotionRoutes from "./routes/promotions.js";
import orderRoutes from "./routes/order.js";

// configuration
dotenv.config(); // Detta laddar miljövariabler från en .env-fil
const app = express(); // Detta skapar upp en express-applikation
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

// middleware
app.use(express.json());
app.use(logger);

// Global user:
global.user = null; // Lagra den inloggade användaren globalt

// routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/promotions", promotionRoutes);

database.on("error", (error) => {
  console.error("Database connection error:", error);
});

database.once("connected", () => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// errorHandling
app.use(errorHandler);
