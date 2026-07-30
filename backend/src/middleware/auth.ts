import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    res.status(401).json({ error: "Invalid or expired token." });
    return;
  }

  req.userId = decoded.userId;
  next();
};
