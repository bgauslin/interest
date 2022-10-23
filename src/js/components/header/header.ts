import {LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

/**
 * Shifts a fixed header in and out of the viewport depending on scroll
 * direction, and sets its transparency based on the state of its target.
 */
@customElement('app-header')
class AppHeader extends LitElement {
  @state() size: number;
  @state() resizeListener: EventListenerObject;
  @state() scrollChange: number;
  @state() scrollListener: EventListenerObject;
  @state() shift: number = 0;
  @state() yScroll: number;

  constructor() {
    super();
    this.resizeListener = this.getSize.bind(this);
    this.scrollListener = this.setShift.bind(this);
  }

  connectedCallback() {
    this.getSize();
    this.setShift();
    document.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener);
  }

  disconnectedCallback() {
    document.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.resizeListener);
  }

  private getSize() {
    this.size = this.offsetHeight;
  }

  // Gets current scroll position and updates shift based on change in scroll
  // position if it's within bounds, or resets shift if it exceeds the bounds.
  private setShift() {
    const yScroll = document.documentElement.scrollTop;
    this.scrollChange = yScroll - this.yScroll || 0;

    if (this.shift > 0 || this.shift < this.size) {
      this.shift += this.scrollChange;
    }

    if (this.shift > this.size) {
      this.shift = this.size;
    } else if (this.shift < 0) {
      this.shift = 0;
    }
    
    const cssShift = `-${this.shift / 16}rem`;
    const cssOffset = `${(this.size - this.shift) / 16}rem`;

    // Set custom properties for elements to reference.
    document.documentElement.style.setProperty('--shift', cssShift);
    document.documentElement.style.setProperty('--offset', cssOffset);

    // Save scroll position for determining scroll change on next tick.
    this.yScroll = (yScroll <= 0) ? 0 : yScroll;
  }
}
