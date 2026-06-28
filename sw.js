// ============================================
// Smart Senya — Service Worker PWA
// Cache les fichiers pour fonctionner hors ligne
// ============================================

const CACHE_NOM = 'smart-senya-v1';

const FICHIERS_CACHE = [
  './smart_senya_dashboard.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap'
];

// Installation — mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NOM).then(cache => {
      console.log('Smart Senya — Cache installé');
      return cache.addAll(FICHIERS_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation — nettoyage anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NOM).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — sert depuis cache si hors ligne
self.addEventListener('fetch', event => {
  // On ne cache pas les appels ESP et OpenWeatherMap
  const url = event.request.url;
  if (url.includes('192.168.') || url.includes('openweathermap') || url.includes('onesignal')) {
    return; // Laisse passer normalement
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Met en cache la réponse
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NOM).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Hors ligne — retourne la page principale
        return caches.match('./smart_senya_dashboard.html');
      });
    })
  );
});

// Notifications push reçues
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const titre   = data.headings?.fr || 'Smart Senya';
  const message = data.contents?.fr || 'Nouvelle notification';

  event.waitUntil(
    self.registration.showNotification(titre, {
      body: message,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: './smart_senya_dashboard.html' }
    })
  );
});

// Clic sur notification → ouvre l'app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./smart_senya_dashboard.html')
  );
});
