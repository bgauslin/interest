// https://itnext.io/pwa-from-scratch-guide-yet-another-one-bdfa438b50aa
// https://tomitm.github.io/appmanifest/


/**
 * Install the service worker via html or main js build...
 */
async function installServiceWorkerAsync() {
  if ('serviceWorker' in navigator) {
    try {
      let serviceWorker = await navigator.serviceWorker.register('/sw.js');
      console.log(`Service worker registered ${serviceWorker}`);
    } catch (err) {
      console.error(`Failed to register service worker: ${err}`);
    }
  }
}




/**
 * Initialize the service worker via its own sw.js file...
 */

const CACHE_NAME = 'V1';

/**
 * The install event is fired when registration succeeds. After the install
 * step, the browser tries to activate the service worker. Generally, we cache
 * static resources that allow the website to run offline.
 */
this.addEventListener('install', async function() {
  const cache = await caches.open(CACHE_NAME);
  cache.addAll([
    '/index.html',
    '/main.css',
    '/main.js',
  ])
})

/**
 * The fetch event is fired every time the browser sends a request.  In this
 * case, the service worker acts as a proxy. We can return the cached version
 * of the resource matching the request; send the request to the internet; or
 * even make our own response from scratch! Here, we are going to use the
 * 'cache first' strategy.
 */
self.addEventListener('fetch', (event) => {
  // We defined the promise (the async code block) that returns either the
  // cached response or the network response. It should return a response
  // object here.
  const getCustomResponsePromise = async => {
    console.log(`URL ${event.request.url}`, `location origin ${location}`);

    try {
      // Try to get the cached response.
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        // Return the cached response if present.
        console.log(`Cached response ${cachedResponse}`);
        return cachedResponse;
      }

      // Get the network response if no cached response is present.
      const netResponse = await fetch(event.request);
      console.log(`adding net response to cache`);

      // Add the network response to the cache.
      let cache = await caches.open(CACHE_NAME);

      // Provide a clone of the response.
      cache.put(event.request, netResponse.clone());

      // Return the network response.
      return netResponse;

    } catch (err) {
      console.error(`Error ${err}`);
      throw err;
    }
  }

  // In order to override the default 'fetch' behavior, we must provide the
  // result of our custom behavior to the event.respondWith method.
  event.respondWith(getCustomResponsePromise());
})

