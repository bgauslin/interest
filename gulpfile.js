var elixir = require('laravel-elixir');

require('laravel-elixir-browserify-official');
require('laravel-elixir-livereload');

elixir.config.sourcemaps = false;
elixir.config.assetsPath = 'source';
elixir.config.css.outputFolder = 'ui/css';
elixir.config.js.outputFolder = 'ui/js';

elixir(mix => {
  mix.browserify('calculator.js')
  .stylus('calculator.styl')
  .copy('source/html', 'public')
  .copy('source/webfonts', 'public/ui/webfonts')
  .copy('source/icons', 'public')
  .livereload()
  .browserSync({
    proxy: 'calculator.gauslin.test'
  })
  .version([
    'public/ui/css/calculator.css',
    'public/ui/js/calculator.js',
  ]);
});
