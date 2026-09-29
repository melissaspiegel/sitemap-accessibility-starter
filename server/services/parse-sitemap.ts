export type ParsedSitemap =
  | { type: 'index'; locations: string[] }
  | { type: 'urlset'; urls: Array<{ url: string; lastModified?: string }> };

function decodeXml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function tag(block: string, name: string): string | undefined {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match?.[1]?.trim() ? decodeXml(match[1].trim()) : undefined;
}

export function parseSitemap(xml: string): ParsedSitemap {
  if (/<sitemapindex[\s>]/i.test(xml)) {
    const blocks = [...xml.matchAll(/<sitemap(?:\s[^>]*)?>([\s\S]*?)<\/sitemap>/gi)];
    return {
      type: 'index',
      locations: blocks.map((m) => tag(m[1], 'loc')).filter((v): v is string => Boolean(v)),
    };
  }

  if (/<urlset[\s>]/i.test(xml)) {
    const blocks = [...xml.matchAll(/<url(?:\s[^>]*)?>([\s\S]*?)<\/url>/gi)];
    return {
      type: 'urlset',
      urls: blocks.flatMap((m) => {
        const url = tag(m[1], 'loc');
        if (!url) return [];
        return [{ url, lastModified: tag(m[1], 'lastmod') }];
      }),
    };
  }

  throw new Error('The discovered file is not a supported XML sitemap.');
}
