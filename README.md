# Sitemap Studio

A small web app for discovering every public URL exposed by a site's XML sitemap.

This is Milestone 1 of an accessibility-scanning product:

**website → sitemap discovery → URL inventory → accessibility scanning**

## Stack

- Lit
- TypeScript
- Vite
- MDUI 2
- AG Grid Community
- Express
- Vitest

## What works

- Enter a website URL
- Reads `robots.txt` for `Sitemap:` declarations
- Falls back to `/sitemap.xml` and `/sitemap_index.xml`
- Follows sitemap indexes recursively
- Deduplicates URLs
- Displays URLs in AG Grid
- Pagination and row selection
- Captures `<lastmod>` when present
- Basic unit tests for sitemap parsing

## Run locally

Requires a current Node.js installation.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Vite runs the frontend on port `5173`.
Express runs the API on port `3001`.
Vite proxies `/api/*` to the Express server.

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## API

### POST `/api/sitemap`

Request:

```json
{
  "url": "https://example.com"
}
```

Response shape:

```json
{
  "site": "https://example.com",
  "sitemap": "https://example.com/sitemap.xml",
  "sitemaps": ["https://example.com/sitemap.xml"],
  "count": 2,
  "urls": [
    {
      "url": "https://example.com/",
      "lastModified": "2026-09-01",
      "sourceSitemap": "https://example.com/sitemap.xml"
    }
  ]
}
```

## Next milestone: accessibility scanning

Add a scan endpoint and worker that accepts selected URLs, queues them, runs Pa11y in Chromium, and stores normalized WCAG results.

Suggested progression:

1. Add `POST /api/scans`
2. Create scan/job models
3. Add a worker queue
4. Run Pa11y per URL
5. Add status/error/warning columns to AG Grid
6. Add a URL detail drawer
7. Persist sites and scan history
8. Add accounts and scheduled scans only after the scanning workflow is solid

## Production safety TODO

Before allowing arbitrary public users to submit URLs, add SSRF protection. At minimum, resolve hostnames server-side and reject localhost, loopback, link-local, private network ranges, cloud metadata endpoints, and redirects into those ranges. Also add rate limits, request-size limits, concurrency limits, and per-user scan quotas.

The starter intentionally caps sitemap traversal at 100 sitemap files and 10,000 URLs.

## Deployment note

The frontend can be deployed as static assets, but the sitemap discovery endpoint needs a server runtime because browser-side cross-origin sitemap fetching is often blocked by CORS.

When Pa11y/Puppeteer is added, use a host/container that supports Chromium rather than assuming a static/serverless frontend host can run it reliably.
