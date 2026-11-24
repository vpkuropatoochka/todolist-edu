import type { NextFunction, Request, Response } from 'express';
import { AppError, isDatabaseError } from '../errors.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (isDatabaseError(err)) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
