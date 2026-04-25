// Flow8 Service Worker
const CACHE_NAME = 'flow8-v2';
const OFFLINE_URL = '/Flow-8/flow8-v2.html';

// Bestanden om te cachen bij installatie
const PRECACHE = [
  '/Flow-8/flow8-v2.html',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Alleen GET requests cachen
  if(event.request.method !== 'GET') return;

  // Firebase en externe APIs niet cachen
  var url = event.request.url;
  if(url.includes('firebaseio.com') ||
     url.includes('googleapis.com') ||
     url.includes('gstatic.com') ||
     url.includes('maps.google') ||
     url.includes('recaptcha')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var networkFetch = fetch(event.request).then(function(response) {
        if(response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline: geef gecachede versie of de app shell
        return cached || caches.match(OFFLINE_URL);
      });
      // Geef gecachede versie meteen terug, update op achtergrond
      return cached || networkFetch;
    })
  );
});
