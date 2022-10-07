import {LitElement, css, html} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import shadowStyles from './drawer.scss';

/**
 * Custom element that expands/collapses a drawer when a button is clicked.
 */
@customElement('app-drawer')
class Drawer extends LitElement {
  @property({attribute: 'label'}) label = '';
  @query('.drawer') drawer: HTMLElement;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  connectedCallback() {
    super.connectedCallback();
    this.setupDrawer();
  }

  private async setupDrawer() {
    await this.updateComplete;
    if (!this.open) {
      this.drawer.style.blockSize = '0';
    }
  }

  private toggleDrawer() {
    if (this.open) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
    this.open = !this.open;
  }

  private closeDrawer() {
    window.requestAnimationFrame(() => {
      const drawerHeight = this.drawer.scrollHeight;
      this.drawer.style.blockSize = `${drawerHeight / 16}rem`;
      window.requestAnimationFrame(() => {
        this.drawer.style.blockSize = '0';
      });
    });
  }

  private openDrawer() {
    const drawerHeight = this.drawer.scrollHeight;
    this.drawer.style.blockSize = `${drawerHeight / 16}rem`;
    this.drawer.addEventListener('transitionend', () => {
      this.drawer.style.blockSize = null;
    }, {once: true});
  }

  render() {
    const action = this.open ? 'Hide' : 'Show';
    const buttonLabel = `${action} ${this.label}`;
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        @click="${this.toggleDrawer}">${buttonLabel}</button>
      <div class="drawer" id="drawer">
        <slot></slot>
      </div>
    `;
  }
}
