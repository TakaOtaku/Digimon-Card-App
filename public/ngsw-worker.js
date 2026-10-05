// Replaces the old site's Angular service worker: unregister, clear its caches, reload open tabs.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      for (const key of await caches.keys()) {
        await caches.delete(key);
      }
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((client) => client.navigate(client.url));
    })(),
  );
});
