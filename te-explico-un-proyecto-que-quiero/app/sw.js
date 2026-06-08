const KLINIA_CACHE = "klinia-unified-patient-field-20260608";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260608-unified-patient-field",
  "./app.js?v=20260608-unified-patient-field",
  "./manifest.webmanifest",
  "./offline.html",
  "./assets/klinia-logo.svg",
  "./assets/klinia-icon-192.png",
  "./assets/klinia-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(KLINIA_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== KLINIA_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_CACHE).then((cache) => cache.put("./index.html", copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match("./index.html").then((cached) => cached || caches.match("./offline.html")))
    );
    return;
  }

  if (["script", "style", "worker"].includes(event.request.destination)) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match("./offline.html"));
    })
  );
});
