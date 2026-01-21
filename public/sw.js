// Travelama Service Worker for offline caching of guest property pages
const CACHE_NAME = "travelama-v1";
const PROPERTY_CACHE_NAME = "travelama-properties-v1";

// Static assets to cache on install
const STATIC_ASSETS = [
  "/offline.html",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Keep current versions of our caches
            return name !== CACHE_NAME && name !== PROPERTY_CACHE_NAME;
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Handle property page requests (/stay/*)
  if (url.pathname.startsWith("/stay/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Try to return cached response
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if no cached version
            return caches.match("/offline.html");
          });
        })
    );
    return;
  }

  // Handle property data API requests
  if (url.pathname.startsWith("/api/property/")) {
    event.respondWith(
      caches.open(PROPERTY_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Handle static assets (JS, CSS, images)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
});

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_PROPERTY") {
    const { slug, data, version } = event.data;
    caches.open(PROPERTY_CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify({ data, version }), {
        headers: { "Content-Type": "application/json" },
      });
      cache.put(`/api/property/${slug}`, response);
    });
  }

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
