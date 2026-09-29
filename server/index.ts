import express from 'express';
import { sitemapRouter } from './routes/sitemap';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/sitemap', sitemapRouter);

app.listen(port, () => {
  console.log(`Sitemap Studio API listening on http://localhost:${port}`);
});
