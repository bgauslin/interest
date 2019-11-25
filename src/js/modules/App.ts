import { Utils } from './Utils';

const EMPTY_ATTR: string = 'empty';

const HIDDEN_ATTR: string = 'hidden';

enum Visibility {
  SOURCE = '.values__total',
  TARGETS = '.expandable, .table',
}

enum FooterInfo {
  Label = 'Ben Gauslin',
  Title = 'Ben Gauslin’s Website',
  Url = 'https://gauslin.com',
  YearStart = '2018',
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

    this.renderHeader_();
    this.renderContent_();
    this.renderFooter_();

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

    if (this.visibilitySourceEl_.hasAttribute(EMPTY_ATTR)) {
      els.forEach(el => el.setAttribute(HIDDEN_ATTR, ''));
    } else {
      els.forEach(el => el.removeAttribute(HIDDEN_ATTR));
    }
  }

  /**
   * Renders header element into the DOM.
   */
  private renderHeader_(): void {
    const html = `\
      <header class="header">\
        <div class="header__frame">\
          <h1 class="header__title">${document.title}</h1>\
          <user-settings class="settings" id="settings"></user-settings>\
        </div>\
      </header>\
    `;
    document.body.innerHTML += html.replace(/\s\s/g, '');
  }

  /**
   * Renders user inputs, table, expandable, and click mask into the DOM.
   */
  private renderContent_(): void {
    const html = `
      <user-values class="values"></user-values>\
      ${this.renderTable_('table')}\
      <my-expandable class="expandable" target="table" label="table"></my-expandable>\
    `;
    document.body.innerHTML += html.replace(/\s\s/g, '');
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
   * Renders footer element into the DOM.
   */
  private renderFooter_(): void {
    const { Label, Title, Url, YearStart } = FooterInfo;
    const yearEnd = new Date().getFullYear().toString().substr(-2);
    const html = `\
      <footer class="footer">\
        <p class="copyright">\
          <span class="copyright__years">© ${YearStart}–${yearEnd}</span>\
          <a class="copyright__owner" \
             href="${Url}" \
             title="${Title} (opens in a new window)" \
             target="_blank" \
             rel="noopener">${Label}</a>\
        </p>\
      </footer>\
    `;

    document.body.innerHTML += html.replace(/\s\s/g, '');
  }
}

export { App };
