import { describe, expect, it } from 'vitest';
import { parseSitemap } from '../server/services/parse-sitemap';

describe('parseSitemap', () => {
  it('parses a urlset', () => {
    const result = parseSitemap(`<?xml version="1.0"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://example.com/</loc><lastmod>2026-09-01</lastmod></url>
        <url><loc>https://example.com/about</loc></url>
      </urlset>`);

    expect(result.type).toBe('urlset');
    if (result.type === 'urlset') {
      expect(result.urls).toHaveLength(2);
      expect(result.urls[0].lastModified).toBe('2026-09-01');
    }
  });

  it('parses a sitemap index', () => {
    const result = parseSitemap(`
      <sitemapindex>
        <sitemap><loc>https://example.com/posts.xml</loc></sitemap>
        <sitemap><loc>https://example.com/pages.xml</loc></sitemap>
      </sitemapindex>`);

    expect(result).toEqual({
      type: 'index',
      locations: ['https://example.com/posts.xml', 'https://example.com/pages.xml'],
    });
  });

  it('decodes XML entities in URLs', () => {
    const result = parseSitemap(`<urlset><url><loc>https://example.com/?a=1&amp;b=2</loc></url></urlset>`);
    if (result.type === 'urlset') expect(result.urls[0].url).toBe('https://example.com/?a=1&b=2');
  });
});
