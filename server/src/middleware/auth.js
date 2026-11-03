import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export async function protect(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.active) return res.status(401).json({ message: "Account unavailable" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};
