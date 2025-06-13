import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.js";
import Menu from "../models/Menu.js";
import { generatePrefixedId } from "../utils/IdGenerator.js";

const router = express.Router();
// GET /api/menu – hämta alla produkter
router.get("/", async (req, res) => {
  try {
    const products = await Menu.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Fel vid hämtning av meny", error: err.message });
  }
});

// POST /api/menu – lägg till ny produkt
router.post("/", authenticate, isAdmin, async (req, res) => {
  const { title, desc, price } = req.body;

  if (!title || !desc || typeof price !== "number") {
    return res.status(400).json({ message: "Alla fält krävs" });
  }

  const prodId = generatePrefixedId("prod");

  try {
    const product = await Menu.create({
      prodId,
      title,
      desc,
      price,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Produkt tillagd", product });
  } catch (err) {
    res.status(500).json({ message: "Fel vid skapande", error: err.message });
  }
});

// PUT /api/menu/:prodId – uppdatera produkt
router.put("/:prodId", authenticate, isAdmin, async (req, res) => {
  const { prodId } = req.params;
  const { title, desc, price } = req.body;

  if (!title || !desc || typeof price !== "number") {
    return res.status(400).json({ message: "title, desc, price krävs" });
  }

  try {
    const updated = await Menu.findOneAndUpdate(
      { prodId },
      { title, desc, price, modifiedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Produkt hittades inte" });
    }

    res.status(200).json({
      message: "Produkt uppdaterad",
      product: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Fel vid uppdatering", error: err.message });
  }
});

// DELETE /api/menu/:prodId – ta bort produkt
router.delete("/:prodId", authenticate, isAdmin, async (req, res) => {
  const { prodId } = req.params;

  try {
    const deleted = await Menu.findOneAndDelete({ prodId });

    if (!deleted) {
      return res.status(404).json({ message: "Produkten hittades inte" });
    }

    res.status(200).json({
      message: "Produkt raderad",
      product: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Fel vid radering", error: err.message });
  }
});

export default router;
