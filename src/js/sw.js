workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
  /https:\/\/assets\.gausin\.com/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'webfonts',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 10 * 60, // 10 minutes
      })
    ]
  })
);
