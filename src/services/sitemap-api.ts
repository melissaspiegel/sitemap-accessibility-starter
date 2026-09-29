import type { SitemapResult } from '../models/sitemap';

export async function discoverSitemap(url: string): Promise<SitemapResult> {
  const response = await fetch('/api/sitemap', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Unable to discover sitemap.');
  }

  return data;
}
