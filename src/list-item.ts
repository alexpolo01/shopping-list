import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './components/app-button.js';

@customElement('list-item')
export class ListItem extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
            .item-row {
                display: grid;
                grid-template-columns: 64px 1fr auto;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                border-bottom: 1px solid #eee;
            }
            img.thumb {
                width: 72px;
                height: 72px;
                object-fit: cover;
                border-radius: 8px;
                background: #f3f3f3;
            }
            .content {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }
            .content h2 {
                margin: 0;
                font-size: 1rem;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .content p {
                margin: 0;
                color: #555;
                font-size: 0.9rem;
                overflow: hidden;
                display: -webkit-box; 
                -webkit-box-orient: vertical;
            }
        `
    ];

    @property() item : any;

    private getIngredients = () => {
        const ingredients: string[] = [];
        const src = this.item ?? {};
        for (const key in src) {
            if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
            if (!key.startsWith('strIngredient')) continue;
            const v = src[key];
            if (typeof v === 'string') {
                const t = v.trim();
                if (t) ingredients.push(t);
            }
        }
        return ingredients;
    }

    render() {
        const {strDrinkThumb, strDrink, strInstructions} = this.item || {};
        
        return html`
        <div class="item-row">
            <img class="thumb" src=${strDrinkThumb} alt='thumbnail' width="64" height="64" />
            <div class="content">
                <h2>${strDrink}</h2>
                <p>${strInstructions}</p>
            </div>
            <app-button 
                .customEvent=${'add-to-cart'} 
                .data=${JSON.stringify({ item: this.item, ingredients: this.getIngredients() })}>
            Add to Cart
            </app-button>
        </div>
        `;
    }
}
