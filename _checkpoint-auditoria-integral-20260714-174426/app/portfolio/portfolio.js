const features = [
  ["Agenda", "Diaria, semanal y vista de periodo, con citas por minutos reales y gestión de disponibilidad."],
  ["Pacientes", "Ficha clínica, historial, consentimientos, adjuntos, bonos y datos personales."],
  ["Roles", "Dirección, trabajadores, recepción y permisos preparados para operar por clínica."],
  ["Facturación", "Cobros, pagos, métodos, movimientos, filtros, bonos y control de importes."],
  ["Clases grupales", "Sesiones recurrentes, alumnos fijos, cuotas mensuales y rendimiento asociado."],
  ["Bonos", "Asignación, consumo, caducidad, control de sesiones y bloqueo de saldos agotados."],
  ["Rendimiento", "Métricas por trabajador, operaciones, facturación y comisiones por servicio."],
  ["Recordatorios", "Recordatorios asociados a citas y mensajes base configurables por clínica."],
  ["Superadmin", "Panel SaaS para clínicas, usuarios, auditoría, soporte, accesos e incidencias."],
  ["Stripe", "Suscripciones, checkout, portal de pagos, webhooks y estado de plan."],
  ["Google Login", "Acceso adicional con Google sin sustituir email y contraseña tradicional."],
  ["PWA", "Instalable y preparada para web, escritorio, móvil y trabajo multidispositivo."]
];

const challenges = [
  ["Separación de datos entre clínicas", "Evolución del modelo hacia multi-tenant, evitando contaminación entre clínicas y preparando auditoría por organización."],
  ["Sincronización entre dispositivos", "Migración progresiva de datos críticos a backend para que Windows, macOS, móvil y PWA compartan la misma fuente de verdad."],
  ["Persistencia backend vs localStorage", "Reducción del uso de almacenamiento local para que agenda, cobros, trabajadores y pacientes no dependan de caché del navegador."],
  ["Agenda por minutos reales", "Visualización y validación de citas con duraciones de 30, 45, 50 o 60 minutos, evitando bloques fijos de una hora."],
  ["Cobros sin duplicados", "Diseño de flujos idempotentes para que una cita cobrada no genere movimientos repetidos ni vuelva a pendiente al recargar."],
  ["Roles y permisos", "Separación de Dirección, trabajadores, recepción y superadmin, con recuperación de acceso y gestión de usuarios."],
  ["Superadmin operativo", "Panel para supervisar clínicas, usuarios, auditoría, soporte, incidencias de acceso y acciones administrativas."],
  ["PWA y caché", "Control de service worker y versiones para evitar que móvil o app instalada sirvan código antiguo en flujos críticos."]
];

const captures = [
  ["Landing", "Entrada SaaS y selección de plan."],
  ["Login", "Acceso tradicional y Google Login."],
  ["Agenda", "Vista diaria/semanal con citas reales."],
  ["Facturación", "Cobros, filtros, resumen y movimientos."],
  ["Superadmin", "Operación SaaS, usuarios y auditoría."],
  ["Mi suscripción", "Plan, Stripe y portal de pagos."],
  ["Móvil/PWA", "Experiencia instalada y responsive."]
];

const metrics = [
  ["Producción", "Proyecto en producción"],
  ["Backend", "API desplegada"],
  ["PostgreSQL", "Base de datos real"],
  ["Stripe", "Pagos configurados"],
  ["Cliente", "Primera clínica real"],
  ["Objetivo", "Hasta 100 clínicas"]
];

const stack = ["JavaScript", "Python", "FastAPI", "PostgreSQL", "Render", "Vercel", "Stripe", "Google OAuth", "PWA", "GitHub"];

function iconText(label) {
  return label
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderFeatures() {
  const container = document.querySelector("#feature-grid");
  if (!container) return;
  container.innerHTML = features.map(([title, text]) => `
    <article class="feature-card">
      <span class="icon">${iconText(title)}</span>
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    </article>
  `).join("");
}

function renderChallenges() {
  const container = document.querySelector("#challenge-list");
  if (!container) return;
  container.innerHTML = challenges.map(([title, text], index) => `
    <article class="challenge-card">
      <span class="challenge-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    </article>
  `).join("");
}

function renderCaptures() {
  const container = document.querySelector("#capture-grid");
  if (!container) return;
  container.innerHTML = captures.map(([title, text]) => `
    <article class="capture-card">
      <div class="capture-thumb" aria-hidden="true">
        <div class="mock-lines"><span></span><span></span><span></span></div>
      </div>
      <div>
        <span class="card-kicker">Captura preparada</span>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    </article>
  `).join("");
}

function renderMetrics() {
  const container = document.querySelector("#metric-grid");
  if (!container) return;
  container.innerHTML = metrics.map(([label, value]) => `
    <article class="metric-card">
      <strong>${label}</strong>
      <span>${value}</span>
    </article>
  `).join("");
}

function renderStack() {
  const container = document.querySelector("#stack-list");
  if (!container) return;
  container.innerHTML = stack.map((item) => `<span class="stack-pill">${item}</span>`).join("");
}

renderFeatures();
renderChallenges();
renderCaptures();
renderMetrics();
renderStack();
