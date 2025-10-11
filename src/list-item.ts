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
                padding-left:12px;
            }
            .content h2 {
                margin: 0;
                font-size: 1rem;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .steps {
                margin: 0;
                padding-left: 1rem;
                color: #555;
                font-size: 0.9rem;
            }
            .steps li { 
                margin: 2px 0; 
                line-height: 1.3;
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

    private getInstructionSteps(instr?: string): string[] {
        if (!instr || typeof instr !== 'string') return [];
        const text = instr.replace(/\s+/g, ' ').trim();
        if (!text) return [];
        const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
        return parts.map(s => s.trim())
    }

    render() {
        const {strDrinkThumb, strDrink, strInstructions} = this.item || {};
        const steps = this.getInstructionSteps(strInstructions);
        
        return html`
        <div class="item-row">
            <img class="thumb" src=${strDrinkThumb} alt='thumbnail' width="64" height="64" />
            <div class="content">
                <h2>${strDrink}</h2>
                ${steps.length
                    ? html`<ol class="steps">${steps.map(s => html`<li>${s}</li>`)}</ol>`
                    : html``}
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
