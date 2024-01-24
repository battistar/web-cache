self.addEventListener('install', (e) => {
  console.log('install');

  const preCache = async () => {
    const cache = await caches.open('trailers');

    await cache.addAll([
      '/web-cache/',
      '/web-cache/assets/css/style.css',
      '/web-cache/assets/js/main.js',
      '/web-cache/assets/fonts/Karla-VariableFont_wght.ttf',
      '/web-cache/assets/images/icons/favicon.ico',
    ]);
  };

  e.waitUntil(preCache());
});

self.addEventListener('fetch', (e) => {
  console.log('fetch');

  const fetchResponse = async () => {
    const cachedResponse = await caches.match(e.request);

    return cachedResponse || fetch(e.request);
  };

  e.respondWith(fetchResponse());
});
