(() => {
  "use strict";

  const API_BASE = window.location.hostname.endsWith(".vercel.app")
    ? "https://klinia-api-staging.onrender.com"
    : (String(window.KLINIA_API_BASE_URL || "").trim().replace(/\/$/, "")
      || "https://api.kliniasolutions.com");
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = decodeURIComponent(pathParts[pathParts.length - 1] || "");
  const state = {
    config: null,
    step: 1,
    serviceId: "",
    practitionerId: "",
    selectedSlot: null,
    slots: [],
    idempotencyKey: window.crypto?.randomUUID?.() || `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`
  };

  const byId = (id) => document.getElementById(id);
  const form = byId("booking-form");

  function escapeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) {
        const error = new Error(body?.detail || "No se pudo completar la operación.");
        error.status = response.status;
        throw error;
      }
      return body;
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("La comprobación está tardando demasiado. Inténtalo de nuevo.");
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function showAlert(message = "") {
    const alert = byId("booking-alert");
    alert.textContent = message;
    alert.hidden = !message;
    if (message) alert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function selectedService() {
    return state.config?.services?.find((item) => item.id === state.serviceId) || null;
  }

  function selectedPractitioner() {
    const configured = state.config?.practitioners?.find((item) => item.id === state.practitionerId);
    if (configured) return configured;
    if (!state.config?.settings?.allow_professional_selection && state.selectedSlot) {
      return { id: state.selectedSlot.practitioner_id, name: "Asignado por la clínica" };
    }
    return null;
  }

  function money(cents) {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(cents || 0) / 100);
  }

  function formatDate(value) {
    if (!value) return "";
    const parsed = new Date(`${value}T12:00:00`);
    return parsed.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function optionMarkup(item, type) {
    const isService = type === "service";
    const meta = [];
    if (isService && item.duration_minutes) meta.push(`${Number(item.duration_minutes)} min`);
    if (isService && item.price_cents !== null && item.price_cents !== undefined) meta.push(money(item.price_cents));
    return `
      <label class="booking-option">
        <input type="radio" name="${type}" value="${item.id}" />
        <span>
          <strong>${escapeText(item.name)}</strong>
          ${item.specialty ? `<small>${escapeText(item.specialty)}</small>` : ""}
        </span>
        ${meta.length ? `<span class="booking-option-meta">${escapeText(meta.join(" · "))}</span>` : ""}
      </label>
    `;
  }

  function renderConfig() {
    const config = state.config;
    document.title = `Reservar cita en ${config.clinic.name} | Klinia`;
    byId("header-clinic-name").textContent = config.clinic.name;
    byId("booking-clinic-copy").textContent = `Reserva directamente con ${config.clinic.name}.`;

    const services = byId("booking-services");
    services.innerHTML = config.services.length
      ? config.services.map((item) => optionMarkup(item, "service")).join("")
      : '<p class="booking-empty">La clínica todavía no ha publicado servicios reservables.</p>';

    const practitioners = byId("booking-practitioners");
    practitioners.innerHTML = config.practitioners.length
      ? config.practitioners.map((item) => optionMarkup(item, "practitioner")).join("")
      : '<p class="booking-empty">La clínica asignará automáticamente un profesional disponible.</p>';

    if (!config.settings.allow_professional_selection) {
      document.querySelector('[data-progress-step="2"]').hidden = true;
    }

    const dateInput = byId("booking-date");
    const today = new Date();
    const maximum = new Date(today);
    maximum.setDate(maximum.getDate() + Number(config.settings.max_days_ahead || 90));
    const iso = (dateValue) => {
      const offset = dateValue.getTimezoneOffset();
      return new Date(dateValue.getTime() - offset * 60_000).toISOString().slice(0, 10);
    };
    dateInput.min = iso(today);
    dateInput.max = iso(maximum);
  }

  function setStep(nextStep) {
    const allowProfessional = state.config?.settings?.allow_professional_selection !== false;
    if (!allowProfessional && nextStep === 2) nextStep = 3;
    state.step = Math.max(1, Math.min(4, nextStep));
    document.querySelectorAll("[data-booking-step]").forEach((section) => {
      const active = Number(section.dataset.bookingStep) === state.step;
      section.classList.toggle("active", active);
      section.hidden = !active;
    });
    document.querySelectorAll("[data-progress-step]").forEach((item) => {
      const step = Number(item.dataset.progressStep);
      item.classList.toggle("active", step <= state.step);
    });
    if (state.step === 4) renderSummary();
    showAlert("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateStep() {
    if (state.step === 1 && !state.serviceId) {
      showAlert("Selecciona un servicio para continuar.");
      return false;
    }
    if (state.step === 2 && !state.practitionerId) {
      showAlert("Selecciona un profesional para continuar.");
      return false;
    }
    if (state.step === 3 && !state.selectedSlot) {
      showAlert("Selecciona una fecha y un horario disponible.");
      return false;
    }
    return true;
  }

  async function loadAvailability() {
    const bookingDate = byId("booking-date").value;
    state.selectedSlot = null;
    state.slots = [];
    renderSlots();
    if (!bookingDate || !state.serviceId) {
      byId("slots-status").textContent = "Selecciona una fecha.";
      return;
    }
    if (state.config.settings.allow_professional_selection && !state.practitionerId) {
      byId("slots-status").textContent = "Selecciona primero un profesional.";
      return;
    }
    byId("slots-status").textContent = "Comprobando huecos disponibles...";
    const params = new URLSearchParams({
      service_id: state.serviceId,
      booking_date: bookingDate
    });
    if (state.practitionerId) params.set("practitioner_id", state.practitionerId);
    try {
      const response = await api(`/public/bookings/${encodeURIComponent(slug)}/availability?${params}`);
      state.slots = response.slots || [];
      byId("slots-status").textContent = state.slots.length
        ? `${state.slots.length} horario(s) disponible(s).`
        : "No hay huecos disponibles para esta fecha.";
      renderSlots();
    } catch (error) {
      byId("slots-status").textContent = "";
      showAlert(error.message || "No se pudo consultar la disponibilidad. Inténtalo de nuevo.");
    }
  }

  function renderSlots() {
    const container = byId("booking-slots");
    container.innerHTML = state.slots.map((slot, index) => `
      <button class="slot-button ${state.selectedSlot === slot ? "selected" : ""}" type="button" data-slot-index="${index}">
        ${escapeText(slot.start)}
      </button>
    `).join("");
    container.querySelectorAll("[data-slot-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedSlot = state.slots[Number(button.dataset.slotIndex)] || null;
        if (!state.config.settings.allow_professional_selection) {
          state.practitionerId = state.selectedSlot?.practitioner_id || "";
        }
        renderSlots();
      });
    });
  }

  function renderSummary() {
    const service = selectedService();
    const practitioner = selectedPractitioner();
    const bookingDate = byId("booking-date").value;
    byId("booking-summary").innerHTML = `
      <div><span>Clínica</span><strong>${escapeText(state.config.clinic.name)}</strong></div>
      <div><span>Servicio</span><strong>${escapeText(service?.name || "")}</strong></div>
      <div><span>Profesional</span><strong>${escapeText(practitioner?.name || "Asignado por la clínica")}</strong></div>
      <div><span>Fecha y hora</span><strong>${escapeText(formatDate(bookingDate))} · ${escapeText(state.selectedSlot?.start || "")}</strong></div>
    `;
  }

  function previousStep() {
    const allowProfessional = state.config?.settings?.allow_professional_selection !== false;
    if (!allowProfessional && state.step === 3) {
      setStep(1);
      return;
    }
    setStep(state.step - 1);
  }

  async function submitBooking(event) {
    event.preventDefault();
    showAlert("");
    if (!state.selectedSlot || !state.serviceId || !state.practitionerId) {
      setStep(3);
      showAlert("Selecciona de nuevo un horario disponible.");
      return;
    }
    if (!form.reportValidity()) return;
    const button = byId("confirm-booking");
    button.disabled = true;
    button.textContent = "Confirmando...";
    const values = new FormData(form);
    try {
      const result = await api(`/public/bookings/${encodeURIComponent(slug)}`, {
        method: "POST",
        body: JSON.stringify({
          service_id: state.serviceId,
          practitioner_id: state.practitionerId,
          booking_date: byId("booking-date").value,
          start: state.selectedSlot.start,
          first_name: String(values.get("firstName") || "").trim(),
          last_name: String(values.get("lastName") || "").trim(),
          phone: String(values.get("phone") || "").trim(),
          email: String(values.get("email") || "").trim(),
          notes: String(values.get("notes") || "").trim() || null,
          website: String(values.get("website") || ""),
          idempotency_key: state.idempotencyKey
        })
      });
      form.hidden = true;
      byId("booking-progress").hidden = true;
      const success = byId("booking-success");
      success.hidden = false;
      byId("booking-result").innerHTML = [
        ["Clínica", result.clinic],
        ["Servicio", result.service],
        ["Profesional", result.professional],
        ["Fecha", formatDate(result.date)],
        ["Hora", `${result.start} - ${result.end}`],
        ["Referencia", result.booking_id]
      ].map(([label, value]) => `<div><dt>${escapeText(label)}</dt><dd>${escapeText(value)}</dd></div>`).join("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error.status === 409) {
        state.selectedSlot = null;
        state.idempotencyKey = window.crypto?.randomUUID?.() || `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setStep(3);
        await loadAvailability();
        showAlert("Este horario acaba de dejar de estar disponible. Elige otro hueco.");
      } else {
        showAlert(error.message || "No se pudo confirmar la reserva. Inténtalo de nuevo.");
      }
    } finally {
      button.disabled = false;
      button.textContent = "Confirmar reserva";
    }
  }

  function bind() {
    form.addEventListener("change", (event) => {
      if (event.target.name === "service") {
        state.serviceId = event.target.value;
        state.selectedSlot = null;
      }
      if (event.target.name === "practitioner") {
        state.practitionerId = event.target.value;
        state.selectedSlot = null;
      }
    });
    byId("booking-date").addEventListener("change", loadAvailability);
    document.querySelectorAll("[data-next-step]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!validateStep()) return;
        const allowProfessional = state.config?.settings?.allow_professional_selection !== false;
        const next = !allowProfessional && state.step === 1 ? 3 : state.step + 1;
        setStep(next);
        if (next === 3 && byId("booking-date").value) await loadAvailability();
      });
    });
    document.querySelectorAll("[data-previous-step]").forEach((button) => button.addEventListener("click", previousStep));
    form.addEventListener("submit", submitBooking);
  }

  async function initialize() {
    if (!slug || slug === "reservar") {
      showAlert("Este enlace de reservas no es válido.");
      form.hidden = true;
      return;
    }
    try {
      state.config = await api(`/public/bookings/${encodeURIComponent(slug)}`);
      renderConfig();
      bind();
    } catch (error) {
      byId("booking-clinic-copy").textContent = "No se pudo abrir este enlace de reservas.";
      showAlert(error.message || "Este enlace de reservas no está disponible.");
      form.hidden = true;
      byId("booking-progress").hidden = true;
    }
  }

  initialize();
})();
