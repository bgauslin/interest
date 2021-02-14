const EMPTY_ATTR: string = 'empty';
const HIDDEN_ATTR: string = 'hidden';
const SOURCE_ATTR: string = 'source';
const TARGET_ATTR: string = 'target';

/**
 * Observes a source element for toggling the visibility of target elements.
 */
export class VisibilityToggle extends HTMLElement {
  private observer: MutationObserver;
  private source: HTMLElement;
  private targets: NodeList;
  
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.toggleVisibility());
  }

  connectedCallback() {
    this.setup();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  private setup() {
    this.source = document.querySelector(this.getAttribute(SOURCE_ATTR));
    this.targets = document.querySelectorAll(this.getAttribute(TARGET_ATTR));

    this.observer.observe(this.source, {attributes: true});
    this.toggleVisibility();

    [SOURCE_ATTR, TARGET_ATTR].forEach((attr) => this.removeAttribute(attr));
  }

  private toggleVisibility() {
    for (const target of this.targets) {
      const el = target as HTMLElement;
      if (this.source.hasAttribute(EMPTY_ATTR)) {
        el.setAttribute(HIDDEN_ATTR, '');
      } else {
        el.removeAttribute(HIDDEN_ATTR);
      }
    }
  }
}

customElements.define('visibility-toggle', VisibilityToggle);