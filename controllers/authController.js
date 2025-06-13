import dotenv from "dotenv";
dotenv.config(); 

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByUsername } from "../services/userService.js";

const JWT_SECRET = process.env.JWT_SECRET;



export const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Alla fält krävs" });
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: "Användarnamn redan taget" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, password: hashedPassword, role });

  res.status(201).json({ message: "Användare skapad", userId: newUser._id });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Felaktigt användarnamn eller lösenord" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Felaktigt användarnamn eller lösenord" });
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
};

export const logout = async (req, res) => {
  res.status(200).json({ message: "Utloggning lyckades" });
};
