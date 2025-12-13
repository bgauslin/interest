import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {Events} from '../../modules/shared';
import shadowStyles from './drawer.css';


/**
 * Web component that expands/collapses a drawer when a button is clicked.
 */
@customElement('interest-drawer') class Drawer extends LitElement {
  @property({reflect: true, type: Boolean}) open: boolean = false;
  
  @query('button') button: HTMLButtonElement;
  @query('div') drawer: HTMLDivElement;

  @state() drawerSize: string = '0';

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    if (this.open) {
      this.drawerSize = null;
    }
  }

  private toggleDrawer() {
    const drawerSize = () => `${this.drawer.scrollHeight}px`;

    if (this.open) {
      window.requestAnimationFrame(() => {
        this.drawerSize = drawerSize();
        window.requestAnimationFrame(() => this.drawerSize = '0');
      });
    } else {
      this.drawerSize = drawerSize();
      this.drawer.addEventListener(Events.TransitionEnd, () => {
        this.drawerSize = null;
      }, {once: true});
      this.button.blur();
    }

    this.open = !this.open;
    
    this.dispatchEvent(new CustomEvent(Events.Drawer, {
      detail: {
        drawer: this.open,
      }
    }));
  }

  protected render() {
    const style = this.drawerSize ? `--block-size: ${this.drawerSize}` : '';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        type="button"
        @click=${this.toggleDrawer}>
        <slot
          name="open"
          ?hidden=${!this.open}></slot>
        <slot
          name="closed"
          ?hidden=${this.open}></slot>
      </button>
      <div
        id="drawer"
        style="${style}">
        <slot name="content"></slot>
      </div>
    `;
  }

  // Shadow DOM stylesheet.
  static styles = css`${shadowStyles}`;
}
