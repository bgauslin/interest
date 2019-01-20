/** @enum {string} */
const Attribute = {
  NO_JS: 'no-js',
  NO_TOUCH: 'no-touch',
}

/** @class */
class Utilities {
  /**
   * @param {!Object} config
   * @param {!Object} config.analyticsSettings
   */
  constructor(config) {
    /** @const {Object} */
    this.analyticsSettings = config.analyticsSettings;
  }

  /**
   * Initializes all utilities.
   * @public
   */
  init() {
    this.hasJs_();
    this.noTouch_();
    this.viewportHeight();
    this.googleAnalytics_(this.analyticsSettings);
  }

  /**
   * Initializes Google Analytics tracking.
   * @param {!Object} settings
   * @param {!string} settings.id - Google Analytics ID.
   * @param {!string} settings.domain - Production domain.
   * @private
   */
  googleAnalytics_(settings) {
    if (window.location.hostname === settings.domain) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga')
      ga('create', settings.id, 'auto')
      ga('send', 'pageview')
    }
  }

  /**
   * Removes 'no-js' attribute if JS is enabled.
   * @private
   */
  hasJs_() {
    document.body.removeAttribute(Attribute.NO_JS);
  }

  /**
   * Removes 'no-touch' attribute if device is touch-enabled.
   * @private
   */
  noTouch_() {
    if ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) {
      document.body.removeAttribute(Attribute.NO_TOUCH);
    }
  }

  /**
   * Sets custom property for viewport height that updates 'vh' calculation
   * due to iOS Safari behavior where chrome appears and disappears when
   * scrolling.
   * @public
   */
  viewportHeight() {
    const viewportUnit = window.innerHeight / 100;
    document.documentElement.style.setProperty('--viewport-unit', `${viewportUnit}px`);
  }
}

export { Utilities };
