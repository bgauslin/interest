const EMPTY_ATTR: string = 'empty';
const HIDDEN_ATTR: string = 'hidden';
const SOURCE_ATTR: string = 'source';
const TARGET_ATTR: string = 'target';

/**
 * Observes a source element for toggling the visibility of target elements.
 */
class VisibilityToggle extends HTMLElement {
  private observer_: MutationObserver;
  private source_: HTMLElement;
  private targets_: NodeList;
  
  constructor() {
    super();
    this.observer_ = new MutationObserver(() => this.toggleVisibility_());
  }

  connectedCallback(): void {
    this.setup_();
  }

  disconnectedCallback(): void {
    this.observer_.disconnect();
  }

  private setup_(): void {
    this.source_ = document.querySelector(this.getAttribute(SOURCE_ATTR));
    this.targets_ = document.querySelectorAll(this.getAttribute(TARGET_ATTR));

    this.observer_.observe(this.source_, {attributes: true});
    this.toggleVisibility_();

    [SOURCE_ATTR, TARGET_ATTR].forEach((attr) => this.removeAttribute(attr));
  }

  private toggleVisibility_(): void {
    if (this.source_.hasAttribute(EMPTY_ATTR)) {
      this.targets_.forEach((target: HTMLElement) => {
        return target.setAttribute(HIDDEN_ATTR, '');
      });
    } else {
      this.targets_.forEach((target: HTMLElement) => {
        return target.removeAttribute(HIDDEN_ATTR);
      });
    }
  }
}

export {VisibilityToggle};
