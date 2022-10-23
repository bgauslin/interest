import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import shadowStyles from './drawer.scss';

/**
 * Custom element that expands/collapses a drawer when a button is clicked.
 */
@customElement('app-drawer')
class Drawer extends LitElement {
  @query('[aria-controls="drawer"]') button: HTMLButtonElement;
  @query('[id="drawer"]') drawer: HTMLDivElement;

  @state() drawerSize = '0';
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

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
    return `${this.drawer.scrollHeight / 16}rem`;
  }

  render() {
    const label = this.open ? 'Hide table' : 'Show table';
    const style = this.drawerSize ? `block-size: ${this.drawerSize}` : '';
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
