import dotenv from "dotenv";
dotenv.config(); // 

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;



export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token saknas" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Ogiltig eller utgången token" });
  }
};

export const isAdmin = (req, res, next) => {
    
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Endast admin har tillgång" });
  }
  next();
};
