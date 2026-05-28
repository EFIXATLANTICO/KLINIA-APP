const KLINIA_CACHE = "klinia-config-workers-backend-ledger-20260528";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260528-config-workers-backend-ledger",
  "./app.js?v=20260528-config-workers-backend-ledger",
  "./manifest.webmanifest",
  "./offline.html",
  "./assets/klinia-logo.svg",
  "./assets/klinia-icon-192.png",
  "./assets/klinia-icon-512.png"
];

const BACKEND_SOURCE_HOTFIX = `
;(() => {
  const KLINIA_BACKEND_SOURCE_HOTFIX = "20260524-backend-source-sw";
  const isRealClinicInProduction = () => {
    try {
      const account = currentClinicAccount();
      return backendRequiredForProduction() && account?.key !== demoClinicKey;
    } catch {
      return false;
    }
  };

  if (typeof canFallbackToLocalLogin === "function") {
    canFallbackToLocalLogin = function canFallbackToLocalLoginPatched(error) {
      if (!error) return true;
      if (!backendRequiredForProduction()) return true;
      return false;
    };
  }

  if (typeof ensureBackendLoginForAccount === "function") {
    const originalEnsureBackendLoginForAccount = ensureBackendLoginForAccount;
    ensureBackendLoginForAccount = async function ensureBackendLoginForAccountPatched(account, password) {
      try {
        return await originalEnsureBackendLoginForAccount(account, password);
      } catch (error) {
        if (backendRequiredForProduction()) throw error;
        return undefined;
      }
    };
  }

  const requireBackendSession = (action) => {
    if (!isRealClinicInProduction() || backendDataEnabled()) return false;
    throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para " + action + ".");
  };

  if (typeof savePatientToBackend === "function") {
    const originalSavePatientToBackend = savePatientToBackend;
    savePatientToBackend = async function savePatientToBackendPatched(patient, previousId = "") {
      requireBackendSession("guardar pacientes");
      return originalSavePatientToBackend(patient, previousId);
    };
  }

  if (typeof deletePatientFromBackend === "function") {
    const originalDeletePatientFromBackend = deletePatientFromBackend;
    deletePatientFromBackend = async function deletePatientFromBackendPatched(patientId) {
      requireBackendSession("eliminar pacientes");
      return originalDeletePatientFromBackend(patientId);
    };
  }

  if (typeof savePractitionerToBackend === "function") {
    const originalSavePractitionerToBackend = savePractitionerToBackend;
    savePractitionerToBackend = async function savePractitionerToBackendPatched(practitioner, previousId = "") {
      requireBackendSession("guardar trabajadores");
      return originalSavePractitionerToBackend(practitioner, previousId);
    };
  }

  if (typeof deletePractitionerFromBackend === "function") {
    const originalDeletePractitionerFromBackend = deletePractitionerFromBackend;
    deletePractitionerFromBackend = async function deletePractitionerFromBackendPatched(practitionerId) {
      requireBackendSession("eliminar trabajadores");
      return originalDeletePractitionerFromBackend(practitionerId);
    };
  }

  if (typeof saveAppointmentToBackend === "function") {
    const originalSaveAppointmentToBackend = saveAppointmentToBackend;
    saveAppointmentToBackend = async function saveAppointmentToBackendPatched(appointment, previousId = "") {
      requireBackendSession("guardar citas");
      return originalSaveAppointmentToBackend(appointment, previousId);
    };
  }

  const clearBackendlessSession = (message) => {
    isAuthenticated = false;
    saveState("authenticated", false);
    saveState("authenticated-at", 0);
    applyLoginState();
    showPublicView("login", { updateHash: true, resetLogin: true });
    showClinicLoginStep({ skipPublicView: true, allowSavedCredentials: false });
    if (message) showLoginError(message, document.querySelector("#login-form")?.elements?.center || null);
  };

  const validateCurrentBackendSession = async () => {
    if (!isAuthenticated || !isRealClinicInProduction()) return;
    const account = currentClinicAccount();
    if (!backendTokenForAccount(account)) {
      clearBackendlessSession("La sesion guardada no esta enlazada al backend. Inicia sesion de nuevo.");
      return;
    }
    try {
      await backendRequest("/me", { account });
      await hydrateFromApi();
    } catch (error) {
      if ([401, 403].includes(error.status)) {
        clearBackendlessSession("Tu sesion ha caducado. Inicia sesion de nuevo para cargar los datos reales.");
      } else {
        showToast("No se pudo sincronizar con backend: " + error.message, "warning");
      }
    }
  };

  validateCurrentBackendSession();
  console.info("Klinia backend source hotfix activo", KLINIA_BACKEND_SOURCE_HOTFIX);
})();
`;

async function appJsWithBackendSourceHotfix(request) {
  let response;
  try {
    response = await fetch(request, { cache: "no-store" });
  } catch {
    response = await caches.match(request) || await caches.match("./app.js?v=20260523-login-support");
  }
  if (!response) {
    return fetch(request);
  }
  let source = await response.clone().text();
  if (!source.includes("KLINIA_BACKEND_SOURCE_HOTFIX")) {
    source = `${source}\n${BACKEND_SOURCE_HOTFIX}`;
  }
  const patched = new Response(source, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
  const cache = await caches.open(KLINIA_CACHE);
  cache.put(request, patched.clone()).catch(() => null);
  return patched;
}

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
  if (requestUrl.pathname.endsWith("/app.js")) {
    event.respondWith(appJsWithBackendSourceHotfix(event.request));
    return;
  }
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
