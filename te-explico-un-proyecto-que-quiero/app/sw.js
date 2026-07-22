const KLINIA_CACHE = "klinia-20260722-logo-bonos-persist";
const KLINIA_HOTFIX_VERSION = "20260722-logo-bonos-persist";
const KLINIA_HOTFIX_SCRIPT = "./hotfix-20260722-logo-bonos.js?v=20260722-logo-bonos-persist";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260722-agenda-bonos-logo-google",
  "./app.js?v=20260722-agenda-bonos-logo-google",
  KLINIA_HOTFIX_SCRIPT,
  "./manifest.webmanifest",
  "./offline.html",
  "./assets/klinia-logo.svg",
  "./assets/klinia-icon-192.png",
  "./assets/klinia-icon-512.png"
];

function responseInitFrom(response, contentType) {
  const headers = new Headers(response.headers);
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "no-store");
  return {
    status: response.status,
    statusText: response.statusText,
    headers
  };
}

async function appendKliniaHotfix(response) {
  if (!response || !response.ok) {
    return response;
  }
  const appSource = await response.text();
  try {
    const hotfixResponse = await fetch(KLINIA_HOTFIX_SCRIPT, { cache: "no-store" });
    if (!hotfixResponse.ok) {
      return new Response(appSource, responseInitFrom(response, "application/javascript; charset=utf-8"));
    }
    const hotfixSource = await hotfixResponse.text();
    return new Response(
      `${appSource}\n\n;/* Klinia hotfix ${KLINIA_HOTFIX_VERSION} */\n${hotfixSource}\n`,
      responseInitFrom(response, "application/javascript; charset=utf-8")
    );
  } catch (error) {
    console.warn("Klinia service worker could not append hotfix.", error);
    return new Response(appSource, responseInitFrom(response, "application/javascript; charset=utf-8"));
  }
}

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

  if (event.request.destination === "script" && requestUrl.pathname.endsWith("/app.js")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => appendKliniaHotfix(response))
        .then((response) => {
          const copy = response.clone();
          caches.open(KLINIA_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => null);
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./offline.html")))
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


