import { Utils } from './Utils';

const EMPTY_ATTR: string = 'empty';

const HIDDEN_ATTR: string = 'hidden';

enum Visibility {
  SOURCE = '.values__total',
  TARGETS = '.expandable, .table',
}

enum FooterInfo {
  label = 'Ben Gauslin',
  title = 'Ben Gauslin’s Website',
  url = 'https://gauslin.com',
  yearStart = '2018',
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
    this.updateFooter_();

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
   * Renders additional elements into the header.
   */
  private updateHeader_(): void {
    const headerEl = document.querySelector('.header__frame');
    headerEl.innerHTML += '<user-settings class="settings" id="settings"></user-settings>';
  }

  /**
   * Renders user inputs, table, expandable, and click mask into the DOM.
   */
  private renderContent_(): void {
    const contentEl = document.querySelector('.content');
    const html = `
      <user-values class="values"></user-values>\
      ${this.renderTable_('table')}\
      <my-expandable class="expandable" target="table" label="table"></my-expandable>\
    `;
    contentEl.innerHTML = html.replace(/\s\s/g, '');
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
  private updateFooter_(): void {
    const { label, title, url, yearStart } = FooterInfo;
    const yearEnd = new Date().getFullYear().toString().substr(-2);

    const yearsEl = document.querySelector('.copyright__years');
    const ownerEl = document.querySelector('.copyright__owner');

    const ownerElHtml = `\
      <a class="copyright__owner" \
          href="${url}" \
          title="${title} (opens in a new window)" \
          target="_blank" \
          rel="noopener">${label}</a>\
    `;

    yearsEl.textContent = `© ${yearStart}–${yearEnd}`;
    ownerEl.innerHTML = ownerElHtml.replace(/\s\s/g, '');
  }
}

export { App };
