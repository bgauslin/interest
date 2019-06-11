# Compound Interest Calculator

Frustrated with the user experience of compound interest calculators I found online or downloaded from the App Store, I decided to make my own.

![Compound Interest Calculator](https://assets.gauslin.com/images/screenshots/interest-calculator.png?v=1)

This project is pretty straightforward in that it does what it says on the tin, while also offering three themes and a few currency options, with user-provided values and preferences saved via localStorage.

- All [calculations][calculations] are handled by an ES6 class, with separate methods providing [formatting based on currency][formatting].
- Light, dark, and sepia theming is handled via a Stylus [hash][theme_hash] and [loop][theme_loop].
- On small screens, a table showing annual compounding data can be [expanded or collapsed][expandable], with additional data displayed when the [device orientation][orientation] is changed.
- All UI layout is via CSS [grid][grid] and [sticky positioning][sticky].


[calculations]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/js/modules/Calculations.js#L48-L79
[formatting]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/js/modules/Calculations.js#L87-L109
[theme_hash]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/stylus/interest/theme.styl#L2-L33
[theme_loop]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/stylus/interest/theme.styl#L35-L82
[expandable]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/js/modules/Expandable.js#L58-L85
[orientation]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/stylus/interest/table.styl#L84-L90
[grid]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/stylus/interest/app.styl#L1-L17
[sticky]: https://github.com/bgauslin/interest/blob/aca64aa715aec6eb104ba1c0b46d28478730a82a/source/stylus/interest/values.styl#L21-L22