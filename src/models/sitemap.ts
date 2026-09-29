export interface SitemapUrl {
  url: string;
  lastModified?: string;
  sourceSitemap?: string;
}

export interface SitemapResult {
  site: string;
  sitemap: string | null;
  sitemaps: string[];
  count: number;
  urls: SitemapUrl[];
}
