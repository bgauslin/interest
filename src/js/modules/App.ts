import { Utils } from './Utils';

enum Attribute {
  EMPTY = 'empty',
  HIDDEN = 'hidden',
}

enum CssClass {
  CONTENT = 'content',
  HEADER = 'header__frame',
  NO_JS = 'no-js',
}

enum Visibility {
  SOURCE = '.values__total',
  TARGETS = '.expandable, .table',
}

class App {
  private observer_: MutationObserver;
  private utils_: any;
  private visibilitySourceEl_: HTMLElement;
  
  constructor() {
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
    this.updateCopyright_('2018');

    this.visibilitySourceEl_ = document.querySelector(Visibility.SOURCE);
    this.observer_.observe(this.visibilitySourceEl_, { attributes: true });
    this.setVisibility_();
  }

  /**
   * Hides elements if an observed element is empty since there's no target
   * for the expandable to expand/collapse.
   */
  private setVisibility_(): void {
    const els = document.querySelectorAll(Visibility.TARGETS);

    if (this.visibilitySourceEl_.hasAttribute(Attribute.EMPTY)) {
      els.forEach(el => el.setAttribute(Attribute.HIDDEN, ''));
    } else {
      els.forEach(el => el.removeAttribute(Attribute.HIDDEN));
    }
  }

  /**
   * Renders additional elements into the header.
   */
  private updateHeader_(): void {
    const headerEl = document.querySelector(`.${CssClass.HEADER}`);
    headerEl.innerHTML += '<user-settings class="settings" id="settings"></user-settings>';
  }

  /**
   * Renders user inputs, table, expandable, and click mask into the DOM.
   */
  private renderContent_(): void {
    const contentEl = document.querySelector(`.${CssClass.NO_JS}`);
    const html = `\
      <user-values class="values"></user-values>\
      ${this.renderTable_('table')}\
      <my-expandable class="expandable" target="table" label="table"></my-expandable>\
    `;
    contentEl.innerHTML = html.replace(/\s\s/g, '');
    contentEl.classList.add(`${CssClass.CONTENT}`);
    contentEl.classList.remove(`${CssClass.NO_JS}`);
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
  private updateCopyright_(start: string): void {
    const el = document.querySelector('.copyright__years');
    const end = new Date().getFullYear().toString().substr(-2);
    el.textContent = `© ${start}–${end}`;
  }
}

export { App };
