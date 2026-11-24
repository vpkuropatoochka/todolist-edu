import { Router } from 'express';
import { config } from '../config.js';

export const authorRouter = Router();

authorRouter.get('/', (_req, res) => {
  res.json({
    login: config.userLogin,
    fullName: config.userFullName,
  });
});
