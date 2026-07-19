import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { healthRouter } from './routes/health.js';
import { moviesRouter } from './routes/movies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', healthRouter);
  app.use('/api', moviesRouter);

  if (process.env.NODE_ENV === 'production') {
    const clientDist = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientDist));

    app.get('*', (request, response) => {
      if (request.path.startsWith('/api')) {
        response.status(404).json({ error: 'API route not found.' });
        return;
      }

      response.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found.' });
  });

  return app;
}
