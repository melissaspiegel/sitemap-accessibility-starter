import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ModuleRegistry, AllCommunityModule, type ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-lit';
import type { SitemapUrl } from '../models/sitemap';

ModuleRegistry.registerModules([AllCommunityModule]);

@customElement('sitemap-grid')
export class SitemapGrid extends LitElement {
  @property({ attribute: false }) rows: SitemapUrl[] = [];

  private columns: ColDef<SitemapUrl>[] = [
    { field: 'url', headerName: 'URL', flex: 3, minWidth: 300, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'lastModified', headerName: 'Last modified', flex: 1, minWidth: 160 },
    { field: 'sourceSitemap', headerName: 'Source sitemap', flex: 2, minWidth: 240 },
  ];

  static styles = css`
    :host { display:block; }
    .grid { height: 560px; width:100%; }
  `;

  render() {
    return html`
      <div class="ag-theme-quartz grid">
        <ag-grid-lit
          .rowData=${this.rows}
          .columnDefs=${this.columns}
          .pagination=${true}
          .paginationPageSize=${25}
          .rowSelection=${'multiple'}
        ></ag-grid-lit>
      </div>
    `;
  }
}
