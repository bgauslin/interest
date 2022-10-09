import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import shadowStyles from './drawer.scss';

/**
 * Custom element that expands/collapses a drawer when a button is clicked.
 */
@customElement('interest-drawer')
class Drawer extends LitElement {
  @query('#drawer') drawer: HTMLElement;
  @state() drawerHeight = '0';
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
      this.drawerHeight = this.getDrawerHeight();
      window.requestAnimationFrame(() => this.drawerHeight = '0');
    });
  }

  private openDrawer() {
    this.drawerHeight = this.getDrawerHeight();
    this.drawer.addEventListener('transitionend', () => {
      this.drawerHeight = null;
    }, {once: true});
  }

  private getDrawerHeight(): string {
    return `${this.drawer.scrollHeight / 16}rem`;
  }

  render() {
    const buttonLabel = this.open ? 'Hide table' : 'Show table';
    const style = this.drawerHeight ? `block-size: ${this.drawerHeight}` : '';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        @click="${this.toggleDrawer}">${buttonLabel}</button>
      <div id="drawer" style="${style}">
        <slot></slot>
      </div>
    `;
  }
}
