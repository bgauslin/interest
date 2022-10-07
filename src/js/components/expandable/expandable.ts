import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import shadowStyles from './expandable.scss';

/**
 * Custom element that expands/collapses a target element when its source
 * element is clicked.
 */
@customElement('expandable-drawer')
class Expandable extends LitElement {
  @query('.drawer') drawer: HTMLElement;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  private toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  private collapse() {
    const drawerHeight = `${this.drawer.scrollHeight / 16}rem`;
    window.requestAnimationFrame(() => {
      this.drawer.style.blockSize = drawerHeight;
      window.requestAnimationFrame(() => {
        this.drawer.style.blockSize = '0';
      });
    });
  }

  private expand() {
    const drawerHeight = `${this.drawer.scrollHeight / 16}rem`;
    this.drawer.style.blockSize = drawerHeight;
    this.drawer.addEventListener('transitionend', () => {
      this.drawer.style.blockSize = null;
    }, {once: true});
  }

  render() {
    const labelPrefix = this.open ? 'Hide' : 'Show';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        @click="${this.toggleOpen}">
        ${labelPrefix} <slot name="label"></slot>
      </button>
      <div
        aria-hidden="${!this.open}"
        class="drawer"
        id="drawer">
        <slot name="drawer"></slot>
      </div>
    `;
  }
}


