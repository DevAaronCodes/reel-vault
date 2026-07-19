import dotenv from 'dotenv';
import path from 'node:path';
import { createApp } from './app.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const port = Number(process.env.PORT ?? 3000);

if (process.env.NODE_ENV === 'production' && !process.env.TMDB_API_TOKEN) {
  throw new Error('TMDB_API_TOKEN must be configured.');
}

const app = createApp();

app.listen(port, () => {
  console.log(`MovieShelf server listening on port ${port}`);
});
