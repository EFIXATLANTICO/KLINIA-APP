const KLINIA_CACHE = "klinia-login-superadmin-fix-20260521";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260521-login-superadmin-fix",
  "./app.js?v=20260521-login-superadmin-fix",
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
      .then(() => self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      .then((clients) => Promise.all(clients.map((client) => client.navigate(client.url).catch(() => null))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const isFreshAsset = event.request.mode === "navigate" || ["script", "style", "worker"].includes(event.request.destination);
  if (isFreshAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_CACHE).then((cache) => cache.put(event.request, copy));
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
          caches.open(KLINIA_CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./offline.html"));
    })
  );
});
