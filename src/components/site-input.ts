import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import 'mdui/components/text-field.js';
import 'mdui/components/button.js';

@customElement('site-input')
export class SiteInput extends LitElement {
  @property({ type: Boolean }) loading = false;
  @state() private value = '';

  static styles = css`
    :host { display: block; }
    form {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: start;
    }
    mdui-text-field { width: 100%; }
    mdui-button { min-height: 56px; }
    @media (max-width: 640px) {
      form { grid-template-columns: 1fr; }
    }
  `;

  private submit(event: Event) {
    event.preventDefault();
    const url = this.value.trim();
    if (!url || this.loading) return;
    this.dispatchEvent(new CustomEvent('discover', {
      detail: { url },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <form @submit=${this.submit}>
        <mdui-text-field
          label="Website URL"
          placeholder="https://example.com"
          type="url"
          autocomplete="url"
          .value=${this.value}
          @input=${(e: Event) => this.value = (e.target as HTMLInputElement).value}
          required
        ></mdui-text-field>
        <mdui-button type="submit" variant="filled" ?disabled=${this.loading}>
          ${this.loading ? 'Discovering…' : 'Find sitemap'}
        </mdui-button>
      </form>
    `;
  }
}
