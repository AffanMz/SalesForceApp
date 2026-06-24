const CACHE_NAME = "salesforce-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "index.html",
  "logo.svg",
  "manifest.json"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell and core assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network-first, falling back to cache offline)
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Cache resource if it is a valid network request
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, resClone);
          }
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if network request fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If both fail and request is for page navigation, return index.html
          if (event.request.mode === "navigate") {
            return caches.match("index.html");
          }
        });
      })
  );
});
