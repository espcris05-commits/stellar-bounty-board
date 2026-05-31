import { Request, Response, NextFunction } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers["x-api-key"] as string;
  const expected = process.env.ADMIN_API_KEY;
  
  if (!expected) {
    res.status(500).json({ error: "ADMIN_API_KEY not configured" });
    return;
  }
  
  if (apiKey !== expected) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }
  
  next();
}
