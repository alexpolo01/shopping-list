import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { virtual, useEffect } from '@pionjs/pion';
import './search-bar.ts';
import './list-item.ts';
import './shopping-list.ts';
import './components/toast-message.ts';

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

@customElement('lit-app')
export class LitApp extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
            .app {
                display: grid;
                grid-template-rows: auto 1fr;
                gap: 16px;
            }
            .search-bar-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            .status {
                margin: 0;
                color: #555;
                font-size: 0.95rem;
            }
            .main-content {
                display: grid;
                grid-template-columns: 60% 39%;
                gap: 16px;
                align-items: start;
            }
            .drinks-container {
                display: grid;
                gap: 8px;
            }
            .sidebar {
                border-left: 1px solid #eee;
                padding-left: 12px;
                height:100%;
            }
            .status{
                position: relative;
                bottom:0;
                right:0
            }
        `
    ];

    @property({type: String})   searchTerm = '';
    @property({type: Array})    foundList: any[] = [];
    @state()                    isLoading = false;
    @property()                 message = '';
    @property({type: Array})    shoppingList: string[] = [];

    private effects = virtual(() => {
        useEffect(() => {
            if (!this.isLoading) return;

            const fetchData = async () => {
                try {
                    this.message = 'Searching...';
                    const response = await fetch(`${BASE_URL}${this.searchTerm}`);
                    const data = await response.json();
                    this.foundList = data?.drinks ?? [];
                    this.message = this.foundList.length > 0 ? 'Here are the results.' : 'No results found.';
                } catch (error: any) {
                    this.message = error?.message || 'An error occurred';
                    if (error?.name !== 'AbortError') {
                        this.message = 'Failed to fetch data';
                    }
                } finally {
                    this.isLoading = false;
                }
            };

            fetchData();
        }, [this.isLoading, this.searchTerm]);
    });

    private handleSearch = (e: CustomEvent<string>) => {
        if(!e.detail) return;
        this.searchTerm = e.detail;
        this.isLoading = true;
    };

    private handleAddToCart = (e: CustomEvent<string>) => {
        const incoming = JSON.parse(e.detail)?.ingredients ?? [];
        if (!incoming.length) return;
        for (const ing of incoming) {
            const value = (ing || '').trim();
            if (value) this.shoppingList = [...this.shoppingList, value];
        }
        this.shoppingList = [...new Set(this.shoppingList) as unknown as string[]];
        this.message = 'Ingredient added to shopping list';
    };

    private removeShoppingCartItem = (e: CustomEvent<number>) => {
        const index = e.detail;
        if (index < 0 || index >= this.shoppingList.length) return;
        this.shoppingList = this.shoppingList.filter((_, i) => i !== index);
        this.message = 'Ingredient removed from shopping list';
    };

    render() {
        const filteredDrinkList = this.foundList?.length > 0 
                ? this.foundList.map((item: any) => html`<list-item .item=${item}></list-item>`) 
                : html`<p>${this.message}</p>`

        return html`
        ${this.effects()}
        <div class="app">
            <div class="search-bar-container">
                <search-bar
                    .searchTerm=${this.searchTerm}
                    .isLoading=${this.isLoading}
                    @search=${this.handleSearch}
                ></search-bar>
            </div>
            <div class="main-content">
                <div class="drinks-container" @add-to-cart=${this.handleAddToCart}>
                    ${filteredDrinkList}
                </div>
                <aside class="sidebar" @remove-item=${this.removeShoppingCartItem}>
                    <shopping-list .items=${this.shoppingList}></shopping-list>
                    <toast-message 
                        .message=${this.message} 
                        .open=${!!this.message}
                    </toast-message>
                </aside>
            </div>
        </div>
        `;
    }
}
