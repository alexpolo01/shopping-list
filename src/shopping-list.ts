import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './shopping-list-item.ts';
import './components/app-button.js';

@customElement('shopping-list')
export class ShoppingList extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-right:24px;
            }
            h2 {
                margin: 0 0 8px;
            }
        `,
    ];

    @property({ type: Array }) items: string[] = [];

    render() {
        return html`
            <div class="header">
                <h2>Shopping List</h2>
                <app-button
                    .customEvent=${'print-list'}
                    @print-list=${this.printList}
                    ?disabled=${!(this.items?.length > 0)}
                    >
                Print
                </app-button>
            </div>
            ${this.items?.length
                ? html`<div>
                        ${this.items.map(
                            (item, index) =>
                                html`<shopping-list-item .item=${item} .index=${index}></shopping-list-item>`
                        )}
                    </div>`
                : html`<p>No items yet</p>`}
        `;
    }

    private printList = () => {
        const id = 'print-only-overlay';
        const previous = document.getElementById(id);
        if (previous) previous.remove();

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';

        const h1 = document.createElement('h1');
        h1.textContent = 'Shopping List';
        h1.style.margin = '0 0 12px';
        h1.style.fontSize = '20px';
        overlay.appendChild(h1);

        const ul = document.createElement('ul');
        ul.style.margin = '0';
        ul.style.paddingLeft = '20px';
        (this.items || []).forEach((item, idx) => {
            const li = document.createElement('li');
            li.textContent = `${idx + 1}. ${item}`;
            li.style.margin = '6px 0';
            ul.appendChild(li);
        });
        overlay.appendChild(ul);

        const style = document.createElement('style');
        style.setAttribute('data-print-style', '');
        style.textContent = `
                @media screen { #${id} { display: none; } }
                @media print {
                    body * { visibility: hidden !important; }
                    #${id}, #${id} * { visibility: visible !important; }
                    #${id} { position: fixed; inset: 0; padding: 24px; background: white; }
                }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        const cleanup = () => {
            style.remove();
            overlay.remove();
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup, { once: true });

        setTimeout(() => {
            if (document.head.contains(style)) cleanup();
        }, 5000);

        requestAnimationFrame(() => {
            setTimeout(() => window.print(), 0);
        });
    };
}