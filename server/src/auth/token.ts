import { timingSafeEqual } from 'node:crypto';
import { config } from '../config.js';

const expected = Buffer.from(config.apiToken);

export function isValidAccessToken(token: string): boolean {
  const provided = Buffer.from(token);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
