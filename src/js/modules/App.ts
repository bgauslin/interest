import {Utils} from './Utils';

const CONTENT_CLASS: string = 'content';
const COPYRIGHT_SELECTOR: string = '.copyright__years';
const EMPTY_ATTR: string = 'empty';
const HEADER_SELECTOR: string = '.header__frame';
const HIDDEN_ATTR: string = 'hidden';
const NO_JS_CLASS: string = 'no-js';

// TODO(App): Move to custom element.
enum Visibility {
  SOURCE = '.values__total',
  TARGETS = '.expandable, .table',
}

/**
 * Updates the DOM with all app elements and creates a Utils instance for
 * enhancing UX.
 */
class App {
  private observer_: MutationObserver;
  private startYear_: string;
  private utils_: Utils;
  private visibilitySourceEl_: HTMLElement;
  
  constructor(startYear: string) {
    this.startYear_ = startYear;
    this.observer_ = new MutationObserver(() => this.setVisibility_());
    this.utils_ = new Utils();
  }

  /**
   * Renders all HTML for the app.
   */
  public init(): void {
    this.utils_.init();

    this.updateHeader_();
    this.renderContent_();
    this.updateCopyright_();

    // TODO(App): Move to custom element.
    this.visibilitySourceEl_ = document.querySelector(Visibility.SOURCE);
    this.observer_.observe(this.visibilitySourceEl_, {attributes: true});
    this.setVisibility_();
  }

  /**
   * Hides elements if an observed element is empty since there's no target
   * for the expandable to expand/collapse.
   */
  private setVisibility_(): void {
    const els = document.querySelectorAll(Visibility.TARGETS);

    if (this.visibilitySourceEl_.hasAttribute(EMPTY_ATTR)) {
      els.forEach((el) => el.setAttribute(HIDDEN_ATTR, ''));
    } else {
      els.forEach((el) => el.removeAttribute(HIDDEN_ATTR));
    }
  }

  /**
   * Renders additional elements into the header.
   */
  private updateHeader_(): void {
    const headerEl = document.querySelector(HEADER_SELECTOR);
    headerEl.innerHTML += '<user-settings class="settings" id="settings"></user-settings>';
  }

  /**
   * Renders user inputs, table, expandable, and click mask into the DOM.
   */
  private renderContent_(): void {
    const contentEl = document.querySelector(`.${NO_JS_CLASS}`);
    const html = `\
      <user-values class="values"></user-values>\
      ${this.renderTable_('table')}\
      <app-expandable class="expandable" target="table" label="table"></app-expandable>\
    `;
    contentEl.innerHTML = html.replace(/\s\s/g, '');
    contentEl.classList.add(CONTENT_CLASS);
    contentEl.classList.remove(NO_JS_CLASS);
  }

  /**
   * Returns rendered table element for displaying calculated user values.
   */
  private renderTable_(classname: string, id: string = classname): string {
    const html = `\
      <div class="${classname}" id="${id}">\
        <div class="${classname}__frame">\
          <table class="${classname}__data"></table>\
        </div>\
        <p class="rotate-screen">\
          Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.\
        </p>\
      </div>\
    `;
    return html.replace(/\s\s/g, '');
  }

  /**
   * Updates copyright blurb with current year.
   */
  private updateCopyright_(): void {
    const el = document.querySelector(COPYRIGHT_SELECTOR);
    const end = new Date().getFullYear().toString().substr(-2);
    el.textContent = `© ${this.startYear_}–${end}`;
  }
}

export {App};
