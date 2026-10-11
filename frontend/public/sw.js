// Thynk service worker.
// - Precaches the offline page and app icons.
// - Page navigations: network first, falling back to /offline when there's no connection.
// - Hashed build assets (/_next/static), fonts and icons: cache first (their URLs change on every deploy).
// Bump VERSION to drop old caches.

const VERSION = "v1";
const CACHE = `thynk-${VERSION}`;
const PRECACHE = ["/offline", "/icons/icon-192.png", "/icons/icon-512.png", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(PRECACHE);
      // Also cache the CSS/JS/fonts the offline page needs, so it renders styled with no network.
      const html = await (await cache.match("/offline")).text();
      const assets = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s)?]+/g)].map((m) => m[0]))];
      await cache.addAll(assets).catch(() => {});
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline")));
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/fonts/") || url.pathname.startsWith("/icons/");
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
