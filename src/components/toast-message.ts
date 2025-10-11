import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { virtual, useEffect } from '@pionjs/pion';

@customElement('toast-message')
export class ToastMessage extends LitElement {
  @property({ type: String }) message = '';
  @property({ type: Boolean, reflect: true }) open = !!this.message;

  static styles = css`
    :host {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 9999;
      pointer-events: none;
    }
    .toast {
      color: #000;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
      max-width: 360px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: auto;
    }
    :host([open]) .toast {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  private timer = virtual(() => {
    useEffect(() => {
      if (!this.message) return;
      const id = window.setTimeout(() => {
        this.message = '';
      }, 3000);
      return () => window.clearTimeout(id);
    }, [this.message]);
    return html``;
  });

  render() {
    return html`
      ${this.timer()}
      <div 
        class="toast" 
        style="display: ${this.message ? 'block' : 'none'};">
      ${this.message}
      </div>
    `;
  }
}

