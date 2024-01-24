import env from './env';

self.addEventListener('install', (e) => {
  console.log('install');

  const preCache = async () => {
    const cache = await caches.open('trailers');

    await cache.addAll([
      `${env.repository}/`,
      `${env.repository}/assets/css/style.css`,
      `${env.repository}/assets/js/main.js`,
      `${env.repository}/assets/fonts/Karla-VariableFont_wght.ttf`,
      `${env.repository}/assets/images/icons/favicon.ico`,
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
