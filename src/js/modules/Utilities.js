/** @const {string} */
const NO_TOUCH_ATTR = 'no-touch';

/** @class */
class Utilities {
  /**
   * @param {!Object} config
   */
  constructor(config) {
    /** @const {?Object} */
    this.analyticsSettings = config.analyticsSettings;
  }

  /**
   * Initializes all utilities.
   * @public
   */
  init() {
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
   * Adds 'no-touch' attribute if not a touch-enabled device.
   * @private
   */
  noTouch_() {
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return;
    } else {
      document.body.setAttribute(NO_TOUCH_ATTR, '');
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
