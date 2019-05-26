<?php
$title = 'Compound Interest Calculator';
$description = 'Mobile-friendly standalone web app that calculates compound interest';

$prod_server = 'interest.gauslin.com';

$css = 'interest.css';
$js = 'interest.js';

if ($_SERVER['SERVER_NAME'] == $prod_server) {
  $manifest = file_get_contents('build/manifest.json');
  $json = json_decode($manifest, true);
  $css_path = '/build/ui/' . $json[$css];
  $js_path = '/build/ui/' . $json[$js];
} else {
  $css_path = '/ui/' . $css;
  $js_path = '/ui/' . $js;
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $title ?></title>
    <meta name="description" content="<?php echo $description ?>">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Interest">
	  <?php // <link rel="manifest" href="/pwa/manifest.json"></link> ?>
    <link rel="stylesheet" href="<?php echo $css_path ?>">
  </head>

  <body ontouchstart no-touch no-js>

    <div class="app">

      <header class="header">
        <div class="header__frame">
          <h1 class="header__title"><?php echo $title ?></h1>
          <div class="settings">
            <input class="settings__toggle" type="checkbox" aria-label="Settings">
            <div class="menu">
              <div class="menu__content"></div>
            </div>
          </div>
        </div>
      </header>

      <div class="values">
        <ul class="values__list"></ul>
        <div class="values__total"></div>
      </div>

      <div class="table">
        <div class="table__frame">
          <table class="table__data"></table>
        </div>
      </div>

      <div class="toggle">
        <button class="toggle__button"></button>
      </div>

      <footer class="footer">
        <p class="footer__copyright">© <?php echo date('Y'); ?> <a class="footer__link" href="https://gauslin.com" title="Ben Gauslin’s Website (opens in a new window)" target="_blank" rel="noopener">Ben Gauslin</a></p>
      </footer>

      <div class="mask" inactive></div>

      <noscript>
        <div class="no-js">
          <p class="no-js__message">
            Please <a href="http://enable-javascript.com" title="How to enable JavaScript in your browser" class="no-js__link">enable JavaScript</a> to view this website. Thanks!
          </p>
        </div>
      </noscript>

    </div>

    <script src="<?php echo $js_path ?>"></script>

  <?php if ($_SERVER['SERVER_NAME'] != $prod_server) { ?>
    <div id="css-debugger" src="/ui/breakpoints.json" theme="light"></div>
    <script src="https://css.gauslin.com/js/debugger.js"></script>
  <?php } ?>
  </body>
</html>
