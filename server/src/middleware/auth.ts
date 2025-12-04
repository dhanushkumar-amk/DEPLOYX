import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Unauthorized" });

    const token = header.split(" ")[1];

    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) return res.status(401).json({ error: "Token expired" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;

    next();
  } catch (err: any) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
