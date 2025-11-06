import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {Events, STORAGE_ITEM} from '../../modules/shared';
import shadowStyles from './drawer.scss';


/**
 * Web component that expands/collapses a drawer when a button is clicked.
 */
@customElement('interest-drawer')
class Drawer extends LitElement {
  @query('[aria-controls="drawer"]') button: HTMLButtonElement;
  @query('[id="drawer"]') drawer: HTMLDivElement;
  @state() drawerSize: string = '0';
  @state() open: boolean = false;

  static styles = css`${shadowStyles}`;

  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
    this.sendDrawerState();
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) {
      return;
    }

    if (storage.drawer) {
      this.open = storage.drawer;
      if (this.open) {
        this.drawerSize = null;
      }
    }
  }

  private toggleDrawer() {
    if (this.open) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
    this.open = !this.open;
    this.sendDrawerState();
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

  private sendDrawerState() {
    this.dispatchEvent(new CustomEvent(Events.Drawer, {
      bubbles: true,
      composed: true,
      detail: {
        drawer: this.open,
      }
    }));
  }

  protected render() {
    const label = this.open ? 'Hide table' : 'Show table';
    const style = this.drawerSize ? `--block-size: ${this.drawerSize}` : '';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        type="button"
        @click="${this.toggleDrawer}">${label}</button>
      <div id="drawer" style="${style}">
        <slot></slot>
      </div>
    `;
  }
}
