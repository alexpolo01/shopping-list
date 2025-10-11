import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';  
import './components/app-button.js';

@customElement('shopping-list-item')
export class ShoppingListItem extends LitElement {
    static styles = [
        css`
            :host { display: block; }
            h2 { margin: 0 0 8px; }
            ul { margin: 0; padding-left: 18px; }
            li { margin: 4px 0; }

            div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top:8px;
                margin-right: 24px;
            }

            div:hover { background: #f9f9f9;}
       `
    ];

    @property() item = '';
    @property() index = 0;

    render (){
        return html`<div>
            <span>${this.index+1}. ${this.item}</span>
            <app-button 
                .customEvent=${'remove-item'} 
                .data=${this.index}>
            Remove
            </app-button>
        </div>`;
    }
}