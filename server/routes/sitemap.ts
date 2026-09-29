import { Router } from 'express';
import { discoverSitemap } from '../services/discover-sitemap';

export const sitemapRouter = Router();

sitemapRouter.post('/', async (req, res) => {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  if (!url) return res.status(400).json({ error: 'A website URL is required.' });

  try {
    const result = await discoverSitemap(url);
    res.json(result);
  } catch (error) {
    res.status(422).json({
      error: error instanceof Error ? error.message : 'Unable to discover sitemap.',
    });
  }
});
