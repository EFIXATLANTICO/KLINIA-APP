const KLINIA_CACHE = "klinia-20260806-settings-permissions";
const KLINIA_PWA_ASSET_CACHE = "klinia-pwa-assets-20260728-icons-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260806-settings-permissions",
  "./app.js?v=20260806-settings-permissions",
  "./offline.html",
  "./assets/klinia-logo.svg"
];
const PWA_ASSETS = [
  "/manifest.webmanifest?v=20260728-pwa-icons-v2",
  "/favicon.ico?v=20260728-pwa-icons-v2",
  "/icons/favicon-16x16.png?v=20260728-pwa-icons-v2",
  "/icons/favicon-32x32.png?v=20260728-pwa-icons-v2",
  "/icons/favicon-48x48.png?v=20260728-pwa-icons-v2",
  "/icons/apple-touch-icon.png?v=20260728-pwa-icons-v2",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-192.png",
  "/icons/icon-maskable-512.png",
  "/icons/mstile-150x150.png?v=20260728-pwa-icons-v2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(KLINIA_CACHE).then((cache) => cache.addAll(APP_SHELL)),
      caches.open(KLINIA_PWA_ASSET_CACHE).then((cache) => cache.addAll(PWA_ASSETS))
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("klinia-") && ![KLINIA_CACHE, KLINIA_PWA_ASSET_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
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

  if (
    requestUrl.pathname === "/manifest.webmanifest" ||
    requestUrl.pathname === "/favicon.ico" ||
    requestUrl.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_PWA_ASSET_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match(event.request))
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
