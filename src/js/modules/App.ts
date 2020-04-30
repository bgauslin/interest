import {Utils} from './Utils';

const CONTENT_CLASS: string = 'content';
const COPYRIGHT_SELECTOR: string = '.copyright__years';
const NO_JS_CLASS: string = 'no-js';
const YEAR_ATTR: string = 'year';

// TODO: Refactor App as a custom element.
/**
 * Updates the DOM with all app elements and creates a Utils instance for
 * enhancing UX.
 */
class App {
  constructor() {
    new Utils().init();
  }

  /**
   * Updates HTML for the app.
   */
  public init(): void {
    this.updateContent_();
    this.updateCopyright_();
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
