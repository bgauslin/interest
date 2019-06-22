# Compound Interest Calculator

[Interest.Gauslin.com](https://interest.gauslin.com)

Frustrated with the user experience of compound interest calculators I found online or downloaded from the App Store, I decided to make my own.

![Compound Interest Calculator](https://assets.gauslin.com/images/screenshots/interest-calculator.png?v=1)

This project is pretty straightforward in that it does what it says on the tin, while also offering three themes and a few currency options, with user-provided values and preferences saved via localStorage.

- All [calculations][calculations] are handled by an ES6 class, with separate methods providing [formatting based on currency][formatting].
- On small screens, a table showing annual compounding data can be [expanded or collapsed][expandable], with additional data displayed when the [device orientation][orientation] is changed.
- Stylus [hashes and constants][constants] work with CSS custom properties to determine [light, dark, and sepia][theming] theming; media query [breakpoints][breakpoints]; all [branding and typography][root_vars]; and [grid layout][grid].


[calculations]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/js/modules/Calculations.js#L48-L79
[formatting]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/js/modules/Calculations.js#L87-L109

[expandable]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/js/modules/Expandable.js#L58-L85
[orientation]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/interest/table.styl#L99-L106

[constants]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/config/constants.styl#L3-L37
[theming]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/interest/_root_vars.styl#L35-L63
[breakpoints]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/config/constants.styl#L51-L56
[root_vars]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/interest/_root_vars.styl#L35-L63
[grid]: https://github.com/bgauslin/interest/blob/30ec0f91defaf71b54d47c82b904ec64943308f8/source/stylus/interest/app.styl#L1-L15