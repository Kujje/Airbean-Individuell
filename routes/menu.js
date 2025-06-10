import express from "express";
import { getAllProducts } from "../services/products.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving menu", error: error.message });
  }
});

export default router;