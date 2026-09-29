const CACHE_NAME = 'kkhm-erp-cache-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Network-First for HTML/navigation requests so the app always gets the latest updates
  if (req.mode === 'navigate' || req.destination === 'document' || req.url.endsWith('/') || req.url.includes('index.html')) {
    event.respondWith(
      fetch(req)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Stale-while-revalidate / cache-first for other static assets
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(req).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(req, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(req);
    })
  );
});

// Push Event: Handle incoming push notifications
self.addEventListener('push', event => {
  let data = { title: 'KKHM ERP Notification', body: 'You have a new update from KKHM College.', icon: '/icon-192.png', badge: '/icon-192.png' };
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: data.actions || []
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      // Update App Badge if supported
      navigator.setAppBadge ? navigator.setAppBadge(data.badgeCount || 1) : Promise.resolve()
    ])
  );
});

// Notification Click Event: Direct to link or focus app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) && !targetUrl.includes(self.location.origin)) {
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (targetUrl && targetUrl !== '/' && client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Message Event: Handle badge or notification requests from client
self.addEventListener('message', event => {
  if (event.data) {
    if (event.data.action === 'setBadge' && navigator.setAppBadge) {
      navigator.setAppBadge(event.data.count || 1).catch(() => {});
    } else if (event.data.action === 'clearBadge' && navigator.clearAppBadge) {
      navigator.clearAppBadge().catch(() => {});
    }
  }
});