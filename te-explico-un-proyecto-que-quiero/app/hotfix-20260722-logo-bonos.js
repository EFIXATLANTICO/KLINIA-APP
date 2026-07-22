(function () {
  const HOTFIX_VERSION = "20260722-bonos-assignment-v2";
  if (window.__kliniaLogoBonosHotfix === HOTFIX_VERSION) {
    return;
  }
  window.__kliniaLogoBonosHotfix = HOTFIX_VERSION;

  const query = (selector, root = document) => root.querySelector(selector);
  const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function getSessionPackList() {
    try {
      return Array.isArray(sessionPacks) ? sessionPacks : [];
    } catch (error) {
      return [];
    }
  }

  function setSessionPackList(next) {
    try {
      sessionPacks = Array.isArray(next) ? next : [];
    } catch (error) {
      console.warn("Klinia hotfix could not update session packs in memory.", error);
    }
  }

  function getPatientPackList() {
    try {
      return Array.isArray(patientPacks) ? patientPacks : [];
    } catch (error) {
      return [];
    }
  }

  function setPatientPackList(next) {
    try {
      patientPacks = Array.isArray(next) ? next : [];
    } catch (error) {
      console.warn("Klinia hotfix could not update patient packs in memory.", error);
    }
  }

  function setClinicLogoValue(next) {
    try {
      clinicLogo = next || "";
    } catch (error) {
      console.warn("Klinia hotfix could not update clinic logo in memory.", error);
    }
  }

  function clinicLogoValue() {
    try {
      return clinicLogo || "";
    } catch (error) {
      return "";
    }
  }

  function showInlineError(selector, message) {
    const target = query(selector);
    if (!target) return;
    target.textContent = message;
    target.classList.add("visible");
  }

  function clearInlineError(selector) {
    const target = query(selector);
    if (!target) return;
    target.textContent = "";
    target.classList.remove("visible");
  }

  function safeToast(message, kind = "warning") {
    if (typeof showToast === "function") {
      showToast(message, kind);
    }
  }

  function nextId(prefix) {
    if (window.crypto?.randomUUID) {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function persistClinicCollection(key, value) {
    if (typeof saveClinicState === "function") {
      saveClinicState(key, value);
    }
    const isSuperadmin = typeof isSuperadminSession === "function" && isSuperadminSession();
    const backendReady = typeof backendDataEnabled === "function" && backendDataEnabled();
    const keySupported = typeof canWriteSyncedClinicDataKey !== "function" || canWriteSyncedClinicDataKey(key);
    if (!isSuperadmin && backendReady && keySupported && typeof saveClinicDataToBackend === "function") {
      await saveClinicDataToBackend(key, value);
      return true;
    }
    if (typeof saveSyncedClinicState === "function") {
      saveSyncedClinicState(key, value);
    }
    return false;
  }

  function packServiceName(pack) {
    try {
      if (typeof packServiceLabel === "function") {
        return packServiceLabel(pack);
      }
      const service = typeof byId === "function" ? byId(services, pack.serviceId) : null;
      return service?.name || "Todos los servicios";
    } catch (error) {
      return "Todos los servicios";
    }
  }

  function fillPatientPackSelector() {
    const select = query("#patient-pack-template");
    if (!select) return;

    const currentValue = select.value;
    const packs = getSessionPackList().filter((pack) => pack && String(pack.id || "").trim());
    select.innerHTML = "";

    const assignButton = query("#assign-patient-pack");
    if (!packs.length) {
      select.append(new Option("Crea un bono en Configuracion", ""));
      select.disabled = true;
      if (assignButton) assignButton.disabled = true;
      return;
    }

    packs.forEach((pack) => {
      const sessions = Number(pack.sessions || 0);
      const price = Number(pack.price || 0);
      const label = `${pack.name || "Bono"} - ${sessions} sesiones - ${price} EUR - ${packServiceName(pack)}`;
      select.append(new Option(label, pack.id));
    });
    select.disabled = false;
    if (assignButton) assignButton.disabled = false;
    select.value = packs.some((pack) => String(pack.id) === String(currentValue)) ? currentValue : packs[0].id;
  }

  function safelyRefreshPackViews() {
    try {
      if (typeof renderCommercialSettings === "function") renderCommercialSettings();
    } catch (error) {
      console.warn("Klinia hotfix could not refresh commercial settings.", error);
    }
    try {
      if (typeof renderPatientDetail === "function") renderPatientDetail();
    } catch (error) {
      console.warn("Klinia hotfix could not refresh patient detail.", error);
    }
    fillPatientPackSelector();
  }

  function installPatientPackSelectorPatch() {
    if (typeof renderPatientDetail === "function" && !renderPatientDetail.__kliniaBonosAssignmentV2) {
      const originalRenderPatientDetail = renderPatientDetail;
      renderPatientDetail = function patchedRenderPatientDetail(...args) {
        const result = originalRenderPatientDetail.apply(this, args);
        fillPatientPackSelector();
        return result;
      };
      renderPatientDetail.__kliniaBonosAssignmentV2 = true;
    }
    if (typeof renderCommercialSettings === "function" && !renderCommercialSettings.__kliniaBonosAssignmentV2) {
      const originalRenderCommercialSettings = renderCommercialSettings;
      renderCommercialSettings = function patchedRenderCommercialSettings(...args) {
        const result = originalRenderCommercialSettings.apply(this, args);
        fillPatientPackSelector();
        return result;
      };
      renderCommercialSettings.__kliniaBonosAssignmentV2 = true;
    }
    fillPatientPackSelector();
  }

  async function handleSessionPackSubmit(event) {
    const form = event.target?.closest?.("#session-pack-form");
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    clearInlineError("#session-pack-error");

    const name = form.elements.name.value.trim();
    const sessions = Math.max(1, Number(form.elements.sessions.value || 1));
    const price = Math.max(0, Number(form.elements.price.value || 0));
    if (!name) {
      showInlineError("#session-pack-error", "El nombre del bono es obligatorio.");
      return;
    }

    const previous = getSessionPackList();
    const editingPackId = form.dataset.editingPackId || "";
    const now = new Date().toISOString();
    const existing = previous.find((item) => String(item.id) === String(editingPackId));
    const nextPack = {
      id: editingPackId || nextId("pack"),
      name,
      sessions,
      price,
      expiryMonths: Math.max(0, Number(form.elements.expiryMonths?.value || 0)),
      serviceId: form.elements.serviceId?.value || "",
      invoice: Boolean(form.elements.invoice?.checked),
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };
    const next = editingPackId
      ? previous.map((item) => String(item.id) === String(editingPackId) ? { ...item, ...nextPack } : item)
      : [...previous, nextPack];

    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setSessionPackList(next);

    try {
      await persistClinicCollection("session-packs", next);
    } catch (error) {
      setSessionPackList(previous);
      if (typeof saveClinicState === "function") saveClinicState("session-packs", previous);
      fillPatientPackSelector();
      const message = error?.message || "No se pudo guardar el bono en la nube.";
      showInlineError("#session-pack-error", message);
      safeToast(message, "error");
      console.warn("Klinia session pack persistence failed", error);
      if (submitButton) submitButton.disabled = false;
      return;
    }

    query("#session-pack-dialog")?.close();
    safelyRefreshPackViews();
    safeToast("Bono guardado y disponible en Pacientes.", "success");
    if (submitButton) submitButton.disabled = false;
  }

  async function handleSessionPackDelete(event) {
    const form = event.target?.closest?.("#session-pack-delete-form");
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const deletePackId = form.dataset.deletePackId;
    if (!deletePackId) return;
    const previous = getSessionPackList();
    const next = previous.filter((item) => String(item.id) !== String(deletePackId));
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setSessionPackList(next);

    try {
      await persistClinicCollection("session-packs", next);
    } catch (error) {
      setSessionPackList(previous);
      if (typeof saveClinicState === "function") saveClinicState("session-packs", previous);
      fillPatientPackSelector();
      const message = error?.message || "No se pudo eliminar el bono en la nube.";
      safeToast(message, "error");
      console.warn("Klinia session pack deletion failed", error);
      if (submitButton) submitButton.disabled = false;
      return;
    }

    query("#session-pack-delete-dialog")?.close();
    safelyRefreshPackViews();
    safeToast("Bono eliminado de la configuracion.", "success");
    if (submitButton) submitButton.disabled = false;
  }

  async function handlePatientPackAssign(event) {
    const button = event.target?.closest?.("#assign-patient-pack");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fillPatientPackSelector();

    const patient = typeof byId === "function" ? byId(patients, selectedPatientId) : null;
    const pack = typeof byId === "function" ? byId(getSessionPackList(), query("#patient-pack-template")?.value) : null;
    const list = query("#patient-packs");
    if (!patient || !pack) {
      if (list) list.innerHTML = '<article class="compact-item"><span>Crea primero un bono en Configuracion.</span></article>';
      return;
    }

    const previous = getPatientPackList();
    const now = new Date().toISOString();
    const nextPack = {
      id: nextId("patient-pack"),
      patientId: patient.id,
      packId: pack.id,
      name: pack.name,
      sessions: Number(pack.sessions || 1),
      used: 0,
      price: Number(pack.price || 0),
      serviceId: pack.serviceId || "",
      invoice: pack.invoice,
      expiresAt: typeof sessionPackExpiryDate === "function" ? sessionPackExpiryDate(pack) : "",
      createdAt: new Date().toLocaleString("es-ES"),
      createdAtIso: now,
      updatedAt: now
    };
    const next = [...previous, nextPack];
    button.disabled = true;
    setPatientPackList(next);

    try {
      await persistClinicCollection("patient-packs", next);
    } catch (error) {
      setPatientPackList(previous);
      if (typeof saveClinicState === "function") saveClinicState("patient-packs", previous);
      safelyRefreshPackViews();
      const message = error?.message || "No se pudo asignar el bono al paciente.";
      safeToast(message, "error");
      console.warn("Klinia patient pack assignment failed", error);
      if (button.isConnected) button.disabled = false;
      return;
    }

    safelyRefreshPackViews();
    safeToast("Bono asignado al paciente.", "success");
    if (button.isConnected) button.disabled = false;
  }

  async function handleClinicLogoChange(event) {
    const input = event.target?.closest?.("#clinic-logo-input");
    if (!input) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const file = input.files?.[0];
    const status = query("#clinic-logo-status");
    if (!file) return;
    if (status) status.textContent = "Validando logo...";
    const previous = clinicLogoValue();

    try {
      if (typeof readClinicLogoFile !== "function") {
        throw new Error("No se pudo leer el logo seleccionado.");
      }
      const nextLogo = await readClinicLogoFile(file);
      setClinicLogoValue(nextLogo);
      if (status) status.textContent = "Guardando logo en la nube...";
      if (typeof updateClinicLogoPreview === "function") updateClinicLogoPreview();
      await persistClinicCollection("clinic-logo", nextLogo);
      if (status) status.textContent = "Logo guardado para esta clinica.";
      safeToast("Logo guardado para esta clinica.", "success");
    } catch (error) {
      input.value = "";
      setClinicLogoValue(previous);
      if (typeof saveClinicState === "function") saveClinicState("clinic-logo", previous);
      if (typeof updateClinicLogoPreview === "function") updateClinicLogoPreview();
      const message = error?.message || "No se pudo guardar el logo.";
      if (status) status.textContent = message;
      safeToast(message, "warning");
      console.warn("Klinia clinic logo persistence failed", error);
    }
  }

  async function handleClinicLogoRemove(event) {
    const button = event.target?.closest?.("#remove-clinic-logo");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const previous = clinicLogoValue();
    const status = query("#clinic-logo-status");
    button.disabled = true;
    try {
      setClinicLogoValue("");
      if (typeof updateClinicLogoPreview === "function") updateClinicLogoPreview();
      if (status) status.textContent = "Eliminando logo...";
      await persistClinicCollection("clinic-logo", "");
      if (status) status.textContent = "Logo eliminado. Se usara el logo de Klinia por defecto.";
      safeToast("Logo eliminado.", "success");
    } catch (error) {
      setClinicLogoValue(previous);
      if (typeof saveClinicState === "function") saveClinicState("clinic-logo", previous);
      if (typeof updateClinicLogoPreview === "function") updateClinicLogoPreview();
      const message = error?.message || "No se pudo eliminar el logo.";
      if (status) status.textContent = message;
      safeToast(message, "warning");
      console.warn("Klinia clinic logo removal failed", error);
    } finally {
      button.disabled = false;
    }
  }

  function installHotfix() {
    installPatientPackSelectorPatch();
    document.addEventListener("submit", handleSessionPackSubmit, true);
    document.addEventListener("submit", handleSessionPackDelete, true);
    document.addEventListener("click", handlePatientPackAssign, true);
    document.addEventListener("change", handleClinicLogoChange, true);
    document.addEventListener("click", handleClinicLogoRemove, true);
    queryAll('[data-patient-tab="packs"], [data-section="pacientes"], #new-session-pack').forEach((node) => {
      node.addEventListener("click", () => window.setTimeout(fillPatientPackSelector, 0));
    });
    if (document.body && !window.__kliniaBonosAssignmentObserver) {
      window.__kliniaBonosAssignmentObserver = new MutationObserver(() => {
        if (query("#patient-pack-template")) {
          fillPatientPackSelector();
        }
      });
      window.__kliniaBonosAssignmentObserver.observe(document.body, { childList: true, subtree: true });
    }
    window.setTimeout(fillPatientPackSelector, 0);
    window.setTimeout(fillPatientPackSelector, 500);
    window.setTimeout(fillPatientPackSelector, 1500);
    console.info(`Klinia hotfix active: ${HOTFIX_VERSION}`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installHotfix, { once: true });
  } else {
    installHotfix();
  }
})();
