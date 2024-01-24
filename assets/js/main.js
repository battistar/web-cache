const titles = [
  'Alien (1979)',
  'Beetlejuice (1988)',
  'Blade Runner (1982)',
  "Bram Stoker's Dracula (1992)",
  'Event Horizon (1997)',
  'First Blood (1982)',
  'Terminator 2 Judgment Day (1991)',
  'The Fly (1986)',
  'The Naked Gun (1988)',
  'The Nightmare Before Christmas (1993)',
];

let fetchCounter = 0;

let db;

function displayMovie(image, mp4, title) {
  const videoSrc = URL.createObjectURL(mp4);
  const imageSrc = URL.createObjectURL(image);

  const main = document.querySelector('main');

  const article = document.createElement('article');
  article.classList.add('movie');

  const h2 = document.createElement('h2');
  h2.classList.add('movie__title');
  h2.textContent = title;

  const div = document.createElement('div');
  div.classList.add('movie__content');

  const img = document.createElement('img');
  img.classList.add('movie__poster');
  img.src = imageSrc;

  const video = document.createElement('video');
  video.classList.add('movie__trailer');
  video.controls = true;

  const source = document.createElement('source');
  source.src = videoSrc;
  source.type = 'video/mp4';

  main.appendChild(article);
  article.appendChild(h2);
  article.appendChild(div);
  div.appendChild(img);
  div.appendChild(video);
  video.appendChild(source);
}

function storeMovie(image, mp4, title) {
  const objectStore = db.transaction(['movies_os'], 'readwrite').objectStore('movies_os');

  const request = objectStore.add({ image, mp4, title });

  request.addEventListener('success', () => {
    console.log('Record addition attempt finished');
  });

  request.addEventListener('error', () => {
    console.error(request.error);
  });
}

async function fetchVideo(title) {
  const response = await fetch(`assets/videos/${title}.mp4`);

  return await response.blob();
}

async function fetchImage(title) {
  const response = await fetch(`assets/images/${title}.jpg`);

  return await response.blob();
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register(`/web-cache/sw.js`);

      console.log('Service worker registered');
    } catch (error) {
      console.error(error);
    }
  }
}

function showLoader() {
  const containerDiv = document.createElement('div');
  containerDiv.id = 'loader';
  containerDiv.classList.add('loader__container');
  containerDiv.textContent = 'Fetching data...';

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('loader');

  document.body.appendChild(containerDiv);
  containerDiv.appendChild(innerDiv);
}

function removeLoader() {
  const div = document.querySelector('#loader');
  document.body.removeChild(div);
}

function init() {
  showLoader();

  registerServiceWorker();

  for (const title of titles) {
    const objectStore = db.transaction('movies_os').objectStore('movies_os');
    const request = objectStore.get(title);

    request.addEventListener('success', async () => {
      fetchCounter++;

      if (fetchCounter === titles.length) {
        removeLoader();
      }

      if (request.result) {
        console.log('Load from indexDB');

        displayMovie(request.result.image, request.result.mp4, title);
      } else {
        console.log('Load from network');

        const videoBlob = await fetchVideo(title);
        const imageBlob = await fetchImage(title);

        displayMovie(imageBlob, videoBlob, title);
        storeMovie(imageBlob, videoBlob, title);
      }
    });
  }
}

const request = window.indexedDB.open('trailers_db', 1);

request.addEventListener('error', () => {
  console.error('Database failed to open');
});

request.addEventListener('success', () => {
  console.log('Database opened successfully');

  db = request.result;

  init();
});

request.addEventListener('upgradeneeded', (e) => {
  const db = e.target.result;

  const objectStore = db.createObjectStore('movies_os', { keyPath: 'title' });

  objectStore.createIndex('mp4', 'mp4', { unique: false });
  objectStore.createIndex('image', 'image', { unique: false });

  console.log('Database setup complete');
});
