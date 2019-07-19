import { ClickMask } from './ClickMask';
import { Expandable } from './Expandable';
import { Settings } from './Settings';
import { UserValues } from'./UserValues';

/** @class */
class App {
  constructor(id) {
    /** @private {!Element} */
    this.appEl_ = document.getElementById(id);
  }

  /**
   * Renders all HTML for the app.
   * @public
   */
  init() {
    // Register custom elements
    customElements.define('click-mask', ClickMask);
    customElements.define('my-expandable', Expandable);
    customElements.define('user-settings', Settings);
    customElements.define('user-values', UserValues);
    
    // Render everything into the DOM.
    this.renderHeader_();
    this.renderContent_();
    this.renderFooter_();
  }

  /**
   * Renders header element into the DOM.
   * @private
   */
  renderHeader_() {
    this.appEl_.innerHTML += `
      <header class="header">
        <div class="header__frame">
          <h1 class="header__title">${document.title}</h1>
          <user-settings class="settings" id="settings"></user-settings>
        </div>
      </header>
    `;
  }

  /**
   * Renders user inputs, table, expandable, and click mask into the DOM.
   * @private
   */
  renderContent_() {
    this.appEl_.innerHTML += `
      <user-values class="values"></user-values>
      ${this.renderTable_('table')}
      <my-expandable class="expandable" target="table" label="table"></my-expandable>
      <click-mask class="click-mask" target="settings"></click-mask>
    `;
  }

  /**
   * Renders table element for displaying calculated user values.
   * @param {!string} classname
   * @param {?string=} id
   * @private
   */
  renderTable_(classname, id = classname) {
    return `
      <div class="${classname}" id="${id}">
        <div class="${classname}__frame">
          <table class="${classname}__data"></table>
        </div>
        <p class="rotate-screen">
          Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
        </p>
      </div>
    `;
  }

  /**
   * Renders footer element with copyright info and a link into the DOM.
   * @private
   */
  renderFooter_() {
    const label = 'Ben Gauslin';
    const title = 'Ben Gauslin’s Website';
    const url = 'https://gauslin.com';
    const yearStart = '2018';
    const yearEnd = new Date().getFullYear().toString().substr(-2);

    this.appEl_.innerHTML += `
      <footer class="footer">
        <p class="copyright">
          <span class="copyright__years">© ${yearStart}-${yearEnd}</span>
          <a class="copyright__owner"
             href="${url}"
             title="${title} (opens in a new window)"
             target="_blank"
             rel="noopener">${label}</a>
        </p>
      </footer>
    `;
  }
}

export { App };
