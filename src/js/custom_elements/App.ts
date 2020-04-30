import {Utils} from '../Modules/Utils';

const CONTENT_CLASS: string = 'content';
const COPYRIGHT_SELECTOR: string = '.copyright__years';
const NO_JS_CLASS: string = 'no-js';
const YEAR_ATTR: string = 'year';

/**
 * Updates the DOM with all app elements and creates a Utils instance for
 * enhancing UX.
 */
class App extends HTMLElement {
  constructor() {
    super();
    new Utils().init();
  }

  connectedCallback(): void {
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
    const startYear = this.getAttribute(YEAR_ATTR);
    this.removeAttribute(YEAR_ATTR);

    const el = this.querySelector(COPYRIGHT_SELECTOR);
    
    const currentYear = new Date().getFullYear().toString();
    const startDecade = startYear.substr(-2);
    const currentDecade = currentYear.substr(-2);

    el.textContent = (startDecade !== currentDecade) ? `© ${startYear}–${currentDecade}` : `© ${startYear}`;
  }
}

export {App};
