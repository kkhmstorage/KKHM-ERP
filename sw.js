const CACHE_NAME = 'kkhm-erp-cache-v13';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. Install Event: Cache essential shell files safely
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('KKHM SW: could not cache', url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches and take control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('KKHM SW: Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Handle navigation and static assets
self.addEventListener('fetch', event => {
  const req = event.request;

  // Let browser handle external APIs (Firestore, Google Script, CDNs) and non-GET requests natively
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-First for HTML/navigation requests so latest updates load first, falling back to cache
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
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return (await caches.match('/index.html')) || (await caches.match('/'));
        })
    );
    return;
  }

  // Stale-While-Revalidate for local assets (icons, manifest)
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      const fetchPromise = fetch(req).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Push Event: Handle incoming push notifications
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
      navigator.setAppBadge ? navigator.setAppBadge(data.badgeCount || 1) : Promise.resolve()
    ])
  );
});

// 5. Notification Click Event
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

// 6. Message Event: Handle badge requests from client
self.addEventListener('message', event => {
  if (event.data) {
    if (event.data.action === 'setBadge' && navigator.setAppBadge) {
      navigator.setAppBadge(event.data.count || 1).catch(() => {});
    } else if (event.data.action === 'clearBadge' && navigator.clearAppBadge) {
      navigator.clearAppBadge().catch(() => {});
    }
  }
});