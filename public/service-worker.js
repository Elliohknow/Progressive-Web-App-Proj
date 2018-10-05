


importScripts('workbox-sw.prod.v2.1.3.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(
  /.*(?:googleapis|gstatic)\.com.*$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts',
    cacheExpiration: {
      maxEntries: 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  })
);

workboxSW.router.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'material-css'
  })
);

workboxSW.router.registerRoute(
  /.*(?:firebasestorage\.googleapis)\.com.*$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'post-images'
  })
);

workboxSW.router.registerRoute('https://pwagram-a3dea.firebaseio.com/posts.json', function (args) {
  return fetch(args.event.request)
    .then(function (res) {
      var clonedRes = res.clone();
      clearAllData('posts')
        .then(function () {
          return clonedRes.json();
        })
        .then(function (data) {
          for (var key in data) {
            writeData('posts', data[key]);
          }
        });
      return res;
    });
});

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "656d73756c3cb4a32f53c3d65e5a01ee"
  },
  {
    "url": "manifest.json",
    "revision": "5ec3e2d4c021dde7c819d76fdbcd351c"
  },
  {
    "url": "offline.html",
    "revision": "74c3a619a3784c8225ae4374658f932d"
  },
  {
    "url": "service-worker.js",
    "revision": "e9ddeed54ab4179a9e91685c9a4dab83"
  },
  {
    "url": "src/css/app.css",
    "revision": "21cd3515bee51932385bf2373f081de7"
  },
  {
    "url": "src/css/feed.css",
    "revision": "91e46f097db68519a068615517714d3c"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/js/app.js",
    "revision": "94b0f97806c4471d50f79e724c195cc9"
  },
  {
    "url": "src/js/feed.js",
    "revision": "6dc5a1ecc5d7374dd69d1e815da3f73b"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "6cff6ce3ea78f47af8fe59d2490ef287"
  },
  {
    "url": "sw-base.js",
    "revision": "70108379ee0e45946b2701af516c3e49"
  },
  {
    "url": "sw.js",
    "revision": "dc8d1d885c4ab957d19f377c19f4f2cd"
  },
  {
    "url": "workbox-sw.prod.v2.1.3.js",
    "revision": "a9890beda9e5f17e4c68f42324217941"
  },
  {
    "url": "src/images/druid-landscape-lg.jpg",
    "revision": "27e2c5c40ac19bfd50b0111fd8831534"
  },
  {
    "url": "src/images/druid-landscape-sm.jpg",
    "revision": "d53eb8753e22d79804398df74408dfaa"
  },
  {
    "url": "src/images/druid-landscape.jpg",
    "revision": "6c930fa85b2b813ccc68fa1a3a2f5e5a"
  },
  {
    "url": "src/images/pixieparty.jpg",
    "revision": "63869a57a54ed52f618051d6d33a63aa"
  }
]);
