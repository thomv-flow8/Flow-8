// Flow8 Service Worker
const CACHE_NAME = 'flow8-v5';
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
      // Informeer alle open tabs dat er een nieuwe versie actief is
      return self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Alleen GET requests cachen
  if(event.request.method !== 'GET') return;

  var url = event.request.url;

  // Firebase en externe APIs nooit cachen
  if(url.includes('firebaseio.com') ||
     url.includes('googleapis.com') ||
     url.includes('gstatic.com') ||
     url.includes('maps.google') ||
     url.includes('recaptcha') ||
     url.includes('firebasestorage')) {
    return;
  }

  // App shell (HTML): network-first zodat updates direct beschikbaar zijn.
  // `cache:'no-cache'` is hier essentieel: een gewone fetch() mag uit de browsercache putten,
  // en die gaf op GitHub Pages de vorige versie terug zonder het netwerk te raadplegen — de
  // service worker sloeg die oude versie vervolgens óók nog eens op. Gevolg: na een deploy
  // bleef je de oude app zien tot je hard verversde, terwijl "network-first" suggereert van niet.
  // 'no-cache' betekent niet "niet cachen" maar "altijd navragen bij de server": die stuurt een
  // 304 als er niets veranderd is, dus het kost bijna niets. 'no-store' zou de hele HTML
  // (ruim 2 MB) elke keer opnieuw downloaden.
  if(url.includes('flow8-v2.html') || url.endsWith('/') || url.endsWith('/Flow-8/')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(function(response) {
          if(response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(function() {
          // Offline: geef gecachede versie
          return caches.match(event.request).then(function(cached) {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Overige assets: cache-first met achtergrond update
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
        return cached || caches.match(OFFLINE_URL);
      });
      return cached || networkFetch;
    })
  );
});
