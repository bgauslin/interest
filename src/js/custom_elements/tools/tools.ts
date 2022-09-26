import fastclick from 'fastclick';

/**
 * Custom element that sets up the DOM and initializes site-wide features.
 */
export class Tools extends HTMLElement {
  private hasSetup: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.hasSetup) {
      this.setupDom();
      this.touchEnabled();
      this.analytics();
      this.hasSetup = true;
    }
  }

  /**
   * Removes 'no JS' attribute and element from the DOM.
   */
  private setupDom() {
    document.body.removeAttribute('no-js');
    document.querySelector('noscript').remove();
  }

  /**
   * Initializes analytics.
   */
  private analytics() {
    if (process.env.NODE_ENV === 'production') {
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load('1593720077');

      document.body.innerHTML += '<script src="//static.getclicky.com/101381864.js" async></script>';
    }
  }

  /**
   * Removes 'no-touch' attribute and adds fastclick if device is touch-enabled.
   */
  private touchEnabled() {
    if ('ontouchstart' in window || (window as any).DocumentTouch) {
      document.body.removeAttribute('no-touch');
      fastclick['attach'](document.body);
    }
  }
}

customElements.define('x-tools', Tools);
