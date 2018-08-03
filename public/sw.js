// Service worker with cache-first network.
var CACHE = 'precache';
var precacheFiles = [
  'index.php',
  '/ui/css/calculator.css',
  '/ui/icons/favicon.png',
  '/ui/js/calculator.js',
  '/ui/webfonts/AvenirLTStd-Heavy.woff',
  '/ui/webfonts/AvenirLTStd-Heavy.woff2',
  '/ui/webfonts/AvenirLTStd-Medium.woff',
  '/ui/webfonts/AvenirLTStd-Medium.woff2',
  '/ui/webfonts/AvenirNext-Variable.woff2',
];

// Sets up the cache-array to configure pre-cache content.
self.addEventListener('install', function(evt) {
  console.log('Service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log('Skip waiting on install');
    return self.skipWaiting();
  }));
});

// Allows sw control of current page.
self.addEventListener('activate', function(event) {
  console.log('Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.' +  evt.request.url);
  evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

// Pulls files from the cache first.
function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

// Calls the server to get newest version of files.
function update(request) {
  return caches.open(CACHE).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response);
    });
  });
}

// Fallback if not in the cache; go to the server and get it.
function fromServer(request){
  return fetch(request).then(function(response){
    return response
  });
}
