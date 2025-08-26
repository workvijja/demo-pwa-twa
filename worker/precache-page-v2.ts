const _self = self as unknown as ServiceWorkerGlobalScope;
// Precache the main V2 page and its assets
const v2Routes = [
  '/v2',
  '/v2/about',
  '/v2/features',
  '/v2/gallery',
  '/v2/contact',
  // Add other V2 routes as needed
];

_self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2-pages').then((cache) => {
      return cache.addAll(v2Routes);
    })
  );
});

console.log('Service Worker: V2 precaching enabled');
