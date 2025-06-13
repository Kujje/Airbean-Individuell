import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { generatePrefixedId } from "../utils/IdGenerator.js";
import { createUser, findUserByUsername } from "../services/user.js";
import { validateAuthBody } from "../middlewares/validators.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", validateAuthBody, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Användarnamnet är redan taget" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generatePrefixedId("user");

    const newUser = await createUser({
      userId,
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "Användare skapad",
      userId: newUser.userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Fel vid registrering", error: err.message });
  }
});

// LOGIN
router.post("/login", validateAuthBody, async (req, res) => {
  const { username, password, continueAsGuest } = req.body;

  if (continueAsGuest) {
    const guestId = generatePrefixedId("guest");
    const token = jwt.sign({ userId: guestId, role: "guest" }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Fortsätter som gäst",
      token,
    });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Felaktigt användarnamn eller lösenord" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Felaktigt användarnamn eller lösenord" });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inloggning lyckades",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Fel vid inloggning", error: err.message });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  res.json({ message: "Utloggning lyckades!" });
});

export default router;
