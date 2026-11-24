import { fileURLToPath } from 'node:url';
import express from 'express';
import { config } from './config.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authorRouter } from './routes/author.js';
import { loginRouter } from './routes/login.js';
import { tasksRouter } from './routes/tasks.js';

const app = express();

app.disable('x-powered-by');
app.set('strict routing', true);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }
  next();
});

app.get('/health/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/login/', loginRouter);

app.use('/api/', requireAuth, express.json({ limit: '32kb' }));
app.use('/api/author/', authorRouter);
app.use('/api/tasks/', tasksRouter);

const clientDist = fileURLToPath(new URL('../../dist/', import.meta.url));
app.use(express.static(clientDist));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
