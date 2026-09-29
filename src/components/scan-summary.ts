import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SitemapResult } from '../models/sitemap';

@customElement('scan-summary')
export class ScanSummary extends LitElement {
  @property({ attribute: false }) result?: SitemapResult;

  static styles = css`
    :host { display:block; }
    .summary {
      display:grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap:12px;
    }
    .stat {
      padding:18px;
      border:1px solid var(--outline, #d9dce3);
      border-radius:16px;
      background:white;
    }
    .label { color:#626772; font-size:.8rem; margin-bottom:6px; }
    .value { font-size:1.1rem; font-weight:700; overflow-wrap:anywhere; }
    @media (max-width:700px) { .summary { grid-template-columns:1fr; } }
  `;

  render() {
    if (!this.result) return null;
    return html`
      <div class="summary" aria-label="Sitemap discovery summary">
        <div class="stat"><div class="label">Pages</div><div class="value">${this.result.count}</div></div>
        <div class="stat"><div class="label">Sitemaps</div><div class="value">${this.result.sitemaps.length}</div></div>
        <div class="stat"><div class="label">Primary sitemap</div><div class="value">${this.result.sitemap ?? 'Not found'}</div></div>
      </div>
    `;
  }
}
