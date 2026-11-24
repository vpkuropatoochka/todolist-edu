import type { NextFunction, Request, Response } from 'express';
import { isValidAccessToken } from '../auth/token.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token || !isValidAccessToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
