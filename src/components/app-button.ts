import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [
		css`
			:host {
				display: inline-block;
			}
			button {
				padding: 8px 12px;
				border: 1px solid #ccc;
				border-radius: 6px;
				background: #fff;
				cursor: pointer;
				color: inherit;
				font: inherit;
			}
			button:hover {
				background: #f7f7f7;
			}
			button:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		`,
	];

	@property() disabled = false;
	@property() customEvent: string = '';
	@property() data = '';

    private handleClick = (e: MouseEvent) => {
        if (this.disabled){
			e.preventDefault();
			return;
		} 
		
		this.dispatchEvent(new CustomEvent<string>(this.customEvent, {
			detail: this.data,
			bubbles: true,
			composed: true,
		}));
    };

	render() {
		return html`
            <button 
                type="button" 
                ?disabled=${this.disabled} 
                @click=${this.handleClick}>
				<slot></slot>
			</button>
		`;
	}
}



