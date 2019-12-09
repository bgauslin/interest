import fastclick from 'fastclick';

const NO_TOUCH_ATTR: string = 'no-touch';

class Utils {
  /**
   * Initializes handy site-wide methods.
   */
  public init(): void {
    this.noTouch_();
    this.googleAnalytics_();
    this.viewportHeight_();
    window.addEventListener('resize', () => this.viewportHeight_());
  }

  /**
   * Initializes Google Analytics tracking.
   */
  private googleAnalytics_(): void {
    if (process.env.NODE_ENV === 'production') {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*(<any>new Date());a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      (<any>window).ga('create', process.env.GA_ID, 'auto');
      (<any>window).ga('send', 'pageview');
    }
  }

  /**
   * Attaches fastclick for touch devices; adds 'no-touch' attribute otherwise.
   */
  private noTouch_(): void {
    if ('ontouchstart' in window || (<any>window).DocumentTouch) {
      fastclick['attach'](document.body);
    } else {
      document.body.setAttribute(NO_TOUCH_ATTR, '');
    }
  }

  /**
   * Sets custom property for viewport height that updates 'vh' calculation
   * due to iOS Safari behavior where chrome appears and disappears when
   * scrolling.
   */
  private viewportHeight_(): void {
    const viewportUnit = window.innerHeight / 100;
    document.documentElement.style.setProperty('--viewport-unit', `${viewportUnit}px`);
  }
}

export { Utils };
