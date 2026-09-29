import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import 'mdui/mdui.css';
import './components/site-input';
import './components/scan-summary';
import './components/sitemap-grid';
import { discoverSitemap } from './services/sitemap-api';
import type { SitemapResult } from './models/sitemap';

@customElement('sitemap-app')
export class SitemapApp extends LitElement {
  @state() private result?: SitemapResult;
  @state() private loading = false;
  @state() private error = '';

  static styles = css`
    :host {
      --ink:#17191f;
      --muted:#666d7a;
      --surface:#ffffff;
      --outline:#dfe3ea;
      display:block;
      min-height:100vh;
      color:var(--ink);
      background:#f5f6f8;
      font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing:border-box; }
    main { max-width:1200px; margin:0 auto; padding:64px 24px 80px; }
    .eyebrow { font-size:.78rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#5f6470; }
    h1 { max-width:760px; margin:10px 0 12px; font-size:clamp(2.4rem,6vw,5.2rem); line-height:.96; letter-spacing:-.055em; }
    .lede { max-width:680px; color:var(--muted); font-size:1.08rem; line-height:1.65; margin-bottom:32px; }
    .panel { background:var(--surface); border:1px solid var(--outline); border-radius:24px; padding:24px; box-shadow:0 14px 40px rgba(22,28,45,.06); }
    scan-summary { margin:20px 0; }
    .results { margin-top:24px; }
    .results-head { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:12px; }
    .results h2 { margin:0; font-size:1.35rem; }
    .count { color:var(--muted); }
    .error { margin-top:16px; padding:14px 16px; border-radius:12px; background:#fff0f0; color:#8d1c1c; border:1px solid #f1c7c7; }
  `;

  private async discover(event: CustomEvent<{url: string}>) {
    this.loading = true;
    this.error = '';
    this.result = undefined;
    try {
      this.result = await discoverSitemap(event.detail.url);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Something went wrong.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <main>
        <div class="eyebrow">Sitemap Studio</div>
        <h1>See every page hiding in a website.</h1>
        <p class="lede">
          Enter a public website. We’ll discover its sitemap, follow sitemap indexes,
          deduplicate the URLs, and give you a clean list ready for the accessibility scanner.
        </p>

        <section class="panel">
          <site-input .loading=${this.loading} @discover=${this.discover}></site-input>
          ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : null}
          ${this.result ? html`
            <scan-summary .result=${this.result}></scan-summary>
            <div class="results">
              <div class="results-head">
                <h2>Discovered URLs</h2>
                <span class="count">${this.result.count.toLocaleString()} pages</span>
              </div>
              <sitemap-grid .rows=${this.result.urls}></sitemap-grid>
            </div>
          ` : null}
        </section>
      </main>
    `;
  }
}
