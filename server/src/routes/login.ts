import { Router } from 'express';
import { config } from '../config.js';

export const loginRouter = Router();

loginRouter.get('/', (_req, res) => {
  res.type('text/plain').send(config.userLogin);
});
