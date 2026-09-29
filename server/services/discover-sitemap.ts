import { parseSitemap } from './parse-sitemap';

export interface DiscoveredUrl {
  url: string;
  lastModified?: string;
  sourceSitemap?: string;
}

const MAX_SITEMAPS = 100;
const MAX_URLS = 10_000;

function normalizeSite(input: string): URL {
  const value = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.');
  return url;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'user-agent': 'SitemapStudio/0.1 (+public sitemap discovery)' },
    signal: AbortSignal.timeout(12_000),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
  return response.text();
}

function sitemapUrlsFromRobots(robots: string): string[] {
  return robots
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*sitemap\s*:\s*(.+?)\s*$/i)?.[1])
    .filter((value): value is string => Boolean(value));
}

export async function discoverSitemap(input: string) {
  const site = normalizeSite(input);
  const origin = site.origin;
  const candidates: string[] = [];

  try {
    const robots = await fetchText(new URL('/robots.txt', origin).toString());
    candidates.push(...sitemapUrlsFromRobots(robots));
  } catch {
    // robots.txt is optional.
  }

  candidates.push(
    new URL('/sitemap.xml', origin).toString(),
    new URL('/sitemap_index.xml', origin).toString(),
  );

  const uniqueCandidates = [...new Set(candidates)];
  let primary: string | null = null;
  const visited = new Set<string>();
  const rows = new Map<string, DiscoveredUrl>();

  async function walk(sitemapUrl: string): Promise<boolean> {
    if (visited.has(sitemapUrl) || visited.size >= MAX_SITEMAPS || rows.size >= MAX_URLS) return false;
    visited.add(sitemapUrl);

    let xml: string;
    try {
      xml = await fetchText(sitemapUrl);
    } catch {
      return false;
    }

    let parsed;
    try {
      parsed = parseSitemap(xml);
    } catch {
      return false;
    }

    if (parsed.type === 'index') {
      for (const child of parsed.locations) {
        if (rows.size >= MAX_URLS) break;
        await walk(new URL(child, sitemapUrl).toString());
      }
      return true;
    }

    for (const item of parsed.urls) {
      if (rows.size >= MAX_URLS) break;
      try {
        const normalized = new URL(item.url, sitemapUrl).toString();
        if (!rows.has(normalized)) {
          rows.set(normalized, { ...item, url: normalized, sourceSitemap: sitemapUrl });
        }
      } catch {
        // Ignore malformed sitemap entries.
      }
    }
    return true;
  }

  for (const candidate of uniqueCandidates) {
    const before = rows.size;
    const valid = await walk(candidate);
    if (valid && primary === null) primary = candidate;
    if (rows.size > before || valid) break;
  }

  if (!primary) {
    throw new Error('No readable sitemap was found in robots.txt, /sitemap.xml, or /sitemap_index.xml.');
  }

  return {
    site: origin,
    sitemap: primary,
    sitemaps: [...visited],
    count: rows.size,
    urls: [...rows.values()],
  };
}
