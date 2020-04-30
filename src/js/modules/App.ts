import {Utils} from './Utils';

const CONTENT_CLASS: string = 'content';
const COPYRIGHT_SELECTOR: string = '.copyright__years';
const EMPTY_ATTR: string = 'empty';
const HIDDEN_ATTR: string = 'hidden';
const NO_JS_CLASS: string = 'no-js';
const VISIBLE_SOURCE_SELECTOR: string = '.values__total';
const VISIBLE_TARGETS_SELECTOR: string = '.expandable, .table';
const YEAR_ATTR: string = 'year';

// TODO: Refactor App as a custom element.
/**
 * Updates the DOM with all app elements and creates a Utils instance for
 * enhancing UX.
 */
class App {
  private observer_: MutationObserver;
  private visibleSourceEl_: HTMLElement;
  
  constructor() {
    this.observer_ = new MutationObserver(() => this.toggleVisibility_());
  }

  /**
   * Renders all HTML for the app.
   */
  public init(): void {
    new Utils().init();

    // Update app elements.
    this.updateContent_();
    this.updateCopyright_();

    // Observe empty element for toggling other elements' visibility.
    this.visibleSourceEl_ = document.querySelector(VISIBLE_SOURCE_SELECTOR);
    this.observer_.observe(this.visibleSourceEl_, {attributes: true});
    this.toggleVisibility_();
  }

  /**
   * Hides target elements if the observed source element is empty since
   * there's no target for the expandable to expand/collapse.
   * Note: Because the source and target elements are standard HTML elements
   * (not custom elements), this is handled by the App instance.
   */
  private toggleVisibility_(): void {
    const targets = document.querySelectorAll(VISIBLE_TARGETS_SELECTOR);

    if (this.visibleSourceEl_.hasAttribute(EMPTY_ATTR)) {
      targets.forEach((target) => target.setAttribute(HIDDEN_ATTR, ''));
    } else {
      targets.forEach((target) => target.removeAttribute(HIDDEN_ATTR));
    }
  }

  /**
   * Removes no-script stuff and updates content element's classname.
   */
  private updateContent_(): void {
    const contentEl = document.querySelector(`.${NO_JS_CLASS}`);
    contentEl.classList.remove(NO_JS_CLASS);
    contentEl.classList.add(CONTENT_CLASS);
    contentEl.querySelector('noscript').remove();
  }

  /**
   * Updates copyright years with the current year.
   */
  private updateCopyright_(): void {
    const el = document.querySelector(COPYRIGHT_SELECTOR);
    const startYear = el.getAttribute(YEAR_ATTR);
    const currentYear = new Date().getFullYear().toString();
    const startDecade = startYear.substr(-2);
    const currentDecade = currentYear.substr(-2);

    el.textContent = (startDecade !== currentDecade) ? `© ${startYear}–${currentDecade}` : `© ${startYear}`;
    el.removeAttribute(YEAR_ATTR);
  }
}

export {App};
