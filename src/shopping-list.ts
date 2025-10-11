import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';  
import './shopping-list-item.ts';
import './components/app-button.js';

@customElement('shopping-list')
export class ShoppingList extends LitElement {
    static styles = [
        css`
            :host { display: block; }
            .header { 
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                gap: 12px;
                margin-right: 24px; 
            }
            h2 { margin: 0 0 8px; }
            ul { margin: 0; padding-left: 18px; }
            li { margin: 4px 0; }
        `
    ];

    @property({ type: Array }) items: string[] = [];
    
    private printList() {
        const items = Array.isArray(this.items) ? this.items : [];
        const overlayId = 'print-only';
        const existing = document.getElementById(overlayId);
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.padding = '24px';
        overlay.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';

        const titleEl = document.createElement('h1');
        titleEl.textContent = 'Shopping List';
        titleEl.style.margin = '0 0 12px';
        titleEl.style.fontSize = '20px';
        overlay.appendChild(titleEl);

        const ul = document.createElement('ul');
        ul.style.margin = '0';
        ul.style.paddingLeft = '20px';
        for (let i = 0; i < items.length; i++) {
            const li = document.createElement('li');
            li.textContent = `${i + 1}. ${items[i]}`;
            li.style.margin = '6px 0';
            ul.appendChild(li);
        }
        overlay.appendChild(ul);

        const style = document.createElement('style');
        style.setAttribute('data-print-style', '');
        style.textContent = `
@media screen { #${overlayId} { display: none; } }
@media print {
  body * { visibility: hidden !important; }
  #${overlayId}, #${overlayId} * { visibility: visible !important; }
  #${overlayId} { position: fixed; left: 0; top: 0; width: 100%; }
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

        // Fallback cleanup in case afterprint doesn't fire in some environments
        setTimeout(() => {
            if (document.head.contains(style)) cleanup();
        }, 5000);

        window.print();
    }

    render (){
        const noItems     = html`<p>No items yet</p>`;
        const itemList    = html`<div>${this.items.map((item, index) => html`<shopping-list-item .item=${item} .index=${index}></shopping-list-item>`)}</div>`;
        const printButton = html`<app-button 
                                    .customEvent=${'print-list'} 
                                    @print-list=${this.printList}
                                    ?disabled=${!(this.items?.length == 0)}>
                                Print
                                </app-button>`;

        return html`
        <div id="shopping-list-container">
            <div class="header">
                <h2>Shopping List</h2>
                ${printButton}
            </div>
            ${this.items?.length ? itemList : noItems}
        </div>
        `
    }
}