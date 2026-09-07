(() => {
  "use strict";

  const state = {
    loading: null,
    data: null,
    lastLoadedAt: 0,
    calendarsLoaded: false
  };

  const byId = (id) => document.getElementById(id);
  const panel = () => byId("calendar-integration-panel");

  function isBackendReady() {
    try {
      return typeof backendDataEnabled === "function" && backendDataEnabled();
    } catch {
      return false;
    }
  }

  function clinicSignature() {
    try {
      const account = typeof currentClinicAccount === "function" ? currentClinicAccount() : null;
      return String(account?.backendClinicId || account?.key || "");
    } catch {
      return "";
    }
  }

  function friendlyError(error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("autoriza el permiso")) return "Autoriza la sincronización con Google para activar esta opción.";
    if (message.includes("servicio") || message.includes("profesional")) return error.message;
    if (error?.status === 401 || error?.status === 403) return "Tu sesión no permite cambiar esta integración.";
    if (error?.status === 404) return "La conexión con Google Calendar ya no está activa.";
    return "No se pudo completar la operación. Inténtalo de nuevo.";
  }

  function setMessage(text = "", tone = "") {
    const target = byId("calendar-integration-message");
    if (!target) return;
    target.textContent = text;
    target.className = `integration-message ${tone}`.trim();
  }

  function setButtonBusy(button, busy, busyLabel = "Guardando...") {
    if (!button) return;
    if (busy) {
      button.dataset.previousLabel = button.textContent;
      button.textContent = busyLabel;
      button.disabled = true;
      return;
    }
    button.textContent = button.dataset.previousLabel || button.textContent;
    delete button.dataset.previousLabel;
    button.disabled = false;
  }

  function formatDateTime(value) {
    if (!value) return "Todavía no sincronizado";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Todavía no sincronizado";
    return parsed.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  }

  function renderChecklist(container, items, selectedIds, name) {
    if (!container) return;
    const selected = new Set((selectedIds || []).map(String));
    container.innerHTML = items.length
      ? items.map((item) => `
          <label class="integration-choice">
            <input type="checkbox" name="${name}" value="${item.id}" ${selected.has(String(item.id)) ? "checked" : ""} />
            <span>
              <strong>${escapeText(item.name)}</strong>
              ${item.specialty ? `<small>${escapeText(item.specialty)}</small>` : ""}
              ${item.duration_minutes ? `<small>${Number(item.duration_minutes)} min</small>` : ""}
            </span>
          </label>
        `).join("")
      : '<p class="integration-empty">No hay opciones activas configuradas.</p>';
  }

  function escapeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderCalendar(data) {
    const calendar = data.calendar || {};
    const statusNode = byId("google-calendar-status");
    const details = byId("google-calendar-details");
    const connect = byId("connect-google-calendar");
    const disconnect = byId("disconnect-google-calendar");
    const sync = byId("sync-google-calendar");
    const form = byId("google-calendar-settings-form");

    if (statusNode) {
      statusNode.textContent = calendar.connected ? "Conectado" : "No conectado";
      statusNode.className = `status-pill ${calendar.connected ? "success" : ""}`;
    }
    if (connect) {
      connect.hidden = calendar.connected;
      connect.disabled = !calendar.configured;
    }
    if (disconnect) disconnect.hidden = !calendar.connected;
    if (sync) {
      sync.hidden = !calendar.connected;
      sync.disabled = !calendar.connected;
    }
    if (details) details.hidden = !calendar.connected;
    const unavailable = byId("google-calendar-unavailable");
    if (unavailable) {
      unavailable.hidden = calendar.configured;
      unavailable.textContent = "La conexión con Google Calendar no está disponible ahora. Contacta con soporte.";
    }
    if (!form) return;
    form.hidden = !calendar.connected;
    if (!calendar.connected) return;

    byId("google-calendar-account").textContent = calendar.account_email || "Cuenta conectada";
    byId("google-calendar-last-sync").textContent = formatDateTime(calendar.last_synced_at);
    form.elements.blockBusyTimes.checked = calendar.block_busy_times !== false;
    form.elements.pushAppointments.checked = Boolean(calendar.push_klinia_appointments);
    form.elements.importBusyOnly.checked = calendar.import_busy_as_unavailable !== false;
    form.elements.autoSync.checked = calendar.auto_sync !== false;
    form.dataset.writeAuthorized = calendar.write_authorized ? "true" : "false";

    const calendarSelect = form.elements.calendarId;
    if (calendarSelect && !state.calendarsLoaded) {
      calendarSelect.innerHTML = `<option value="${escapeText(calendar.calendar_id || "primary")}">Calendario seleccionado</option>`;
      calendarSelect.value = calendar.calendar_id || "primary";
    }
  }

  function renderBooking(data) {
    const booking = data.booking || {};
    const form = byId("online-booking-settings-form");
    if (!form) return;
    form.elements.enabled.checked = Boolean(booking.enabled);
    form.elements.slug.value = booking.slug || "";
    form.elements.publicUrl.value = booking.public_url || "";
    form.elements.minNoticeMinutes.value = Number(booking.min_notice_minutes ?? 120);
    form.elements.maxDaysAhead.value = Number(booking.max_days_ahead ?? 90);
    form.elements.minCancellationMinutes.value = Number(booking.min_cancellation_minutes ?? 1440);
    form.elements.bufferMinutes.value = Number(booking.buffer_minutes ?? 0);
    form.elements.automaticConfirmation.checked = booking.automatic_confirmation !== false;
    form.elements.allowProfessionalSelection.checked = booking.allow_professional_selection !== false;
    form.elements.showPrice.checked = Boolean(booking.show_price);
    form.elements.showDuration.checked = booking.show_duration !== false;
    renderChecklist(
      byId("online-booking-services"),
      data.available_services || [],
      booking.service_ids || [],
      "serviceIds"
    );
    renderChecklist(
      byId("online-booking-practitioners"),
      data.available_practitioners || [],
      booking.practitioner_ids || [],
      "practitionerIds"
    );
  }

  function render(data) {
    state.data = data;
    renderCalendar(data);
    renderBooking(data);
  }

  async function loadCalendars() {
    const form = byId("google-calendar-settings-form");
    if (!form || !state.data?.calendar?.connected) return;
    const select = form.elements.calendarId;
    if (!select) return;
    try {
      const response = await backendRequest("/integrations/google-calendar/calendars");
      const current = state.data.calendar.calendar_id || "primary";
      select.innerHTML = (response.items || []).map((item) => `
        <option value="${escapeText(item.id)}">${escapeText(item.name)}${item.primary ? " (principal)" : ""}</option>
      `).join("");
      if (![...select.options].some((item) => item.value === current)) {
        select.append(new Option("Calendario conectado", current));
      }
      select.value = current;
      state.calendarsLoaded = true;
    } catch (error) {
      setMessage(friendlyError(error), "error");
    }
  }

  async function refresh({ force = false } = {}) {
    if (!panel() || !isBackendReady()) return null;
    const section = byId("configuracion");
    if (!force && (!section || !section.classList.contains("active"))) return null;
    if (!force && state.data && Date.now() - state.lastLoadedAt < 10_000) return state.data;
    if (state.loading) return state.loading;
    setMessage("Cargando integración...");
    state.loading = backendRequest("/integrations/google-calendar")
      .then((data) => {
        state.lastLoadedAt = Date.now();
        state.calendarsLoaded = false;
        render(data);
        setMessage("");
        if (data.calendar?.connected) loadCalendars();
        return data;
      })
      .catch((error) => {
        setMessage(friendlyError(error), "error");
        throw error;
      })
      .finally(() => {
        state.loading = null;
      });
    return state.loading;
  }

  async function beginGoogleAuthorization(includeWrite) {
    const button = byId("connect-google-calendar");
    setButtonBusy(button, true, "Abriendo Google...");
    setMessage("");
    try {
      const response = await backendRequest(
        `/integrations/google-calendar/oauth/start?include_write=${includeWrite ? "true" : "false"}`
      );
      if (!response.authorization_url) throw new Error("authorization_url_missing");
      window.location.assign(response.authorization_url);
    } catch (error) {
      setButtonBusy(button, false);
      setMessage(friendlyError(error), "error");
    }
  }

  async function saveCalendarSettings(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const wantsWrite = form.elements.pushAppointments.checked;
    if (wantsWrite && form.dataset.writeAuthorized !== "true") {
      await beginGoogleAuthorization(true);
      return;
    }
    setButtonBusy(button, true);
    setMessage("");
    try {
      const data = await backendRequest("/integrations/google-calendar", {
        method: "PATCH",
        body: JSON.stringify({
          calendar_id: form.elements.calendarId.value,
          block_busy_times: form.elements.blockBusyTimes.checked,
          push_klinia_appointments: wantsWrite,
          import_busy_as_unavailable: form.elements.importBusyOnly.checked,
          auto_sync: form.elements.autoSync.checked
        })
      });
      render(data);
      setMessage("Configuración de Google Calendar guardada.", "success");
    } catch (error) {
      setMessage(friendlyError(error), "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function disconnectCalendar() {
    const accepted = typeof showConfirm === "function"
      ? await showConfirm({
          title: "Desconectar Google Calendar",
          message: "Klinia seguirá funcionando y ninguna cita se borrará.",
          confirmLabel: "Desconectar"
        })
      : window.confirm("¿Desconectar Google Calendar? Las citas de Klinia no se borrarán.");
    if (!accepted) return;
    const button = byId("disconnect-google-calendar");
    setButtonBusy(button, true, "Desconectando...");
    try {
      const data = await backendRequest("/integrations/google-calendar/disconnect", { method: "POST" });
      render(data);
      setMessage("Google Calendar se ha desconectado. Las citas de Klinia se mantienen.", "success");
    } catch (error) {
      setMessage(friendlyError(error), "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function syncNow() {
    const button = byId("sync-google-calendar");
    setButtonBusy(button, true, "Sincronizando...");
    setMessage("");
    try {
      const result = await backendRequest("/integrations/google-calendar/sync", { method: "POST" });
      await refresh({ force: true });
      setMessage(
        result.failed
          ? `Sincronización terminada con ${result.failed} cita(s) pendiente(s) de reintento.`
          : "Sincronización completada.",
        result.failed ? "warning" : "success"
      );
    } catch (error) {
      setMessage(friendlyError(error), "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function saveOnlineBookingSettings(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    setButtonBusy(button, true);
    setMessage("");
    const checkedValues = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((item) => item.value);
    try {
      const data = await backendRequest("/integrations/online-booking", {
        method: "PUT",
        body: JSON.stringify({
          enabled: form.elements.enabled.checked,
          slug: form.elements.slug.value.trim() || null,
          min_notice_minutes: Number(form.elements.minNoticeMinutes.value),
          max_days_ahead: Number(form.elements.maxDaysAhead.value),
          min_cancellation_minutes: Number(form.elements.minCancellationMinutes.value),
          buffer_minutes: Number(form.elements.bufferMinutes.value),
          automatic_confirmation: form.elements.automaticConfirmation.checked,
          allow_professional_selection: form.elements.allowProfessionalSelection.checked,
          show_price: form.elements.showPrice.checked,
          show_duration: form.elements.showDuration.checked,
          service_ids: checkedValues("serviceIds"),
          practitioner_ids: checkedValues("practitionerIds")
        })
      });
      render(data);
      setMessage("Reservas online actualizadas.", "success");
    } catch (error) {
      setMessage(friendlyError(error), "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function copyPublicLink() {
    const field = byId("online-booking-public-url");
    if (!field?.value) return;
    try {
      await navigator.clipboard.writeText(field.value);
      setMessage("Enlace de reservas copiado.", "success");
    } catch {
      field.focus();
      field.select();
      document.execCommand("copy");
      setMessage("Enlace de reservas copiado.", "success");
    }
  }

  function handleOAuthResult() {
    const url = new URL(window.location.href);
    const result = url.searchParams.get("calendar_integration");
    if (!result) return;
    url.searchParams.delete("calendar_integration");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    if (result === "connected") {
      setMessage("Google Calendar se ha conectado correctamente.", "success");
      state.lastLoadedAt = 0;
      refresh({ force: true });
    } else if (result === "cancelled") {
      setMessage("La conexión con Google fue cancelada.", "warning");
    } else {
      setMessage("No se pudo completar la conexión con Google Calendar. Inténtalo de nuevo.", "error");
    }
  }

  function bind() {
    if (!panel()) return;
    byId("connect-google-calendar")?.addEventListener("click", () => beginGoogleAuthorization(false));
    byId("disconnect-google-calendar")?.addEventListener("click", disconnectCalendar);
    byId("sync-google-calendar")?.addEventListener("click", syncNow);
    byId("google-calendar-settings-form")?.addEventListener("submit", saveCalendarSettings);
    byId("online-booking-settings-form")?.addEventListener("submit", saveOnlineBookingSettings);
    byId("copy-online-booking-link")?.addEventListener("click", copyPublicLink);
    byId("open-online-booking-link")?.addEventListener("click", () => {
      const url = byId("online-booking-public-url")?.value;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    });
    handleOAuthResult();

    const observer = new MutationObserver(() => {
      if (byId("configuracion")?.classList.contains("active") && clinicSignature()) {
        refresh().catch(() => null);
      }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
    document.addEventListener("click", (event) => {
      if (event.target.closest('[data-section="configuracion"]')) {
        state.lastLoadedAt = 0;
        queueMicrotask(() => refresh({ force: true }).catch(() => null));
      }
    });
    refresh().catch(() => null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }

  window.KliniaCalendarIntegration = { refresh };
})();
