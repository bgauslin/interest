import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Events} from '../../modules/shared';
import shadowStyles from './drawer.css';


/**
 * Web component that expands/collapses a drawer when a button is clicked.
 */
@customElement('interest-drawer') class Drawer extends LitElement {
  @property({reflect: true, type: Boolean}) open: boolean = false;
  
  @query('[aria-controls="drawer"]') button: HTMLButtonElement;
  @query('[id="drawer"]') drawer: HTMLDivElement;

  @state() drawerSize: string = '0';

  static styles = css`${shadowStyles}`;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  firstUpdated() {
    if (this.open) {
      this.drawerSize = null;
    }
  }

  private toggleDrawer() {
    if (this.open) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }

    this.open = !this.open;
    
    this.dispatchEvent(new CustomEvent(Events.Drawer, {
      detail: {
        drawer: this.open,
      }
    }));
  }

  private closeDrawer() {
    window.requestAnimationFrame(() => {
      this.drawerSize = this.getDrawerSize();
      window.requestAnimationFrame(() => this.drawerSize = '0');
    });
  }

  private openDrawer() {
    this.drawerSize = this.getDrawerSize();
    this.drawer.addEventListener('transitionend', () => {
      this.drawerSize = null;
    }, {once: true});
    this.button.blur();
  }

  private getDrawerSize(): string {
    return `${this.drawer.scrollHeight}px`;
  }

  protected render() {
    const label = this.open ? 'Hide table' : 'Show table';
    const style = this.drawerSize ? `--block-size: ${this.drawerSize}` : '';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        type="button"
        @click=${this.toggleDrawer}>${label}</button>
      <div
        id="drawer"
        style="${style}">
        <slot></slot>
      </div>
    `;
  }
}
