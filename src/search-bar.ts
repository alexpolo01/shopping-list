import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './components/app-button.js';

@customElement('search-bar')
export class SearchBar extends LitElement {
    static styles = [
        css`
            :host {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            input[type="text"], input[type=text] {
                padding: 8px 12px;
                border: 1px solid #ccc;
                border-radius: 6px;
                font: inherit;
                box-sizing: border-box;
                outline: none;
            }
            input[type="text"]:focus, input[type=text]:focus {
                border-color: #999;
            }
        `
    ];

    @property() searchTerm = '';
    @property() isLoading = false;

    private onInput(e: Event) {
        this.searchTerm = (e.target as HTMLInputElement).value;
    }

    render() {
        return html`
        <input 
            type=text 
            placeholder="Search here.." 
            .value=${this.searchTerm} 
            @input=${this.onInput} 
        />
        <app-button 
            .customEvent=${'search'}
            .data=${this.searchTerm}
            ?disabled=${this.isLoading}>
        Search
        </app-button>
        `;
        
    }
}
