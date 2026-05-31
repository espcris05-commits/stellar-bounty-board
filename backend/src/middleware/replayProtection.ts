import { Request, Response, NextFunction } from "express";

const usedNonces = new Set<string>();
const NONCE_TTL_MS = 300000; // 5 minutes

// Cleanup old nonces every minute
setInterval(() => usedNonces.clear(), 60000);

export function replayProtection(req: Request, res: Response, next: NextFunction): void {
  const nonce = req.headers["x-nonce"] as string;
  const timestamp = parseInt(req.headers["x-timestamp"] as string, 10);
  
  if (!nonce || !timestamp) {
    next();
    return;
  }
  
  // Check timestamp freshness
  if (Date.now() - timestamp > NONCE_TTL_MS) {
    res.status(400).json({ error: "Request expired" });
    return;
  }
  
  // Check nonce reuse
  if (usedNonces.has(nonce)) {
    res.status(400).json({ error: "Nonce already used" });
    return;
  }
  
  usedNonces.add(nonce);
  next();
}
