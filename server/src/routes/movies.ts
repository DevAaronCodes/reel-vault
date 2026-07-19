import { Router } from 'express';
import {
  MissingTmdbTokenError,
  searchMovies,
  UpstreamMovieServiceError
} from '../services/tmdbService.js';

export const moviesRouter = Router();

moviesRouter.get('/movies/search', async (request, response) => {
  const rawQuery = request.query.query;

  if (typeof rawQuery !== 'string') {
    response.status(400).json({ error: 'A non-empty query parameter is required.' });
    return;
  }

  const query = rawQuery.trim();
  if (!query) {
    response.status(400).json({ error: 'A non-empty query parameter is required.' });
    return;
  }

  try {
    const results = await searchMovies(query);
    response.json({ results });
  } catch (error) {
    if (error instanceof MissingTmdbTokenError) {
      response.status(500).json({ error: 'Movie search is not configured.' });
      return;
    }

    if (error instanceof UpstreamMovieServiceError) {
      response.status(502).json({ error: 'Movie search service is temporarily unavailable.' });
      return;
    }

    response.status(500).json({ error: 'Movie search failed.' });
  }
});
