const CACHE_NAME = "pdf-merger-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icons/icon-32.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.16.0/pdf-lib.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // Only handle GET requests. File inputs and Blob URLs are not cached.
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // Cache successful same-origin responses for future offline use.
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => {
        // Return the app shell when navigation fails while offline.
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        throw new Error("Offline and resource is not cached.");
      });
    })
  );
});
