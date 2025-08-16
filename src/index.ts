import express from 'express';
import { apiRoute } from './routes/api/index.route.js';
import { docsRoute } from './routes/docs.route.js';
import z from 'zod';
import { env } from './env/env.js';
import { ratelimit } from './middleware/ratelimit.middleware.js';

try {
  await import('dotenv/config');
} catch {
  /* */
}

const app = express();

if (env.TRUST_PROXY) {
  app.enable('trust proxy');
}

z.config({
  customError: iss => {
    switch (iss.code) {
      case 'invalid_type':
        return `Invalid type for ${iss.path}, expected ${iss.expected}`;
    }
    return undefined;
  }
});

app.use('/docs', docsRoute);

app.use('/api/v1/', ratelimit, apiRoute);

app.get('/', (req, res) => {
  res.json({
    message: `Welcome to OpenBoard! For documentation, visit ${req.protocol}://${req.host}/docs`
  });
});

app.use((req, res, _next) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Internal server error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
);

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT}/`);
});
