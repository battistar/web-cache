self.addEventListener('install', (e) => {
  console.log('install');

  const preCache = async () => {
    const cache = await caches.open('trailers');

    await cache.addAll([
      '/',
      '/assets/css/style.css',
      '/assets/js/main.js',
      '/assets/fonts/Karla-VariableFont_wght.ttf',
      '/assets/images/icons/favicon.ico',
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
