const defaultPractitioners = [
  { id: "ana", name: "Ana Martin", specialty: "Fisioterapia deportiva", color: "#11736d", commissionRate: 0.42, target: 2600, availabilityStart: "08:00", availabilityEnd: "15:00" },
  { id: "luis", name: "Luis Ortega", specialty: "Readaptacion", color: "#436c9f", commissionRate: 0.38, target: 2400, availabilityStart: "09:00", availabilityEnd: "18:00" },
  { id: "clara", name: "Clara Vidal", specialty: "Suelo pelvico", color: "#c9624b", commissionRate: 0.45, target: 2200, availabilityStart: "10:00", availabilityEnd: "20:00" }
];

const defaultRooms = [
  { id: "sala-1", name: "Sala 1", type: "Camilla" },
  { id: "sala-2", name: "Sala 2", type: "Camilla" },
  { id: "gimnasio", name: "Gimnasio", type: "Ejercicio terapeutico" },
  { id: "sala-grupal", name: "Sala grupal", type: "Sesion grupal" }
];

const defaultServices = [
  { id: "fisio", name: "Fisioterapia general", description: "Tratamiento individual", duration: 60, price: 45, active: true },
  { id: "deportiva", name: "Fisioterapia deportiva", description: "Lesiones y sobrecargas deportivas", duration: 60, price: 55, active: true },
  { id: "readaptacion", name: "Readaptacion", description: "Trabajo funcional y fuerza", duration: 75, price: 65, active: true },
  { id: "sesion-grupal", name: "Sesion grupal", description: "Actividad grupal", duration: 50, price: 12, active: true, type: "group", capacity: 6, monthlyPrice: 45, dropInPrice: 12, commissionPerPatient: 35 }
];

const defaultPatients = [
  { id: "p1", name: "Marta Soler", phone: "600 123 456", email: "marta@example.com", last: "23 abr", status: "Activo", alert: "Dolor lumbar recurrente" },
  { id: "p2", name: "Carlos Ruiz", phone: "611 234 567", email: "carlos@example.com", last: "25 abr", status: "Activo", alert: "Recuperacion de rodilla" },
  { id: "p3", name: "Elena Pardo", phone: "622 345 678", email: "elena@example.com", last: "18 abr", status: "Revision", alert: "Revisar evolucion cervical" },
  { id: "p4", name: "Javier Lobo", phone: "633 456 789", email: "javier@example.com", last: "26 abr", status: "Activo", alert: "Sin alertas relevantes" }
];

const defaultClinic = {
  name: "Clinica Demo Klinia",
  email: "demo@klinia.local",
  phone: "600 000 000"
};

const saasPlans = [
  { id: "trial", name: "Demo", price: 0, interval: "1 mes gratis", summary: "Demo - 1 mes gratis" },
  { id: "kliniaplan", name: "Kliniaplan", price: 50, interval: "mes", summary: "Kliniaplan - 50 EUR/mes" }
];

function todayIso(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const defaultAppointments = [
  { id: 1, date: todayIso(), patientId: "p1", practitionerId: "ana", roomId: "sala-1", serviceId: "deportiva", start: "09:00", status: "confirmed", internalNotes: "" },
  { id: 2, date: todayIso(), patientId: "p2", practitionerId: "luis", roomId: "gimnasio", serviceId: "readaptacion", start: "10:00", status: "confirmed", internalNotes: "" },
  { id: 3, date: todayIso(), patientId: "p3", practitionerId: "clara", roomId: "sala-2", serviceId: "fisio", start: "11:00", status: "pending", internalNotes: "" },
  { id: 4, date: todayIso(1), patientId: "p4", practitionerId: "ana", roomId: "sala-1", serviceId: "fisio", start: "13:00", status: "completed", internalNotes: "Sesion realizada y cobrada en clinica." },
  { id: 5, date: todayIso(7), patientId: "p1", practitionerId: "clara", roomId: "sala-grupal", serviceId: "sesion-grupal", start: "16:00", status: "confirmed", internalNotes: "" }
];

const defaultGroups = [
  {
    id: "grp-demo-sesion-grupal",
    name: "Sesion grupal tarde",
    serviceId: "sesion-grupal",
    practitionerId: "clara",
    roomId: "sala-grupal",
    days: ["mon", "wed"],
    start: "18:00",
    capacity: 6,
    monthlyPrice: 45,
    dropInPrice: 12,
    commissionPerPatient: 35,
    patientIds: ["p1", "p3"],
    active: true
  }
];

const defaultClinicalNotes = [
  { id: 1, patientId: "p1", date: "2026-04-23", author: "Ana Martin", content: "Mejora de movilidad lumbar. Mantener ejercicios domiciliarios." },
  { id: 2, patientId: "p2", date: "2026-04-25", author: "Luis Ortega", content: "Buena tolerancia a carga progresiva. Revisar carrera en proxima sesion." }
];

const defaultAvailabilityBlocks = [];

const workerColorPalette = ["#11736d", "#436c9f", "#c9624b", "#7a5cba", "#d08a2e", "#2f855a", "#9f3a63", "#4f7d8a"];

const visibleSectionIds = ["agenda", "pacientes", "automatizaciones", "facturacion", "rendimiento", "suscripcion", "configuracion", "permisos"];
const permissionSections = ["agenda", "pacientes", "automatizaciones", "facturacion", "rendimiento", "configuracion", "disponibilidad"];
const permissionLabels = {
  agenda: "Agenda",
  pacientes: "Pacientes",
  automatizaciones: "Recordatorios",
  facturacion: "Facturacion",
  rendimiento: "Rendimiento",
  configuracion: "Configuracion completa",
  disponibilidad: "Disponibilidad / vacaciones"
};

const defaultPermissionSettings = {
  staff: ["agenda", "pacientes", "automatizaciones", "facturacion"],
  practitioners: {}
};

function loadState(key, fallback) {
  const saved = localStorage.getItem(`klinia:${key}`) || localStorage.getItem(`clinicaflow:${key}`);
  return saved ? JSON.parse(saved) : fallback;
}

function saveState(key, value) {
  localStorage.setItem(`klinia:${key}`, JSON.stringify(value));
}

function slugifyClinicName(value) {
  return (value || defaultClinic.name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "clinica";
}

const demoClinicKey = slugifyClinicName(defaultClinic.name);
let activeClinicKey = loadState("active-clinic-key", demoClinicKey);

const defaultClinicAccount = {
  key: demoClinicKey,
  name: defaultClinic.name,
  email: defaultClinic.email,
  phone: defaultClinic.phone,
  password: "demo",
  staffPassword: "demo",
  paymentPlan: "trial",
  subscriptionStatus: "trialing",
  billingStatus: "trial",
  trialEndsAt: addDaysIso(todayIso(), 30),
  billingProfile: {
    billingName: defaultClinic.name,
    billingEmail: defaultClinic.email,
    taxId: "",
    billingAddress: ""
  }
};

function clinicStateKeyFor(clinicKey, key) {
  return `clinic:${clinicKey}:${key}`;
}

function clinicStateKey(key) {
  return clinicStateKeyFor(activeClinicKey, key);
}

function loadClinicStateFor(clinicKey, key, fallback) {
  const scoped = localStorage.getItem(`klinia:${clinicStateKeyFor(clinicKey, key)}`);
  return scoped ? JSON.parse(scoped) : fallback;
}

function loadClinicState(key, fallback) {
  return loadClinicStateFor(activeClinicKey, key, fallback);
}

function saveClinicState(key, value) {
  localStorage.setItem(`klinia:${clinicStateKey(key)}`, JSON.stringify(value));
}

function isDemoClinic() {
  return activeClinicKey === demoClinicKey;
}

function normalizeSaasPlanId(planId) {
  const normalized = String(planId || "trial").toLowerCase();
  if (normalized === "trial" || normalized === "demo") {
    return "trial";
  }
  if (["starter", "pro", "business", "kliniaplan"].includes(normalized)) {
    return "kliniaplan";
  }
  return saasPlans.some((plan) => plan.id === normalized) ? normalized : "trial";
}

function normalizeClinicAccounts(accounts) {
  const items = Array.isArray(accounts) ? accounts : [];
  const byKey = new Map([[demoClinicKey, defaultClinicAccount]]);
  items.forEach((account) => {
    const key = account.key || slugifyClinicName(account.name);
    if (key) {
      const plan = normalizeSaasPlanId(account.paymentPlan);
      byKey.set(key, {
        password: "demo",
        staffPassword: "demo",
        checkoutUrl: "",
        stripeCustomerId: "",
        stripeSubscriptionId: "",
        ...account,
        key,
        paymentPlan: plan,
        billingStatus: account.billingStatus || (plan === "trial" ? "trial" : "pending_stripe"),
        subscriptionStatus: account.subscriptionStatus || (plan === "trial" ? "trialing" : "incomplete"),
        trialEndsAt: account.trialEndsAt || addDaysIso(todayIso(), 30),
        billingProfile: {
          billingName: account.name || "",
          billingEmail: account.email || "",
          taxId: "",
          billingAddress: "",
          ...(account.billingProfile || {})
        }
      });
    }
  });
  if (activeClinicKey !== demoClinicKey && !byKey.has(activeClinicKey)) {
    const legacyClinic = loadClinicStateFor(activeClinicKey, "clinic", null);
    byKey.set(activeClinicKey, {
      key: activeClinicKey,
      name: legacyClinic?.name || activeClinicKey.replace(/-/g, " ").toUpperCase(),
      email: legacyClinic?.email || "",
      phone: legacyClinic?.phone || "",
      password: "demo",
      staffPassword: "demo",
      paymentPlan: "trial",
      billingStatus: "trial",
      subscriptionStatus: "trialing",
      trialEndsAt: addDaysIso(todayIso(), 30),
      billingProfile: {
        billingName: legacyClinic?.name || "",
        billingEmail: legacyClinic?.email || "",
        taxId: "",
        billingAddress: ""
      }
    });
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

let clinicAccounts = normalizeClinicAccounts(loadState("clinic-accounts", [defaultClinicAccount]));

if (activeClinicKey !== demoClinicKey && !clinicAccounts.some((account) => account.key === activeClinicKey)) {
  activeClinicKey = demoClinicKey;
  saveState("active-clinic-key", activeClinicKey);
}

function saveClinicAccounts() {
  saveState("clinic-accounts", clinicAccounts);
}

function clinicAccountByKey(key) {
  return clinicAccounts.find((account) => account.key === key) || defaultClinicAccount;
}

function clinicAccountByLogin(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return clinicAccounts.find((account) => (
    account.key.toLowerCase() === normalized
      || account.name.toLowerCase() === normalized
      || String(account.email || "").toLowerCase() === normalized
  ));
}

function currentClinicAccount() {
  return clinicAccountByKey(activeClinicKey);
}

function saasPlanById(planId) {
  return saasPlans.find((plan) => plan.id === planId) || saasPlans[0];
}

function subscriptionStatusLabel(status) {
  return {
    trialing: "Demo activa",
    trial: "Demo activa",
    incomplete: "Pago pendiente",
    pending_stripe: "Stripe pendiente",
    active: "Suscripcion activa",
    past_due: "Pago pendiente",
    canceled: "Cancelada"
  }[status] || "Sin estado";
}

function ensureClinicAccount(account) {
  clinicAccounts = normalizeClinicAccounts([
    ...clinicAccounts.filter((item) => item.key !== account.key),
    { password: "demo", staffPassword: "demo", ...account }
  ]);
  saveClinicAccounts();
}

function normalizeServices(savedServices) {
  return savedServices.map((service) => ({
    description: "",
    active: true,
    type: "individual",
    capacity: 1,
    monthlyPrice: 0,
    dropInPrice: 0,
    commissionPerPatient: 0,
    ...service
  }));
}

function normalizeAppointments(savedAppointments) {
  return savedAppointments.map((appointment) => ({
    date: todayIso(),
    ...appointment
  }));
}

function normalizeGroups(savedGroups) {
  return (Array.isArray(savedGroups) ? savedGroups : []).map((group) => ({
    id: `grp-${Date.now()}`,
    name: "Sesion grupal",
    serviceId: services?.[0]?.id || "",
    practitionerId: practitioners?.[0]?.id || "",
    roomId: rooms?.[0]?.id || "",
    days: [],
    start: "18:00",
    capacity: 6,
    monthlyPrice: 0,
    dropInPrice: 0,
    commissionPerPatient: 0,
    patientIds: [],
    active: true,
    ...group,
    days: Array.isArray(group.days) ? group.days : []
  }));
}

function normalizeAvailabilityBlocks(savedBlocks) {
  return (Array.isArray(savedBlocks) ? savedBlocks : []).map((block) => ({
    id: `block-${Date.now()}`,
    practitionerId: practitioners?.[0]?.id || "",
    date: todayIso(),
    endDate: todayIso(),
    allDay: true,
    start: "00:00",
    end: "23:59",
    type: "unavailable",
    reason: "",
    ...block,
    endDate: block.endDate || block.date || todayIso()
  }));
}

function normalizePermissionList(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback.slice();
  }
  const filtered = value.filter((section) => permissionSections.includes(section));
  return filtered.length ? [...new Set(filtered)] : [];
}

function defaultPractitionerPermissions() {
  return ["agenda", "pacientes", "rendimiento"];
}

function normalizePermissionSettings(savedPermissions) {
  const saved = savedPermissions && typeof savedPermissions === "object" ? savedPermissions : {};
  const savedPractitioners = saved.practitioners && typeof saved.practitioners === "object" ? saved.practitioners : {};
  const practitionerPermissions = Object.fromEntries(
    Object.entries(savedPractitioners).map(([id, sections]) => [id, normalizePermissionList(sections, defaultPractitionerPermissions())])
  );
  return {
    staff: normalizePermissionList(saved.staff, defaultPermissionSettings.staff),
    practitioners: practitionerPermissions
  };
}

function normalizeSessionPacks(savedPacks) {
  return (Array.isArray(savedPacks) ? savedPacks : []).map((pack) => ({
    id: `pack-${Date.now()}`,
    name: "Bono de sesiones",
    sessions: 1,
    price: 0,
    serviceId: "",
    invoice: true,
    ...pack
  }));
}

function normalizePatientPacks(savedPacks) {
  return (Array.isArray(savedPacks) ? savedPacks : []).map((pack) => ({
    id: `patient-pack-${Date.now()}`,
    patientId: "",
    packId: "",
    name: "Bono",
    sessions: 1,
    used: 0,
    price: 0,
    serviceId: "",
    invoice: true,
    createdAt: new Date().toLocaleString("es-ES"),
    ...pack
  }));
}

function normalizePractitioners(savedPractitioners) {
  const seen = new Set();
  const usedColors = new Set();
  return savedPractitioners
    .map((practitioner) => ({
      id: practitioner.id || `worker-${slugifyClinicName(practitioner.name || "trabajador")}`,
      availabilityStart: "08:00",
      availabilityEnd: "20:00",
      availabilityStart2: "",
      availabilityEnd2: "",
      email: "",
      password: "demo",
      ...practitioner
    }))
    .filter((practitioner) => {
      const key = slugifyClinicName(practitioner.name);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((practitioner, index) => {
      const color = practitioner.color || workerColorPalette[index % workerColorPalette.length];
      const isDuplicateDefault = usedColors.has(color) && color === "#168776";
      const nextColor = isDuplicateDefault ? workerColorPalette[index % workerColorPalette.length] : color;
      usedColors.add(nextColor);
      return { ...practitioner, color: nextColor };
    });
}

let patients = loadClinicState("patients", isDemoClinic() ? defaultPatients : []);
let appointments = normalizeAppointments(loadClinicState("appointments", isDemoClinic() ? defaultAppointments : []));
let clinicalNotes = loadClinicState("clinical-notes", isDemoClinic() ? defaultClinicalNotes : []);
let services = normalizeServices(loadClinicState("services", isDemoClinic() ? defaultServices : []));
let practitioners = normalizePractitioners(loadClinicState("practitioners", isDemoClinic() ? defaultPractitioners : []));
let rooms = loadClinicState("rooms", isDemoClinic() ? defaultRooms : []);
let groups = normalizeGroups(loadClinicState("groups", isDemoClinic() ? defaultGroups : []));
let clinic = loadClinicState("clinic", isDemoClinic() ? defaultClinic : { ...defaultClinic, name: "Nueva clinica", email: "", phone: "" });
let availabilityBlocks = normalizeAvailabilityBlocks(loadClinicState("availability-blocks", isDemoClinic() ? defaultAvailabilityBlocks : []));
let permissionSettings = normalizePermissionSettings(loadClinicState("permissions", defaultPermissionSettings));
let selectedPatientId = patients[0]?.id || null;
let pendingClinicKey = null;
let currentSession = loadState("session", { role: "owner", practitionerId: null });
let selectedAppointmentId = null;
let selectedClinicalNoteId = null;
const authMaxAgeMs = 8 * 60 * 60 * 1000;
const savedAuthAt = Number(loadState("authenticated-at", 0));
let isAuthenticated = Boolean(loadState("authenticated", false)) && Date.now() - savedAuthAt < authMaxAgeMs;
let selectedDate = loadState("selected-date", todayIso());
let calendarMode = loadState("calendar-mode", "day");
let selectedPractitionerIds = loadState("selected-practitioner-ids", ["all"]);
let activeSection = loadState("active-section", "agenda");
if (!visibleSectionIds.includes(activeSection)) {
  activeSection = "agenda";
  saveState("active-section", activeSection);
}
let reminderActions = loadClinicState("reminder-actions", []);
let deferredInstallPrompt = null;
let reminderSettings = loadClinicState("reminder-settings", { autoWhatsapp: false });
let groupDropIns = loadClinicState("group-dropins", []);
let groupCompletions = loadClinicState("group-completions", []);
let consentTemplates = loadClinicState("consent-templates", []);
let sessionPacks = normalizeSessionPacks(loadClinicState("session-packs", []));
let clinicLogo = loadClinicState("clinic-logo", "");
let patientConsents = loadClinicState("patient-consents", []);
let patientPacks = normalizePatientPacks(loadClinicState("patient-packs", []));
let autoReminderRunning = false;
let pendingRecurringReview = null;
let patientProfileOpen = false;

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const sectionTitles = {
  agenda: "Agenda",
  pacientes: "Pacientes",
  automatizaciones: "Recordatorios",
  facturacion: "Facturacion",
  rendimiento: "Rendimiento",
  suscripcion: "Mi suscripción",
  configuracion: "Configuracion",
  permisos: "Permisos"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const apiEnabled = false;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMultiline(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function excerptText(value, maxLength = 170) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
}

function formatConsentDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function loadActiveClinicData(clinicKey = demoClinicKey) {
  const account = clinicAccountByKey(clinicKey);
  activeClinicKey = account.key;
  saveState("active-clinic-key", activeClinicKey);

  const customClinic = { name: account.name, email: account.email || "", phone: account.phone || "" };
  clinic = loadClinicState("clinic", isDemoClinic() ? defaultClinic : customClinic);
  patients = loadClinicState("patients", isDemoClinic() ? defaultPatients : []);
  appointments = normalizeAppointments(loadClinicState("appointments", isDemoClinic() ? defaultAppointments : []));
  clinicalNotes = loadClinicState("clinical-notes", isDemoClinic() ? defaultClinicalNotes : []);
  services = normalizeServices(loadClinicState("services", isDemoClinic() ? defaultServices : []));
  practitioners = normalizePractitioners(loadClinicState("practitioners", isDemoClinic() ? defaultPractitioners : []));
  rooms = loadClinicState("rooms", isDemoClinic() ? defaultRooms : []);
  groups = normalizeGroups(loadClinicState("groups", isDemoClinic() ? defaultGroups : []));
  availabilityBlocks = normalizeAvailabilityBlocks(loadClinicState("availability-blocks", isDemoClinic() ? defaultAvailabilityBlocks : []));
  permissionSettings = normalizePermissionSettings(loadClinicState("permissions", defaultPermissionSettings));
  groupDropIns = loadClinicState("group-dropins", []);
  groupCompletions = loadClinicState("group-completions", []);
  consentTemplates = loadClinicState("consent-templates", []);
  sessionPacks = normalizeSessionPacks(loadClinicState("session-packs", []));
  patientConsents = loadClinicState("patient-consents", []);
  patientPacks = normalizePatientPacks(loadClinicState("patient-packs", []));
  clinicLogo = loadClinicState("clinic-logo", "");
  reminderSettings = loadClinicState("reminder-settings", { autoWhatsapp: false });
  selectedPatientId = patients[0]?.id || null;
  patientProfileOpen = false;
  document.body.classList.remove("patient-profile-open");
  selectedPractitionerIds = ["all"];
  saveState("selected-practitioner-ids", selectedPractitionerIds);

  if (isPractitionerSession() && !practitioners.some((item) => item.id === currentSession.practitionerId)) {
    currentSession = { role: "owner", practitionerId: null };
    saveState("session", currentSession);
  }
}

function clinicDataIsEmpty(clinicKey) {
  return ["patients", "appointments", "clinical-notes", "services", "practitioners", "rooms", "groups", "availability-blocks", "group-dropins", "group-completions", "permissions"]
    .every((key) => !localStorage.getItem(`klinia:${clinicStateKeyFor(clinicKey, key)}`));
}

function renderLoginClinics() {
  const input = $("#login-clinic-select");
  const list = $("#login-clinic-list");
  if (!input || !list) {
    return;
  }
  list.innerHTML = "";
  clinicAccounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.name;
    option.label = account.email || account.key;
    list.append(option);
  });
  input.value = clinicAccountByKey(activeClinicKey).name;
  renderLoginProfiles();
}

function renderLoginProfiles() {
  const clinicInput = $("#login-clinic-select");
  const profileSelect = $("#profile-select");
  if (!clinicInput || !profileSelect) {
    return;
  }
  const selectedKey = pendingClinicKey || clinicAccountByLogin(clinicInput.value)?.key || demoClinicKey;
  const loginPractitioners = normalizePractitioners(loadClinicStateFor(selectedKey, "practitioners", selectedKey === demoClinicKey ? defaultPractitioners : []));
  profileSelect.innerHTML = "";
  profileSelect.append(new Option("Direccion", "owner"));
  profileSelect.append(new Option("Recepcion / empleado", "staff"));
  loginPractitioners.forEach((practitioner) => profileSelect.append(new Option(practitioner.name, practitioner.id)));
}

function showClinicLoginStep() {
  $("#login-form").classList.remove("hidden");
  $("#profile-form").classList.add("hidden");
  $("#profile-form").elements.password.value = "demo";
  pendingClinicKey = null;
}

function showProfileLoginStep(clinicKey) {
  pendingClinicKey = clinicKey;
  $("#login-form").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
  renderLoginProfiles();
}

function deleteClinicStorage(clinicKey) {
  ["clinic", "patients", "appointments", "clinical-notes", "services", "practitioners", "rooms", "groups", "availability-blocks", "group-dropins", "group-completions", "permissions", "reminder-actions", "reminder-settings", "patient-consents", "patient-packs", "consent-templates", "session-packs", "clinic-logo"].forEach((key) => {
    localStorage.removeItem(`klinia:${clinicStateKeyFor(clinicKey, key)}`);
  });
}

async function apiRequest(path, options = {}) {
  if (!apiEnabled) {
    throw new Error("API unavailable outside localhost");
  }
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json();
}

function apiPatientToUi(patient) {
  return {
    id: patient.id,
    name: patient.name || `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
    phone: patient.phone || "",
    email: patient.email || "",
    last: "API",
    status: patient.status || (patient.active ? "Activo" : "Inactivo"),
    alert: patient.alert || patient.internal_alert || "Sin alertas relevantes"
  };
}

function uiPatientToApi(form) {
  return {
    name: patientFullNameFromForm(form),
    phone: form.elements.phone.value.trim() || null,
    email: form.elements.email.value.trim() || null,
    alert: form.elements.alert.value.trim() || null,
    status: "Activo"
  };
}

function apiServiceToUi(service) {
  return {
    id: service.id,
    name: service.name,
    description: service.description || "",
    duration: service.duration_minutes,
    price: Math.round(service.price_cents / 100),
    active: service.active
  };
}

function uiServiceToApi(form) {
  return {
    name: form.elements.name.value.trim(),
    description: form.elements.description.value.trim() || null,
    duration_minutes: Number(form.elements.duration.value),
    price_cents: Number(form.elements.price.value) * 100,
    active: form.elements.active.checked
  };
}

function apiAppointmentToUi(appointment) {
  const startsAt = new Date(appointment.starts_at);
  return {
    id: appointment.id,
    date: startsAt.toISOString().slice(0, 10),
    patientId: appointment.patient_id,
    practitionerId: appointment.practitioner_id,
    roomId: appointment.room_id,
    serviceId: appointment.service_id,
    start: `${String(startsAt.getHours()).padStart(2, "0")}:${String(startsAt.getMinutes()).padStart(2, "0")}`,
    status: appointment.status,
    internalNotes: appointment.internal_notes || ""
  };
}

function uiAppointmentToApi(candidate) {
  const today = new Date(`${candidate.date || selectedDate}T00:00:00`);
  const [hour, minute] = candidate.start.split(":").map(Number);
  const startsAt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute, 0);
  return {
    patient_id: candidate.patientId,
    practitioner_id: candidate.practitionerId,
    room_id: candidate.roomId,
    service_id: candidate.serviceId,
    starts_at: startsAt.toISOString(),
    status: candidate.status,
    internal_notes: candidate.internalNotes || null
  };
}

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function addMinutes(time, amount) {
  const total = minutes(time) + amount;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function parseDecimal(value, fallback = 0) {
  const normalized = String(value - "").trim().replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function byId(list, id) {
  return list.find((item) => String(item.id) === String(id));
}

function mergeById(primary, fallback) {
  const seen = new Set(primary.map((item) => item.id));
  return [...primary, ...fallback.filter((item) => !seen.has(item.id))];
}

function isOwner() {
  return currentSession.role === "owner";
}

function isStaff() {
  return currentSession.role === "staff";
}

function isPractitionerSession() {
  return currentSession.role === "practitioner";
}

function canManageOperations() {
  return isOwner() || isStaff();
}

function canManageClinic() {
  return isOwner();
}

function canManageAvailability() {
  const permissions = permissionsForCurrentSession();
  return isOwner() || permissions.includes("configuracion") || permissions.includes("disponibilidad");
}

function isAvailabilityOnlySettingsSession() {
  const permissions = permissionsForCurrentSession();
  return !isOwner() && permissions.includes("disponibilidad") && !permissions.includes("configuracion");
}

function canViewDirectionReports() {
  return isOwner();
}

function permissionsForCurrentSession() {
  if (isOwner()) {
    return [...permissionSections, "configuracion", "permisos"];
  }
  if (isStaff()) {
    return permissionSettings.staff || [];
  }
  if (isPractitionerSession()) {
    return permissionSettings.practitioners?.[currentSession.practitionerId] || ["agenda", "pacientes", "rendimiento"];
  }
  return [];
}

function canAccessSection(section) {
  if (!visibleSectionIds.includes(section)) {
    return false;
  }
  if (section === "configuracion" && permissionsForCurrentSession().includes("disponibilidad")) {
    return true;
  }
  return isOwner() || permissionsForCurrentSession().includes(section);
}

function currentPractitioner() {
  return byId(practitioners, currentSession.practitionerId);
}

function visibleAppointments() {
  const ranged = appointments
    .filter((appointment) => isBlockingAppointmentStatus(appointment.status))
    .filter((appointment) => isAppointmentInCurrentRange(appointment));
  if (!isPractitionerSession()) {
    return ranged;
  }
  return ranged.filter((appointment) => appointment.practitionerId === currentSession.practitionerId);
}

function dateOnly(value) {
  return new Date(`${value}T00:00:00`);
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function daysBetween(start, end) {
  return Math.round((dateOnly(end) - dateOnly(start)) / 86400000);
}

function addDaysIso(value, amount) {
  const date = dateOnly(value);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

function weekStartIso(value) {
  const date = dateOnly(value);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return toIsoDate(date);
}

function monthStartIso(value) {
  const date = dateOnly(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function monthEndIso(value) {
  const date = dateOnly(monthStartIso(value));
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return toIsoDate(date);
}

function calendarRange() {
  if (calendarMode === "day") {
    return { start: selectedDate, end: selectedDate };
  }
  if (calendarMode === "week") {
    const start = weekStartIso(selectedDate);
    return { start, end: addDaysIso(start, 6) };
  }
  return { start: monthStartIso(selectedDate), end: monthEndIso(selectedDate) };
}

function isAppointmentInCurrentRange(appointment) {
  const appointmentDate = appointment.date || selectedDate;
  const range = calendarRange();
  return appointmentDate >= range.start && appointmentDate <= range.end;
}

function appointmentsForSelectedDay() {
  return visibleAppointments().filter((appointment) => (appointment.date || selectedDate) === selectedDate);
}

function appointmentEnd(appointment) {
  const service = byId(services, appointment.serviceId);
  return addMinutes(appointment.start, service?.duration || 60);
}

function statusLabel(status) {
  return {
    pending: "Pendiente",
    confirmed: "Confirmada",
    completed: "Atendida",
    cancelled: "Cancelada",
    no_show: "No asistio"
  }[status] || status;
}

function servicePrice(appointment) {
  if (appointment.patientPackId || appointment.plannedPatientPackId) {
    return 0;
  }
  const service = byId(services, appointment.serviceId);
  if (!service) {
    return 0;
  }
  if (service.type === "group") {
    const attendees = Math.max(1, Number(appointment.groupAttendees || appointment.patientIds?.length || 1));
    const unitPrice = Number(service.dropInPrice || service.price || service.monthlyPrice || 0);
    return attendees * unitPrice;
  }
  return Number(service.price || 0);
}

function serviceCommissionAmount(appointment, practitioner) {
  const service = byId(services, appointment.serviceId);
  const revenue = servicePrice(appointment);
  if (service?.type === "group" && Number(service.commissionPerPatient || 0) > 0) {
    return Math.round(revenue * (Number(service.commissionPerPatient) / 100));
  }
  return Math.round(revenue * (practitioner?.commissionRate || 0));
}

function serviceKindLabel(service) {
  return service?.type === "group" ? "Sesion grupal" : "Individual";
}

function packServiceLabel(pack) {
  const service = byId(services, pack?.serviceId);
  return service ? service.name : "Todos los servicios";
}

function fillPackServiceOptions(select, selectedServiceId = "") {
  if (!select) return;
  select.innerHTML = "";
  select.append(new Option("Todos los servicios", ""));
  services
    .filter((service) => service.active !== false)
    .forEach((service) => select.append(new Option(service.name, service.id)));
  select.value = selectedServiceId || "";
}

function patientPackRemaining(pack) {
  return Math.max(0, Number(pack.sessions || 0) - Number(pack.used || 0));
}

function patientPacksForAppointment(appointment) {
  return patientPacks.filter((pack) => (
    pack.patientId === appointment.patientId
      && patientPackRemaining(pack) > 0
      && (!pack.serviceId || pack.serviceId === appointment.serviceId)
  ));
}

function usePatientPackForAppointment(appointment, packId) {
  if (!packId) {
    return;
  }
  const pack = byId(patientPacks, packId);
  if (!pack || pack.patientId !== appointment.patientId || patientPackRemaining(pack) <= 0) {
    return;
  }
  patientPacks = patientPacks.map((item) => item.id === packId ? { ...item, used: Number(item.used || 0) + 1 } : item);
  saveClinicState("patient-packs", patientPacks);
}

function restorePatientPackUse(packId) {
  if (!packId) {
    return;
  }
  patientPacks = patientPacks.map((item) => item.id === packId ? { ...item, used: Math.max(0, Number(item.used || 0) - 1) } : item);
  saveClinicState("patient-packs", patientPacks);
}

const weekDayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekDayLabels = { mon: "Lunes", tue: "Martes", wed: "Miercoles", thu: "Jueves", fri: "Viernes", sat: "Sabado", sun: "Domingo" };

function dayKeyFor(dateValue) {
  return weekDayKeys[dateOnly(dateValue).getDay()];
}

function groupService(group) {
  return byId(services, group.serviceId);
}

function groupEnd(group) {
  const service = groupService(group);
  return addMinutes(group.start, service?.duration || 60);
}

function groupOccursOnDate(group, dateValue) {
  return group.active !== false && Array.isArray(group.days) && group.days.includes(dayKeyFor(dateValue));
}

function groupsForDate(dateValue) {
  return groups.filter((group) => groupOccursOnDate(group, dateValue));
}

function groupPassesAgendaFilters(group) {
  const workerIds = selectedAgendaPractitioners().map((item) => item.id);
  const roomFilter = $("#filter-room")?.value || "all";
  const visibleByPractitioner = workerIds.includes(group.practitionerId);
  const visibleByRoom = roomFilter === "all" || group.roomId === roomFilter;
  return group.active !== false && visibleByPractitioner && visibleByRoom;
}

function findGroupConflict(candidate) {
  const service = byId(services, candidate.serviceId);
  const candidateEnd = addMinutes(candidate.start, service?.duration || 60);
  return groupsForDate(candidate.date || selectedDate).find((group) => {
    const samePractitioner = group.practitionerId === candidate.practitionerId;
    const sameRoom = group.roomId === candidate.roomId;
    const timeConflict = overlaps(candidate.start, candidateEnd, group.start, groupEnd(group));
    return timeConflict && (samePractitioner || sameRoom);
  });
}

function groupDropInsFor(group, dateValue = selectedDate) {
  return groupDropIns.filter((entry) => entry.groupId === group.id && entry.date === dateValue);
}

function groupCompletionFor(group, dateValue = selectedDate) {
  return groupCompletions.find((entry) => entry.groupId === group.id && entry.date === dateValue);
}

function isGroupCompleted(group, dateValue = selectedDate) {
  return Boolean(groupCompletionFor(group, dateValue));
}

function groupPricing(group) {
  const service = groupService(group);
  return {
    monthlyPrice: Number(group.monthlyPrice || service?.monthlyPrice || 0),
    dropInPrice: Number(group.dropInPrice || service?.dropInPrice || service?.price || 0),
    commissionPerPatient: Number(group.commissionPerPatient || service?.commissionPerPatient || 0)
  };
}

function groupSessionProduction(group, dateValue = selectedDate) {
  const pricing = groupPricing(group);
  const fixedCount = groupFixedPatients(group).length;
  const dropinCount = groupDropInsFor(group, dateValue).length;
  const attendees = fixedCount + dropinCount;
  const fixedMonthlyRevenue = fixedCount * pricing.monthlyPrice;
  const dropinRevenue = dropinCount * pricing.dropInPrice;
  const revenue = dropinRevenue;
  const payout = Math.round(revenue * (pricing.commissionPerPatient / 100));
  return { attendees, fixedCount, dropinCount, fixedMonthlyRevenue, dropinRevenue, revenue, payout };
}

function groupFixedPatients(group) {
  return (group.patientIds || []).map((id) => byId(patients, id)).filter(Boolean);
}

function groupCapacity(group) {
  return Number(group.capacity || groupService(group)?.capacity || 1);
}

function practitionerAvailabilityRanges(practitioner) {
  if (!practitioner) {
    return [];
  }
  return [
    [practitioner.availabilityStart, practitioner.availabilityEnd],
    [practitioner.availabilityStart2, practitioner.availabilityEnd2]
  ].filter(([start, end]) => start && end && start < end);
}

function practitionerAvailabilityLabel(practitioner) {
  const ranges = practitionerAvailabilityRanges(practitioner);
  return ranges.length ? ranges.map(([start, end]) => `${start} a ${end}`).join(" / ") : "Sin horario";
}

function isOutsidePractitionerHours(practitioner, start, end = start) {
  const ranges = practitionerAvailabilityRanges(practitioner);
  if (!ranges.length) {
    return false;
  }
  return !ranges.some(([rangeStart, rangeEnd]) => start >= rangeStart && end <= rangeEnd);
}

const availabilityTypeLabels = {
  unavailable: "No disponible",
  day_off: "Dia libre",
  vacation: "Vacaciones"
};

function availabilityBlocksFor(practitionerId, dateValue) {
  return availabilityBlocks.filter((block) => {
    const startDate = block.date;
    const endDate = block.endDate || block.date;
    return block.practitionerId === practitionerId && dateValue >= startDate && dateValue <= endDate;
  });
}

function availabilityBlockOverlaps(block, start, end) {
  const blockStart = block.allDay ? "00:00" : block.start;
  const blockEnd = block.allDay ? "23:59" : block.end;
  return overlaps(start, end, blockStart, blockEnd);
}

function availabilityBlockFor(practitionerId, dateValue, start, end) {
  return availabilityBlocksFor(practitionerId, dateValue)
    .find((block) => availabilityBlockOverlaps(block, start, end));
}

function availabilityBlockLabel(block) {
  const label = availabilityTypeLabels[block?.type] || "No disponible";
  const hours = block?.allDay ? "Todo el dia" : `${block?.start || ""} - ${block?.end || ""}`;
  return `${label} - ${hours}${block?.reason ? ` - ${block.reason}` : ""}`;
}

function availabilityBlockDateLabel(block) {
  const endDate = block?.endDate || block?.date;
  return endDate && endDate !== block?.date ? `${block.date} a ${endDate}` : block?.date;
}

function groupEnrollmentLabel(group, dateValue = null) {
  const fixed = groupFixedPatients(group).length;
  const extras = dateValue ? groupDropInsFor(group, dateValue).length : 0;
  const capacity = groupCapacity(group);
  return dateValue ? `${fixed} fijos + ${extras} sueltos / ${capacity} plazas` : `${fixed}/${capacity} plazas`;
}

function groupHasFreeSpot(group, dateValue = selectedDate) {
  return groupFixedPatients(group).length + groupDropInsFor(group, dateValue).length < groupCapacity(group);
}

function hexToRgba(hex, alpha = 0.13) {
  const clean = String(hex || "#168776").replace("#", "");
  const normalized = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return `rgba(22, 135, 118, ${alpha})`;
  }
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function overlaps(firstStart, firstEnd, secondStart, secondEnd) {
  return minutes(firstStart) < minutes(secondEnd) && minutes(secondStart) < minutes(firstEnd);
}

function isBlockingAppointmentStatus(status) {
  return !["cancelled", "no_show"].includes(status);
}

function findConflict(candidate) {
  const service = byId(services, candidate.serviceId);
  const candidateEnd = addMinutes(candidate.start, service?.duration || 60);

  return appointments.find((appointment) => {
    if (!isBlockingAppointmentStatus(appointment.status)) {
      return false;
    }
    const sameDate = (appointment.date || selectedDate) === (candidate.date || selectedDate);
    const samePractitioner = appointment.practitionerId === candidate.practitionerId;
    const sameRoom = appointment.roomId === candidate.roomId;
    const samePatient = appointment.patientId === candidate.patientId;
    const timeConflict = overlaps(candidate.start, candidateEnd, appointment.start, appointmentEnd(appointment));
    return sameDate && timeConflict && (samePractitioner || sameRoom || samePatient);
  });
}

function isWithinAvailability(appointment) {
  const practitioner = byId(practitioners, appointment.practitionerId);
  if (!practitioner) {
    return true;
  }
  const service = byId(services, appointment.serviceId);
  const end = addMinutes(appointment.start, service?.duration || 60);
  return !isOutsidePractitionerHours(practitioner, appointment.start, end)
    && !availabilityBlockFor(practitioner.id, appointment.date || selectedDate, appointment.start, end);
}

function slotEnd(hour) {
  return addMinutes(hour, 60);
}

function practitionerIsFreeAt(practitioner, dateValue, hour) {
  const end = slotEnd(hour);
  return !availabilityBlockFor(practitioner.id, dateValue, hour, end)
    && !appointments.some((appointment) => (
      isBlockingAppointmentStatus(appointment.status)
        && (appointment.date || selectedDate) === dateValue
        && appointment.practitionerId === practitioner.id
        && overlaps(hour, end, appointment.start, appointmentEnd(appointment))
    ))
    && !groupsForDate(dateValue).some((group) => (
      group.practitionerId === practitioner.id
        && overlaps(hour, end, group.start, groupEnd(group))
    ));
}

function practitionerHasBlockingItemAt(practitioner, dateValue, hour) {
  const end = slotEnd(hour);
  return Boolean(availabilityBlockFor(practitioner.id, dateValue, hour, end))
    || appointments.some((appointment) => (
      (appointment.date || selectedDate) === dateValue
        && appointment.practitionerId === practitioner.id
        && isBlockingAppointmentStatus(appointment.status)
        && overlaps(hour, end, appointment.start, appointmentEnd(appointment))
    ))
    || groupsForDate(dateValue).some((group) => (
      group.practitionerId === practitioner.id
        && overlaps(hour, end, group.start, groupEnd(group))
    ));
}

function roomIsFreeAt(room, dateValue, hour) {
  const end = slotEnd(hour);
  return !appointments.some((appointment) => (
    isBlockingAppointmentStatus(appointment.status)
      && (appointment.date || selectedDate) === dateValue
      && appointment.roomId === room.id
      && overlaps(hour, end, appointment.start, appointmentEnd(appointment))
  ))
    && !groupsForDate(dateValue).some((group) => (
      group.roomId === room.id && overlaps(hour, end, group.start, groupEnd(group))
    ));
}

function slotDefaults(dateValue, hour, preferredPractitioner = null) {
  const visiblePractitioners = selectedAgendaPractitioners();
  const practitioner = preferredPractitioner && practitionerIsFreeAt(preferredPractitioner, dateValue, hour)
    ? preferredPractitioner
    : visiblePractitioners.find((item) => practitionerIsFreeAt(item, dateValue, hour)) || preferredPractitioner || visiblePractitioners[0] || practitioners[0];
  const roomFilter = $("#filter-room")?.value || "all";
  const filteredRoom = roomFilter !== "all" ? byId(rooms, roomFilter) : null;
  const room = filteredRoom && roomIsFreeAt(filteredRoom, dateValue, hour)
    ? filteredRoom
    : rooms.find((item) => roomIsFreeAt(item, dateValue, hour)) || rooms[0];
  return { practitioner, room };
}

function fillSelect(select, items, label = "name", allLabel = "") {
  select.innerHTML = "";
  if (allLabel) {
    select.append(new Option(allLabel, "all"));
  }
  items.forEach((item) => select.append(new Option(item[label], item.id)));
}

function selectedAgendaPractitioners() {
  if (isPractitionerSession()) {
    return practitioners.filter((item) => item.id === currentSession.practitionerId);
  }
  const savedIds = selectedPractitionerIds.filter((id) => practitioners.some((item) => item.id === id));
  if (selectedPractitionerIds.includes("all") || !savedIds.length) {
    return practitioners;
  }
  return practitioners.filter((item) => savedIds.includes(item.id));
}

function appointmentPassesAgendaFilters(appointment) {
  if (!isBlockingAppointmentStatus(appointment.status)) {
    return false;
  }
  const workerIds = selectedAgendaPractitioners().map((item) => item.id);
  const roomFilter = $("#filter-room").value || "all";
  const visibleByPractitioner = workerIds.includes(appointment.practitionerId);
  const visibleByRoom = roomFilter === "all" || appointment.roomId === roomFilter;
  return visibleByPractitioner && visibleByRoom;
}

function renderFilters() {
  fillSelect($("#filter-room"), rooms, "name", "Todas las salas");
  fillSelect($("#worker-profile-select"), practitioners);
  const workerFilter = $("#filter-practitioner");
  const workerMenu = workerFilter.querySelector(".worker-filter-menu");
  const validIds = selectedPractitionerIds.filter((id) => practitioners.some((item) => item.id === id));
  if (!selectedPractitionerIds.includes("all") && !validIds.length) {
    selectedPractitionerIds = ["all"];
  }
  const visibleCount = selectedPractitionerIds.includes("all")
    ? practitioners.length
    : selectedPractitionerIds.filter((id) => practitioners.some((item) => item.id === id)).length;
  workerFilter.querySelector("summary").textContent = `Profesionales (${visibleCount || 0})`;
  workerMenu.innerHTML = `
    <label class="filter-chip">
      <input type="checkbox" value="all" ${selectedPractitionerIds.includes("all") ? "checked" : ""} ${isPractitionerSession() ? "disabled" : ""} />
      <span>Todos</span>
    </label>
    ${practitioners.map((practitioner) => `
      <label class="filter-chip">
        <input type="checkbox" value="${practitioner.id}" ${selectedPractitionerIds.includes("all") || selectedPractitionerIds.includes(practitioner.id) ? "checked" : ""} ${isPractitionerSession() ? "disabled" : ""} />
        <span>${practitioner.name}</span>
      </label>
    `).join("")}
  `;
  const session = $("#session-select");
  session.innerHTML = "";
  const sessionValue = isPractitionerSession() ? currentSession.practitionerId : currentSession.role;
  session.append(new Option(currentSessionName(), sessionValue));
  session.value = sessionValue;
  session.disabled = true;
  renderWorkerColorLegend();
}

function renderWorkerColorLegend() {
  const legend = $("#worker-color-legend");
  if (!legend) {
    return;
  }
  if (isPractitionerSession()) {
    legend.innerHTML = "";
    return;
  }
  legend.innerHTML = practitioners.length
    ? practitioners.map((practitioner) => `
      <button class="worker-color-key" type="button" data-worker-jump="${practitioner.id}" title="${practitioner.name}" aria-label="Ver agenda de ${practitioner.name}" style="--worker-color:${practitioner.color || "#168776"}"></button>
    `).join("")
    : "";

  $$("[data-worker-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPractitionerIds = [button.dataset.workerJump];
      saveState("selected-practitioner-ids", selectedPractitionerIds);
      setActiveSection("agenda");
      renderFilters();
      renderSession();
      renderSchedule();
      renderNextList();
    });
  });
}

function renderAppointmentFormOptions() {
  const form = $("#appointment-form");
  const safeServices = services.filter((service) => service.active);
  fillSelect(form.elements.patient, patients);
  fillSelect(form.elements.practitioner, practitioners);
  fillSelect(form.elements.room, rooms);
  fillSelect(form.elements.service, safeServices);
  updateAppointmentGroupAttendeesVisibility(form);
  updateAppointmentOutsideHoursWarning(form);
}

function updateAppointmentGroupAttendeesVisibility(form = $("#appointment-form")) {
  const field = form?.elements.groupAttendees?.closest("label");
  if (!field) {
    return;
  }
  const service = byId(services, form.elements.service.value);
  const isGroup = service?.type === "group";
  field.classList.toggle("hidden", !isGroup);
  form.elements.groupAttendees.required = isGroup;
  if (!isGroup) {
    form.elements.groupAttendees.value = 1;
  }
}

function updateAppointmentPackOptions(form = $("#appointment-form")) {
  const field = form?.querySelector(".appointment-create-pack-field");
  const select = form?.elements.patientPack;
  if (!field || !select) return;
  const patientId = form.elements.patient?.value || "";
  const serviceId = form.elements.service?.value || "";
  const packs = patientPacks.filter((pack) => (
    pack.patientId === patientId
      && patientPackRemaining(pack) > 0
      && (!pack.serviceId || pack.serviceId === serviceId)
  ));
  select.innerHTML = "";
  select.append(new Option("No usar bono", ""));
  packs.forEach((pack) => select.append(new Option(`${pack.name} - ${patientPackRemaining(pack)} disponibles`, pack.id)));
  field.classList.toggle("hidden", packs.length === 0);
}

function appointmentOutsideHoursMessage(form = $("#appointment-form")) {
  if (!form) {
    return "";
  }
  const practitioner = byId(practitioners, form.elements.practitioner?.value);
  const service = byId(services, form.elements.service?.value);
  const start = form.elements.start?.value;
  if (!practitioner || !start) {
    return "";
  }
  const end = addMinutes(start, service?.duration || 60);
  return isOutsidePractitionerHours(practitioner, start, end)
    ? `Está creando una cita fuera de horario. Horario habitual: ${practitionerAvailabilityLabel(practitioner)}.`
    : "";
}

function updateAppointmentOutsideHoursWarning(form = $("#appointment-form")) {
  const warning = $("#appointment-outside-hours-warning");
  if (!warning) {
    return;
  }
  const message = appointmentOutsideHoursMessage(form);
  warning.textContent = message;
  warning.classList.toggle("visible", Boolean(message));
}

function appointmentSetupMissing() {
  const missing = [];
  if (!patients.length) {
    missing.push("pacientes");
  }
  if (!practitioners.length) {
    missing.push("trabajadores");
  }
  if (!rooms.length) {
    missing.push("salas");
  }
  if (!services.some((service) => service.active)) {
    missing.push("servicios");
  }
  return missing;
}

function renderSchedule() {
  const schedule = $("#schedule");
  const visiblePractitioners = selectedAgendaPractitioners();
  const dayAppointments = appointmentsForSelectedDay();
  schedule.innerHTML = "";
  schedule.classList.toggle("period-schedule", calendarMode !== "day");

  if (calendarMode !== "day") {
    renderPeriodSchedule(schedule);
    return;
  }

  schedule.style.gridTemplateColumns = visiblePractitioners.length
    ? `70px repeat(${visiblePractitioners.length}, minmax(180px, 1fr))`
    : "1fr";

  if (!visiblePractitioners.length) {
    schedule.innerHTML = `
      <div class="empty-schedule">
        <strong>Sin profesionales visibles</strong>
        <span>Marca al menos un trabajador para ver su agenda.</span>
      </div>
    `;
    return;
  }

  schedule.append(document.createElement("div"));

  visiblePractitioners.forEach((practitioner) => {
    const head = document.createElement("div");
    head.className = "schedule-head";
    head.textContent = practitioner.name;
    schedule.append(head);
  });

  hours.forEach((hour) => {
    const time = document.createElement("div");
    time.className = "time-cell";
    time.textContent = hour;
    schedule.append(time);

    visiblePractitioners.forEach((practitioner) => {
      const cell = document.createElement("div");
      cell.className = "schedule-cell";
      cell.dataset.practitionerId = practitioner.id;
      cell.dataset.hour = hour;
      const cellEnd = addMinutes(hour, 60);
      const availabilityBlock = availabilityBlockFor(practitioner.id, selectedDate, hour, cellEnd);
      if (isOutsidePractitionerHours(practitioner, hour, cellEnd) || availabilityBlock) {
        cell.classList.add("outside-hours");
      }
      if (availabilityBlock) {
        cell.classList.add("availability-blocked-cell");
        cell.title = availabilityBlockLabel(availabilityBlock);
      }
      const hourGroups = groupsForDate(selectedDate)
        .filter((group) => group.start === hour && group.practitionerId === practitioner.id)
        .filter(groupPassesAgendaFilters);
      const hourAppointments = dayAppointments.filter((item) => item.start === hour && item.practitionerId === practitioner.id && appointmentPassesAgendaFilters(item));

      if (hourGroups.length || hourAppointments.length) {
        hourGroups.forEach((group) => cell.append(renderGroupBlock(group, selectedDate)));
        hourAppointments.forEach((appointment) => cell.append(renderAppointment(appointment)));
        const defaults = slotDefaults(selectedDate, hour, practitioner);
        attachCellQuickCreate(cell, defaults.practitioner, selectedDate, hour, defaults.room?.id);
        cell.append(renderCellQuickAdd(defaults.practitioner, selectedDate, hour, "cell-quick-add", defaults.room?.id));
      } else if (availabilityBlock) {
        cell.append(renderAvailabilityBlock(availabilityBlock));
      } else {
        cell.append(renderEmptySlot(practitioner, hour));
      }

      schedule.append(cell);
    });
  });
}

function renderEmptySlot(practitioner, hour) {
  const defaults = slotDefaults(selectedDate, hour, practitioner);
  return renderCellQuickAdd(defaults.practitioner, selectedDate, hour, "empty-slot", defaults.room?.id);
}

function renderAvailabilityBlock(block) {
  const item = document.createElement("div");
  item.className = `availability-block ${block.type || "unavailable"}`;
  item.innerHTML = `
    <strong>${availabilityTypeLabels[block.type] || "No disponible"}</strong>
    <span>${block.allDay ? "Todo el dia" : `${block.start} - ${block.end}`}</span>
  `;
  return item;
}

function renderPeriodSchedule(schedule) {
  const range = calendarRange();
  const days = [];
  for (let cursor = range.start; cursor <= range.end; cursor = addDaysIso(cursor, 1)) {
    days.push(cursor);
  }
  if (calendarMode === "week") {
    renderWeekSchedule(schedule, days);
    return;
  }

  schedule.style.gridTemplateColumns = calendarMode === "week"
    ? "repeat(7, minmax(170px, 1fr))"
    : "repeat(7, minmax(150px, 1fr))";

  if (calendarMode === "month") {
    ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].forEach((day) => {
      const head = document.createElement("div");
      head.className = "period-head";
      head.textContent = day;
      schedule.append(head);
    });
    const firstDay = dateOnly(range.start).getDay() || 7;
    for (let index = 1; index < firstDay; index += 1) {
      const spacer = document.createElement("div");
      spacer.className = "period-day muted-day";
      schedule.append(spacer);
    }
  }

  days.forEach((day) => {
    const dayAppointments = appointments
      .filter((appointment) => (appointment.date || selectedDate) === day)
      .filter((appointment) => isOwner() || appointment.practitionerId === currentSession.practitionerId)
      .filter(appointmentPassesAgendaFilters)
      .sort((a, b) => minutes(a.start) - minutes(b.start));
    const dayGroups = groupsForDate(day)
      .filter((group) => isOwner() || group.practitionerId === currentSession.practitionerId)
      .filter(groupPassesAgendaFilters)
      .sort((a, b) => minutes(a.start) - minutes(b.start));
    const card = document.createElement("article");
    card.className = `period-day ${day === todayIso() ? "today" : ""}`;
    card.innerHTML = `
      <button class="period-date" type="button" data-date="${day}">
        <strong>${new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(dateOnly(day))}</strong>
        <span>${new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(dateOnly(day))}</span>
      </button>
      <div class="period-items"></div>
    `;
    const items = card.querySelector(".period-items");
    if (dayAppointments.length || dayGroups.length) {
      dayGroups.forEach((group) => {
        const practitioner = byId(practitioners, group.practitionerId);
        const workerColor = practitioner?.color || "#168776";
        const item = document.createElement("button");
        item.type = "button";
        item.className = "period-appointment group-block compact-group-block";
        item.style.setProperty("--worker-color", workerColor);
        item.style.setProperty("--worker-bg", hexToRgba(workerColor, 0.16));
        item.innerHTML = `
          <time>${group.start}</time>
          <strong>${group.name}</strong>
          <span>${groupEnrollmentLabel(group, day)}</span>
        `;
        item.addEventListener("click", () => showGroupSummary(group));
        items.append(item);
      });
      dayAppointments.forEach((appointment) => {
        const practitioner = byId(practitioners, appointment.practitionerId);
        const workerColor = practitioner?.color || "#168776";
        const item = document.createElement("button");
        item.type = "button";
        item.className = `period-appointment ${appointment.status}`;
        item.style.setProperty("--worker-color", workerColor);
        item.style.setProperty("--worker-bg", hexToRgba(workerColor, 0.14));
        item.innerHTML = `
          <time>${appointment.start}</time>
          <strong>${byId(patients, appointment.patientId)?.name || "Paciente no encontrado"}</strong>
          <span>${practitioner?.name || "Profesional"}</span>
        `;
        item.addEventListener("click", () => openAppointmentDetail(appointment.id));
        items.append(item);
      });
    } else {
      items.innerHTML = `<span class="quiet">Sin citas</span>`;
    }
    card.querySelector(".period-date").addEventListener("click", () => {
      selectedDate = day;
      calendarMode = "day";
      saveState("selected-date", selectedDate);
      saveState("calendar-mode", calendarMode);
      renderAll();
    });
    schedule.append(card);
  });
}

function renderWeekSchedule(schedule, days) {
  const visiblePractitioners = selectedAgendaPractitioners();
  schedule.style.gridTemplateColumns = "72px repeat(7, minmax(190px, 1fr))";

  if (!visiblePractitioners.length) {
    schedule.innerHTML = `
      <div class="empty-schedule">
        <strong>Sin profesionales visibles</strong>
        <span>Marca al menos un trabajador para ver su semana.</span>
      </div>
    `;
    return;
  }

  schedule.append(document.createElement("div"));

  days.forEach((day) => {
    const head = document.createElement("button");
    head.type = "button";
    head.className = `schedule-head week-day-head ${day === todayIso() ? "today" : ""}`;
    head.innerHTML = `
        <strong>${new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(dateOnly(day))}</strong>
        <span>${new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long" }).format(dateOnly(day))}</span>
    `;
    head.addEventListener("click", () => {
      selectedDate = day;
      calendarMode = "day";
      saveState("selected-date", selectedDate);
      saveState("calendar-mode", calendarMode);
      renderAll();
    });
    schedule.append(head);
  });

  hours.forEach((hour) => {
    const time = document.createElement("div");
    time.className = "time-cell week-hour-cell";
    time.textContent = hour;
    schedule.append(time);

    days.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = `schedule-cell week-stack-cell ${day === todayIso() ? "today" : ""}`;
      const hourAppointments = appointments
        .filter((item) => (item.date || selectedDate) === day && item.start === hour)
        .filter((appointment) => isOwner() || appointment.practitionerId === currentSession.practitionerId)
        .filter(appointmentPassesAgendaFilters)
        .sort((a, b) => {
          const aName = byId(practitioners, a.practitionerId)?.name || "";
          const bName = byId(practitioners, b.practitionerId)?.name || "";
          return aName.localeCompare(bName, "es");
        });
      const hourGroups = groupsForDate(day)
        .filter((group) => group.start === hour)
        .filter((group) => isOwner() || group.practitionerId === currentSession.practitionerId)
        .filter(groupPassesAgendaFilters)
        .sort((a, b) => {
          const aName = byId(practitioners, a.practitionerId)?.name || "";
          const bName = byId(practitioners, b.practitionerId)?.name || "";
          return aName.localeCompare(bName, "es");
        });

      if (hourAppointments.length || hourGroups.length) {
        hourGroups.forEach((group) => cell.append(renderGroupBlock(group, day, "week")));
        hourAppointments.forEach((appointment) => {
          cell.append(renderWeekAppointment(appointment));
        });
        const defaults = slotDefaults(day, hour);
        attachCellQuickCreate(cell, defaults.practitioner, day, hour, defaults.room?.id);
        cell.append(renderCellQuickAdd(defaults.practitioner, day, hour, "cell-quick-add", defaults.room?.id));
      } else {
        const defaults = slotDefaults(day, hour, visiblePractitioners[0]);
        cell.append(renderCellQuickAdd(
          defaults.practitioner,
          day,
          hour,
          "empty-slot week-empty-slot",
          defaults.room?.id
        ));
      }
      schedule.append(cell);
    });
  });
}

function renderWeekAppointment(appointment) {
  const patient = byId(patients, appointment.patientId);
  const service = byId(services, appointment.serviceId);
  const room = byId(rooms, appointment.roomId);
  const practitioner = byId(practitioners, appointment.practitionerId);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `week-appointment ${appointment.status}`;
  const workerColor = practitioner?.color || "#168776";
  button.style.setProperty("--worker-color", workerColor);
  button.style.setProperty("--worker-bg", hexToRgba(workerColor, 0.14));
  button.innerHTML = `
    <time><i></i>${appointment.start} - ${appointmentEnd(appointment)} - ${practitioner?.name || "Profesional"}</time>
    <strong>${patient?.name || "Paciente no encontrado"}</strong>
    <span>${service?.name || "Servicio"} - ${room?.name || "Sala"}</span>
  `;
  button.addEventListener("click", () => openAppointmentDetail(appointment.id));
  return button;
}

function renderAppointment(appointment) {
  const patient = byId(patients, appointment.patientId);
  const service = byId(services, appointment.serviceId);
  const room = byId(rooms, appointment.roomId);
  const practitioner = byId(practitioners, appointment.practitionerId);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `appointment ${appointment.status}`;
  const workerColor = practitioner?.color || "#168776";
  button.style.setProperty("--worker-color", workerColor);
  button.style.setProperty("--worker-bg", hexToRgba(workerColor, 0.14));
  button.innerHTML = `
    <strong><i></i>${appointment.start} - ${patient?.name || "Paciente no encontrado"}</strong>
    <span>${service?.name || "Servicio"} - ${room?.name || "Sala"} - ${statusLabel(appointment.status)}</span>
  `;
  button.addEventListener("click", () => openAppointmentDetail(appointment.id));
  return button;
}

function renderWeekScheduleGrid(schedule, days) {
  const visiblePractitioners = selectedAgendaPractitioners();
  schedule.style.gridTemplateColumns = visiblePractitioners.length
    ? `112px repeat(${visiblePractitioners.length}, minmax(180px, 1fr))`
    : "1fr";

  if (!visiblePractitioners.length) {
    return;
  }

  schedule.append(document.createElement("div"));

  visiblePractitioners.forEach((practitioner) => {
    const head = document.createElement("div");
    head.className = "schedule-head week-head";
    head.innerHTML = `
      <strong>${practitioner.name}</strong>
      <span>${practitioner.specialty || "Profesional"}</span>
    `;
    schedule.append(head);
  });

  days.forEach((day) => {
    hours.forEach((hour) => {
      const time = document.createElement("button");
      time.type = "button";
      time.className = "time-cell week-time";
      time.innerHTML = `
        <strong>${new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(dateOnly(day))}</strong>
        <span>${new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit" }).format(dateOnly(day))}</span>
        <small>${hour}</small>
      `;
      schedule.append(time);

      visiblePractitioners.forEach((practitioner) => {
        const cell = document.createElement("div");
        cell.className = "schedule-cell week-cell";
        const appointment = appointments
          .filter((item) => (item.date || selectedDate) === day && item.start === hour && item.practitionerId === practitioner.id)
          .filter((appointment) => isOwner() || appointment.practitionerId === currentSession.practitionerId)
          .filter(appointmentPassesAgendaFilters)[0];

        if (appointment) {
          cell.append(renderAppointment(appointment));
        } else {
          cell.append(renderWeekEmptySlot(practitioner, day, hour));
        }
        schedule.append(cell);
      });
    });
  });
}

function renderWeekEmptySlot(practitioner, date, hour) {
  const defaults = slotDefaults(date, hour, practitioner);
  return renderCellQuickAdd(defaults.practitioner, date, hour, "empty-slot", defaults.room?.id);
}

function openSlotAppointment(practitioner, date, hour, roomId = null) {
  openAppointmentDialog({
    date,
    practitionerId: practitioner?.id,
    roomId,
    start: hour
  });
}

function attachCellQuickCreate(cell, practitioner, date, hour, roomId = null) {
  cell.classList.add("can-create-appointment");
  cell.addEventListener("click", (event) => {
    if (event.target !== cell) {
      return;
    }
    openSlotAppointment(practitioner, date, hour, roomId);
  });
}

function renderCellQuickAdd(practitioner, date, hour, className = "cell-quick-add", roomId = null) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.title = `Crear cita o bloquear agenda con ${practitioner?.name || "un trabajador"} a las ${hour}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openSlotAppointment(practitioner, date, hour, roomId);
  });
  return button;
}

function renderGroupBlock(group, dateValue = selectedDate, mode = "day") {
  const service = groupService(group);
  const room = byId(rooms, group.roomId);
  const practitioner = byId(practitioners, group.practitionerId);
  const card = document.createElement("button");
  card.type = "button";
  card.className = `appointment group-block ${mode === "week" ? "week-appointment" : ""}`;
  const workerColor = practitioner?.color || "#168776";
  card.style.setProperty("--worker-color", workerColor);
  card.style.setProperty("--worker-bg", hexToRgba(workerColor, 0.16));
  card.innerHTML = `
    <strong><i></i>${group.name}</strong>
    <span>${service?.name || "Servicio grupal"} - ${groupEnrollmentLabel(group)}</span>
    <span>${group.start} - ${groupEnd(group)} - ${room?.name || "Sala"}</span>
  `;
  card.addEventListener("click", () => showGroupSummary(group, dateValue));
  return card;
}

function showGroupSummary(group, dateValue = selectedDate) {
  const dialog = $("#group-session-dialog");
  if (!dialog) {
    const service = groupService(group);
    const practitioner = byId(practitioners, group.practitionerId);
    const room = byId(rooms, group.roomId);
    const names = groupFixedPatients(group).map((patient) => patient.name).join(", ") || "Sin pacientes inscritos";
    alert(`${group.name}\n${service?.name || "Servicio"}\n${weekDayLabels[dayKeyFor(dateValue)] || dateValue} ${group.start} - ${groupEnd(group)}\n${practitioner?.name || "Profesional"} - ${room?.name || "Sala"}\n${groupEnrollmentLabel(group, dateValue)}\nPacientes fijos: ${names}`);
    return;
  }

  const service = groupService(group);
  const practitioner = byId(practitioners, group.practitionerId);
  const room = byId(rooms, group.roomId);
  dialog.dataset.groupId = group.id;
  dialog.dataset.date = dateValue;
  $("#group-session-title").textContent = group.name;
  $("#group-session-meta").textContent = `${service?.name || "Servicio"} - ${weekDayLabels[dayKeyFor(dateValue)] || dateValue} ${dateValue} - ${group.start} - ${groupEnd(group)} - ${practitioner?.name || "Profesional"} - ${room?.name || "Sala"}`;
  $("#group-session-capacity").textContent = groupEnrollmentLabel(group, dateValue);
  renderGroupSessionPanel(group, dateValue);
  dialog.showModal();
}

function renderGroupSessionPanel(group, dateValue) {
  const fixedList = $("#group-session-fixed");
  const extrasList = $("#group-session-extras");
  const dropinSelect = $("#group-dropin-patient");
  const fixedSelect = $("#group-fixed-patient");
  const addDropinButton = $("#add-dropin");
  const addFixedButton = $("#add-fixed-patient");
  if (!fixedList || !extrasList || !dropinSelect) return;

  const fixedPatients = groupFixedPatients(group);
  const extras = groupDropInsFor(group, dateValue);
  const capacity = groupCapacity(group);
  const currentFixedIds = new Set(group.patientIds || []);
  const currentDropinIds = new Set(extras.map((entry) => entry.patientId));

  fixedList.innerHTML = fixedPatients.length
    ? fixedPatients.map((patient) => `
      <article class="compact-item dropin-item">
        <div>
          <strong>${patient.name}</strong>
          <span>Fijo mensual - ${patient.phone || "sin telefono"}</span>
        </div>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin pacientes fijos inscritos. Gestiona los fijos desde Configuracion > Sesiones grupales.</span></article>`;

  extrasList.innerHTML = extras.length
    ? extras.map((entry) => {
        const patient = byId(patients, entry.patientId);
        return `<article class="compact-item dropin-item"><div><strong>${patient?.name || entry.name || "Paciente"}</strong><span>Sesion suelta - ${entry.createdAt || ""}</span></div><button class="secondary-button" type="button" data-dropin-remove="${entry.id}">Quitar</button></article>`;
      }).join("")
    : `<article class="compact-item"><span>Sin sesiones sueltas para este dia.</span></article>`;

  if (fixedSelect) {
    fixedSelect.innerHTML = "";
    fixedSelect.disabled = true;
    if (addFixedButton) addFixedButton.disabled = true;
  }

  const usedPatientIds = new Set([...(group.patientIds || []), ...extras.map((entry) => entry.patientId)]);
  dropinSelect.innerHTML = "";
  patients
    .filter((patient) => !usedPatientIds.has(patient.id))
    .forEach((patient) => dropinSelect.append(new Option(`${patient.name} - ${patient.phone || "sin telefono"}`, patient.id)));
  dropinSelect.disabled = !dropinSelect.options.length || !groupHasFreeSpot(group, dateValue);
  if (addDropinButton) addDropinButton.disabled = dropinSelect.disabled;

  const free = groupHasFreeSpot(group, dateValue);
  const completed = isGroupCompleted(group, dateValue);
  const completedButton = $("#complete-group-session");
  if (completedButton) {
    completedButton.disabled = completed;
    completedButton.textContent = completed ? "Sesion completada" : "Marcar sesion completada";
  }
  const completedLabel = $("#group-session-completed-label");
  if (completedLabel) {
    const production = groupSessionProduction(group, dateValue);
    completedLabel.textContent = completed
      ? `Sesion completada. Facturacion del dia: ${production.dropinRevenue} EUR en sueltos; los fijos van por cuota mensual.`
      : `Pendiente. Al completar se facturan solo sueltos del dia (${production.dropinRevenue} EUR); los fijos van por cuota mensual.`;
  }
  $("#group-session-warning").textContent = free ? "" : "Sesion completa para este dia.";
  $("#group-session-capacity").textContent = groupEnrollmentLabel(group, dateValue);

  $$('[data-fixed-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const patientId = button.dataset.fixedRemove;
      groups = groups.map((item) => item.id === group.id
        ? { ...item, patientIds: (item.patientIds || []).filter((id) => id !== patientId) }
        : item
      );
      saveClinicState("groups", groups);
      const updatedGroup = groups.find((item) => item.id === group.id) || group;
      renderGroupSessionPanel(updatedGroup, dateValue);
      renderAll();
    });
  });

  $$('[data-dropin-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      groupDropIns = groupDropIns.filter((entry) => entry.id !== button.dataset.dropinRemove);
      saveClinicState("group-dropins", groupDropIns);
      const updatedGroup = groups.find((item) => item.id === group.id) || group;
      renderGroupSessionPanel(updatedGroup, dateValue);
      renderAll();
    });
  });
}

function renderNextList() {
  const list = $("#next-list");
  list.innerHTML = "";
  $("#current-date-label").textContent = formatDateLabel();
  $(".day-panel h2").textContent = calendarMode === "day" ? "Citas del dia" : "Citas del rango";
  const range = calendarRange();
  const visibleGroups = [];
  for (let cursor = range.start; cursor <= range.end; cursor = addDaysIso(cursor, 1)) {
    groupsForDate(cursor)
      .filter((group) => isOwner() || group.practitionerId === currentSession.practitionerId)
      .filter(groupPassesAgendaFilters)
      .forEach((group) => visibleGroups.push({ ...group, date: cursor }));
  }
  visibleGroups
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))
    .forEach((group) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "next-item group-next-item";
      item.innerHTML = `
        <time>${group.start}</time>
        <strong>${group.name}</strong>
        <p>${group.date} - ${byId(practitioners, group.practitionerId)?.name || "Profesional"} - ${byId(rooms, group.roomId)?.name || "Sala"} - ${groupEnrollmentLabel(group)}</p>
      `;
      item.addEventListener("click", () => showGroupSummary(group, group.date));
      list.append(item);
    });
  visibleAppointments()
    .filter(appointmentPassesAgendaFilters)
    .slice()
    .sort((a, b) => minutes(a.start) - minutes(b.start))
    .forEach((appointment) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "next-item";
      item.innerHTML = `
        <time>${appointment.start}</time>
        <strong>${byId(patients, appointment.patientId)?.name || "Paciente no encontrado"}</strong>
        <p>${appointment.date || selectedDate} - ${byId(practitioners, appointment.practitionerId)?.name || "Profesional"} - ${byId(rooms, appointment.roomId)?.name || "Sala"}</p>
      `;
      item.addEventListener("click", () => openAppointmentDetail(appointment.id));
      list.append(item);
    });
  if (!list.children.length) {
    list.innerHTML = `<article class="compact-item"><span>Sin citas en este rango.</span></article>`;
  }
}

function formatDateLabel() {
  const date = dateOnly(selectedDate);
  const label = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
  if (calendarMode === "day") {
    return label;
  }
  if (calendarMode === "week") {
    const range = calendarRange();
    return `Semana del ${new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long" }).format(dateOnly(range.start))} al ${new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long" }).format(dateOnly(range.end))}`;
  }
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(date);
}

function renderPatients() {
  $("#patients-table").innerHTML = patients
    .map((patient) => `
      <tr>
        <td><button class="patient-link" type="button" data-patient-id="${patient.id}">${patient.name}</button></td>
        <td>${patient.phone}</td>
        <td>${patient.email || "No indicado"}</td>
        <td>${patient.last}</td>
        <td>
          <details class="item-menu table-item-menu">
            <summary aria-label="Opciones de ${patient.name}">...</summary>
            <div class="item-menu-popover">
              <button type="button" data-edit-patient="${patient.id}">Editar</button>
              <button class="danger-menu-action" type="button" data-delete-patient="${patient.id}">Eliminar</button>
            </div>
          </details>
        </td>
      </tr>
    `)
    .join("");

  $$(".patient-link").forEach((button) => {
    button.addEventListener("click", () => {
      openPatientProfile(button.dataset.patientId);
    });
  });
  $$("[data-edit-patient]").forEach((button) => button.addEventListener("click", () => openPatientEditor(button.dataset.editPatient)));
  $$("[data-delete-patient]").forEach((button) => button.addEventListener("click", () => deletePatientById(button.dataset.deletePatient)));
}

function patientFullNameFromForm(form) {
  const firstName = form.elements.firstName?.value.trim() || "";
  const lastName = form.elements.lastName?.value.trim() || "";
  return form.elements.name.value.trim() || [firstName, lastName].filter(Boolean).join(" ");
}

function normalizePatientIdentity(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function patientDuplicateFor(form, editingPatientId = "") {
  const dni = normalizePatientIdentity(form.elements.dni?.value);
  const fullName = normalizePatientIdentity(patientFullNameFromForm(form));
  return patients.find((patient) => {
    if (String(patient.id) === String(editingPatientId)) {
      return false;
    }
    const patientDni = normalizePatientIdentity(patient.dni);
    const patientName = normalizePatientIdentity(patient.name);
    return Boolean((dni && patientDni && dni === patientDni) || (fullName && patientName && fullName === patientName));
  });
}

function openPatientProfile(patientId) {
  selectedPatientId = patientId;
  patientProfileOpen = true;
  document.body.classList.add("patient-profile-open");
  renderPatientDetail();
}

function closePatientProfile() {
  patientProfileOpen = false;
  document.body.classList.remove("patient-profile-open");
  $("#patient-detail")?.classList.add("hidden");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("No se pudo leer el archivo.")));
    reader.readAsDataURL(file);
  });
}

function dataUrlToBlobUrl(dataUrl) {
  const [meta, payload] = String(dataUrl || "").split(",");
  if (!meta || !payload) return "";
  const mime = meta.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

function downloadDataUrlFile(dataUrl, filename = "documento") {
  if (!dataUrl) return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

function openDataUrlDocument(dataUrl, filename = "documento") {
  if (!dataUrl) return;
  const blobUrl = dataUrlToBlobUrl(dataUrl);
  if (!blobUrl) {
    downloadDataUrlFile(dataUrl, filename);
    return;
  }
  const link = document.createElement("a");
  link.href = blobUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

function renderPatientDetail() {
  const detail = $("#patient-detail");
  const patient = byId(patients, selectedPatientId);
  if (!patient || !patientProfileOpen) {
    detail.classList.add("hidden");
    document.body.classList.remove("patient-profile-open");
    return;
  }

  detail.classList.remove("hidden");
  document.body.classList.add("patient-profile-open");
  $("#patient-detail-name").textContent = patient.name;
  $("#patient-detail-data").innerHTML = `
    <dt>Nombre</dt>
    <dd>${patient.firstName || patient.name}</dd>
    <dt>Apellidos</dt>
    <dd>${patient.lastName || "No indicado"}</dd>
    <dt>DNI/NIE</dt>
    <dd>${patient.dni || "No indicado"}</dd>
    <dt>Archivo DNI</dt>
    <dd>${patient.dniFileName ? `<button class="secondary-button compact-inline-button" type="button" data-open-patient-file="${patient.id}:dni">Abrir ${patient.dniFileName}</button>` : "No adjuntado"}</dd>
    <dt>Sexo</dt>
    <dd>${patient.sex || "No indicado"}</dd>
    <dt>Email</dt>
    <dd>${patient.email || "No indicado"}</dd>
    <dt>Fecha nacimiento</dt>
    <dd>${patient.birthDate || "No indicada"}</dd>
    <dt>Ocupacion</dt>
    <dd>${patient.occupation || "No indicada"}</dd>
    <dt>Direccion</dt>
    <dd>${patient.address || "No indicada"}</dd>
    <dt>Telefono</dt>
    <dd>${patient.phone || "No indicado"}</dd>
    <dt>Alerta interna</dt>
    <dd>${patient.alert || "Sin alertas"}</dd>
  `;

  const patientAppointments = appointments
    .filter((appointment) => appointment.patientId === patient.id)
    .sort((a, b) => `${b.date || selectedDate} ${b.start}`.localeCompare(`${a.date || selectedDate} ${a.start}`));

  $("#patient-appointments").innerHTML = patientAppointments.length
    ? patientAppointments
        .map((appointment) => `
          <article class="compact-item">
            <strong>${appointment.date || selectedDate} - ${appointment.start} - ${byId(services, appointment.serviceId)?.name || "Servicio no encontrado"}</strong>
            <span>${byId(practitioners, appointment.practitionerId)?.name || "Profesional"} - ${statusLabel(appointment.status)}</span>
          </article>
        `)
        .join("")
    : `<article class="compact-item"><span>Sin citas registradas.</span></article>`;

  $$("[data-open-patient-file]").forEach((button) => {
    button.addEventListener("click", () => {
      const patientFile = byId(patients, button.dataset.openPatientFile.split(":")[0]);
      if (patientFile?.dniFileData) {
        openDataUrlDocument(patientFile.dniFileData, patientFile.dniFileName || "DNI");
      }
    });
  });

  const consents = patientConsents.filter((item) => item.patientId === patient.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  $("#patient-consents").innerHTML = consents.length
    ? consents.map((item) => `
      <article class="compact-item consent-card action-card">
        <div>
          <strong>${escapeHtml(item.templateName || "Consentimiento")}</strong>
          <span>${escapeHtml(item.createdAt)} - ${item.signed ? `Firmado ${item.signedAt ? new Date(item.signedAt).toLocaleString("es-ES") : ""}` : "Pendiente de firma"}${item.city ? ` - ${escapeHtml(item.city)}` : ""}${item.signatureDate ? ` - ${escapeHtml(formatConsentDate(item.signatureDate))}` : ""}</span>
          <p>${escapeHtml(excerptText(item.body || "Consentimiento asignado al paciente."))}</p>
          ${item.signatureData ? `<img class="signature-preview" src="${item.signatureData}" alt="Firma guardada">` : ""}
        </div>
        <button class="secondary-button" type="button" data-review-patient-consent="${item.id}">Revisar</button>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin consentimientos asignados.</span></article>`;
  $$("[data-review-patient-consent]").forEach((button) => {
    button.addEventListener("click", () => openPatientConsentDialog(button.dataset.reviewPatientConsent));
  });

  const packSelect = $("#patient-pack-template");
  if (packSelect) {
    packSelect.innerHTML = "";
    sessionPacks.forEach((pack) => packSelect.append(new Option(`${pack.name} - ${pack.sessions} sesiones - ${pack.price} EUR - ${packServiceLabel(pack)}`, pack.id)));
    packSelect.disabled = !sessionPacks.length;
  }

  const packs = patientPacks.filter((item) => item.patientId === patient.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  $("#patient-packs").innerHTML = packs.length
    ? packs.map((item) => `
      <article class="compact-item action-card patient-pack-card">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${patientPackRemaining(item)} disponibles de ${item.sessions} - ${item.price} EUR - ${packServiceLabel(item)} ${item.invoice ? "- Facturable" : ""}${item.invoiceGenerated ? ` - ${item.invoiceNumber || "Factura generada"}` : ""}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-use-patient-pack="${item.id}" ${patientPackRemaining(item) <= 0 ? "disabled" : ""}>Descontar sesion</button>
          <button class="secondary-button compact-inline-button" type="button" data-edit-patient-pack="${item.id}">Editar</button>
          <button class="secondary-button compact-inline-button" type="button" data-invoice-patient-pack="${item.id}">${item.invoiceGenerated ? "Reimprimir" : "Facturar"}</button>
        </div>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin bonos asignados.</span></article>`;

  const invoiceAppointments = appointments
    .filter((appointment) => appointment.patientId === patient.id && appointment.invoiceGenerated)
    .sort((a, b) => `${b.invoiceGeneratedAt || b.date || ""}`.localeCompare(`${a.invoiceGeneratedAt || a.date || ""}`));
  const invoicePacks = patientPacks
    .filter((pack) => pack.patientId === patient.id && pack.invoice)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const invoicesList = $("#patient-invoices");
  if (invoicesList) {
    invoicesList.innerHTML = [...invoiceAppointments.map((appointment) => `
      <article class="compact-item action-card">
        <div>
          <strong>${appointment.invoiceNumber || "Factura"} - ${appointment.date || selectedDate}</strong>
          <span>${byId(services, appointment.serviceId)?.name || "Servicio"} - ${servicePrice(appointment)} EUR</span>
        </div>
        <button class="secondary-button" type="button" data-reprint-invoice="${appointment.id}">Reimprimir</button>
      </article>
    `), ...invoicePacks.map((pack) => `
      <article class="compact-item action-card">
        <div>
          <strong>${pack.invoiceGenerated ? (pack.invoiceNumber || "Factura") : "Bono pendiente de factura"} - ${pack.name}</strong>
          <span>${pack.createdAt} - ${pack.price} EUR - ${packServiceLabel(pack)}</span>
        </div>
        <button class="secondary-button" type="button" data-reprint-pack-invoice="${pack.id}">${pack.invoiceGenerated ? "Reimprimir" : "Facturar"}</button>
      </article>
    `)].join("") || `<article class="compact-item"><span>Sin facturas generadas todavia.</span></article>`;
  }
  $$("[data-reprint-invoice]").forEach((button) => {
    button.addEventListener("click", () => {
      const appointment = byId(appointments, button.dataset.reprintInvoice);
      if (appointment) generateInvoiceForAppointment(appointment);
    });
  });
  $$("[data-use-patient-pack]").forEach((button) => {
    button.addEventListener("click", () => consumePatientPack(button.dataset.usePatientPack));
  });
  $$("[data-edit-patient-pack]").forEach((button) => {
    button.addEventListener("click", () => openPatientPackDialog(button.dataset.editPatientPack));
  });
  $$("[data-invoice-patient-pack], [data-reprint-pack-invoice]").forEach((button) => {
    button.addEventListener("click", () => generateInvoiceForPatientPack(button.dataset.invoicePatientPack || button.dataset.reprintPackInvoice));
  });

  const notes = clinicalNotes
    .filter((note) => note.patientId === patient.id)
    .sort((a, b) => `${b.date || ""} ${b.id || ""}`.localeCompare(`${a.date || ""} ${a.id || ""}`));
  $("#clinical-notes").innerHTML = notes.length
    ? notes
        .map((note) => {
          const reason = note.reason || note.diagnosis || "";
          return `
          <article class="compact-item clinical-note-card action-card">
            <div>
              <strong>${note.date} - ${note.author}${reason ? ` - ${escapeHtml(reason)}` : ""}</strong>
              <p>${escapeHtml(excerptText(note.content || "Nota clinica", 260))}</p>
              ${note.attachmentName ? `<span>Adjunto: ${escapeHtml(note.attachmentName)}</span>` : ""}
            </div>
            <div class="compact-actions">
              <button class="secondary-button compact-inline-button" type="button" data-open-note="${note.id}">Abrir</button>
              <button class="secondary-button compact-inline-button" type="button" data-edit-note="${note.id}">Editar</button>
              <button class="danger-button compact-inline-button" type="button" data-delete-note="${note.id}">Borrar</button>
              ${note.attachmentName ? `<button class="secondary-button compact-inline-button" type="button" data-open-note-file="${note.id}">Abrir archivo</button><button class="secondary-button compact-inline-button" type="button" data-download-note-file="${note.id}">Descargar</button>` : ""}
            </div>
          </article>
        `;
        })
        .join("")
    : `<article class="compact-item"><span>Sin notas clinicas todavia.</span></article>`;

  $$("[data-open-note], [data-edit-note], [data-delete-note]").forEach((button) => {
    button.addEventListener("click", () => {
      openClinicalNoteDialog(button.dataset.openNote || button.dataset.editNote || button.dataset.deleteNote);
    });
  });

  $$("[data-open-note-file]").forEach((button) => {
    button.addEventListener("click", () => {
      const note = clinicalNotes.find((item) => String(item.id) === String(button.dataset.openNoteFile));
      if (note?.attachmentData) {
        openDataUrlDocument(note.attachmentData, note.attachmentName || "Archivo clinico");
      }
    });
  });
  $$("[data-download-note-file]").forEach((button) => {
    button.addEventListener("click", () => {
      const note = clinicalNotes.find((item) => String(item.id) === String(button.dataset.downloadNoteFile));
      if (note?.attachmentData) {
        downloadDataUrlFile(note.attachmentData, note.attachmentName || "archivo-clinico");
      }
    });
  });
}

function renderTeam() {
  const professionalCards = practitioners.map((practitioner) => `
    <article class="team-card">
      <span class="tag">Profesional</span>
      <h2>${practitioner.name}</h2>
      <p>${practitioner.specialty}</p>
      <p>Disponibilidad: ${practitionerAvailabilityLabel(practitioner)}</p>
      ${canManageClinic() ? `
        <details class="item-menu team-card-menu">
          <summary aria-label="Opciones de ${practitioner.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-team-edit-practitioner="${practitioner.id}">Editar</button>
            <button class="danger-menu-action" type="button" data-team-delete-practitioner="${practitioner.id}">Eliminar</button>
          </div>
        </details>
      ` : ""}
    </article>
  `);

  const roomCards = rooms.map((room) => `
    <article class="team-card">
      <span class="tag">Sala</span>
      <h2>${room.name}</h2>
      <p>${room.type}</p>
      <p>Estado: disponible</p>
      ${canManageClinic() ? `
        <details class="item-menu team-card-menu">
          <summary aria-label="Opciones de ${room.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-team-edit-room="${room.id}">Editar</button>
            <button class="danger-menu-action" type="button" data-team-delete-room="${room.id}">Eliminar</button>
          </div>
        </details>
      ` : ""}
    </article>
  `);

  $("#team-grid").innerHTML = [...professionalCards, ...roomCards].join("")
    || `<article class="team-card"><span class="tag">Configuracion</span><h2>Clinica sin equipo todavia</h2><p>Crea trabajadores y salas para empezar a construir esta clinica.</p></article>`;

  $$("[data-team-edit-practitioner]").forEach((button) => button.addEventListener("click", () => openPractitionerEditor(button.dataset.teamEditPractitioner)));
  $$("[data-team-delete-practitioner]").forEach((button) => button.addEventListener("click", () => deletePractitionerById(button.dataset.teamDeletePractitioner)));
  $$("[data-team-edit-room]").forEach((button) => button.addEventListener("click", () => openRoomEditor(button.dataset.teamEditRoom)));
  $$("[data-team-delete-room]").forEach((button) => button.addEventListener("click", () => deleteRoomById(button.dataset.teamDeleteRoom)));
}

function renderSettings() {
  document.body.classList.toggle("availability-only-settings", isAvailabilityOnlySettingsSession());
  $("#new-unavailability-settings").disabled = !canManageAvailability();
  const clinicForm = $("#clinic-form");
  clinicForm.elements.name.value = clinic.name;
  clinicForm.elements.email.value = clinic.email;
  clinicForm.elements.phone.value = clinic.phone;

  $("#settings-practitioners").innerHTML = practitioners.length ? practitioners
    .map((practitioner) => `
      <article class="compact-item worker-setting">
        <label class="worker-color-swatch" title="Cambiar color de ${practitioner.name}">
          <input type="color" value="${practitioner.color || "#168776"}" data-worker-color="${practitioner.id}" />
          <span class="worker-color-dot" style="background:${practitioner.color || "#168776"}"></span>
        </label>
        <div>
          <strong>${practitioner.name}</strong>
          <span>${practitioner.specialty} - ${practitionerAvailabilityLabel(practitioner)} - Comision ${Number(practitioner.commissionRate * 100).toLocaleString("es-ES")}%</span>
          <span>${practitioner.email || "Sin email de acceso"} - Clave propia</span>
        </div>
        <details class="item-menu">
          <summary aria-label="Opciones de ${practitioner.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-edit-practitioner="${practitioner.id}">Editar</button>
            <button class="danger-menu-action" type="button" data-delete-practitioner="${practitioner.id}">Eliminar</button>
          </div>
        </details>
      </article>
    `)
    .join("") : `<article class="compact-item"><span>Sin trabajadores creados.</span></article>`;

  $$("[data-worker-color]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const workerId = event.target.dataset.workerColor;
      practitioners = practitioners.map((practitioner) => (
        practitioner.id === workerId ? { ...practitioner, color: event.target.value } : practitioner
      ));
      saveClinicState("practitioners", practitioners);
      renderSchedule();
      renderNextList();
      renderPerformance();
      const dot = event.target.closest(".worker-setting")?.querySelector(".worker-color-dot");
      if (dot) dot.style.background = event.target.value;
    });
  });
  $$("[data-edit-practitioner]").forEach((button) => button.addEventListener("click", () => openPractitionerEditor(button.dataset.editPractitioner)));
  $$("[data-delete-practitioner]").forEach((button) => button.addEventListener("click", () => deletePractitionerById(button.dataset.deletePractitioner)));

  $("#settings-rooms").innerHTML = rooms.length ? rooms
    .map((room) => `
      <article class="compact-item action-card">
        <div>
          <strong>${room.name}</strong>
          <span>${room.type}</span>
        </div>
        <details class="item-menu">
          <summary aria-label="Opciones de ${room.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-edit-room="${room.id}">Editar</button>
            <button class="danger-menu-action" type="button" data-delete-room="${room.id}">Eliminar</button>
          </div>
        </details>
      </article>
    `)
    .join("") : `<article class="compact-item"><span>Sin salas creadas.</span></article>`;
  $$("[data-edit-room]").forEach((button) => button.addEventListener("click", () => openRoomEditor(button.dataset.editRoom)));
  $$("[data-delete-room]").forEach((button) => button.addEventListener("click", () => deleteRoomById(button.dataset.deleteRoom)));

  const upcomingBlocks = availabilityBlocks
    .filter((block) => !isPractitionerSession() || block.practitionerId === currentSession.practitionerId)
    .slice()
    .sort((a, b) => `${a.date} ${a.start || ""}`.localeCompare(`${b.date} ${b.start || ""}`))
    .slice(0, 12);
  $("#settings-unavailability").innerHTML = upcomingBlocks.length ? upcomingBlocks
    .map((block) => {
      const practitioner = byId(practitioners, block.practitionerId);
      return `
        <article class="compact-item availability-setting-card">
          <div>
            <strong>${practitioner?.name || "Trabajador"}</strong>
            <span>${availabilityBlockDateLabel(block)} - ${availabilityBlockLabel(block)}</span>
          </div>
          <details class="item-menu">
            <summary aria-label="Opciones de disponibilidad">...</summary>
            <div class="item-menu-popover">
              <button class="danger-menu-action" type="button" data-delete-availability="${block.id}">Eliminar</button>
            </div>
          </details>
        </article>
      `;
    })
    .join("") : `<article class="compact-item"><span>Sin vacaciones, dias libres ni bloqueos creados.</span></article>`;
  $$("[data-delete-availability]").forEach((button) => button.addEventListener("click", () => deleteAvailabilityBlockById(button.dataset.deleteAvailability)));

  $("#settings-services").innerHTML = services.length ? services
    .map((service) => `
      <article class="compact-item service-setting-card action-card">
        <div>
          <strong>${service.name}</strong>
          <span>${serviceKindLabel(service)} - ${service.duration} min - ${service.active ? "Activo" : "Inactivo"}</span>
          ${service.type === "group" ? `
            <span>Mensual ${service.monthlyPrice || 0} EUR - Sesion suelta ${service.dropInPrice || service.price || 0} EUR - Comision ${service.commissionPerPatient || 0}%</span>
          ` : `
            <span>Precio ${service.price || 0} EUR</span>
          `}
        </div>
        <details class="item-menu">
          <summary aria-label="Opciones de ${service.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-edit-service="${service.id}">Editar</button>
            <button class="danger-menu-action" type="button" data-delete-service="${service.id}">Eliminar</button>
          </div>
        </details>
      </article>
    `)
    .join("") : `<article class="compact-item"><span>Sin servicios creados. Crea al menos uno para poder agendar citas.</span></article>`;
  $$("[data-edit-service]").forEach((button) => button.addEventListener("click", () => openServiceEditor(button.dataset.editService)));
  $$("[data-delete-service]").forEach((button) => button.addEventListener("click", () => deleteServiceById(button.dataset.deleteService)));

  const groupsList = $("#settings-groups");
  if (groupsList) {
    groupsList.innerHTML = groups.length ? groups
      .map((group) => {
        const service = groupService(group);
        const practitioner = byId(practitioners, group.practitionerId);
        const room = byId(rooms, group.roomId);
        const days = (group.days || []).map((day) => weekDayLabels[day]).filter(Boolean).join(", ");
        return `
          <article class="compact-item group-setting-card">
            <div class="group-card-main">
              <strong>${group.name}</strong>
              <span>${service?.name || "Servicio"} - ${days || "Sin dias"} - ${group.start} - ${groupEnd(group)}</span>
              <span>${practitioner?.name || "Profesional"} - ${room?.name || "Sala"} - ${groupEnrollmentLabel(group)}</span>
              <span>Capacidad de esta sesion: ${groupCapacity(group)} plazas</span>
              <details class="item-menu group-item-menu">
                <summary aria-label="Opciones de ${group.name}">...</summary>
                <div class="item-menu-popover">
                  <button type="button" data-edit-group="${group.id}">Editar datos</button>
                  <button type="button" data-open-group="${group.id}">Ver sesion</button>
                  <button class="danger-menu-action" type="button" data-delete-group="${group.id}">Eliminar</button>
                </div>
              </details>
            </div>
            <div class="group-fixed-management">
              <strong>Pacientes fijos</strong>
              <div class="group-fixed-list">
                ${groupFixedPatients(group).length ? groupFixedPatients(group).map((patient) => `
                  <span class="group-fixed-chip">${patient.name}<button type="button" data-config-remove-fixed="${group.id}:${patient.id}">x</button></span>
                `).join("") : `<span class="muted-text">Sin pacientes fijos.</span>`}
              </div>
              <div class="group-inline-add">
                <label class="search-patient-field">
                  <span>&#128269;</span>
                  <input list="patients-fixed-${group.id}" data-config-add-fixed-input="${group.id}" placeholder="Buscar paciente..." />
                </label>
                <datalist id="patients-fixed-${group.id}">
                  ${patients.filter((patient) => !(group.patientIds || []).includes(patient.id)).map((patient) => `<option value="${patient.name}" data-patient-id="${patient.id}">${patient.phone || "sin telefono"}</option>`).join("")}
                </datalist>
                <button class="secondary-button" type="button" data-config-add-fixed="${group.id}">Anadir fijo</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("") : `<article class="compact-item"><span>Sin grupos creados. Crea uno para bloquear sesiones recurrentes en agenda.</span></article>`;

    $$("[data-edit-group]").forEach((button) => button.addEventListener("click", () => openGroupEditor(button.dataset.editGroup)));
    $$("[data-delete-group]").forEach((button) => button.addEventListener("click", () => deleteGroupById(button.dataset.deleteGroup)));
    $$("[data-open-group]").forEach((button) => {
      const group = groups.find((item) => item.id === button.dataset.openGroup);
      if (group) button.addEventListener("click", () => showGroupSummary(group, selectedDate));
    });
    $$("[data-config-add-fixed]").forEach((button) => {
      button.addEventListener("click", () => {
        const groupId = button.dataset.configAddFixed;
        const input = document.querySelector(`[data-config-add-fixed-input="${groupId}"]`);
        const typed = input?.value.trim() || "";
        const patient = patients.find((item) => item.id === typed || item.name.toLowerCase() === typed.toLowerCase());
        if (!patient) return;
        const group = groups.find((item) => item.id === groupId);
        if (!group) return;
        if ((group.patientIds || []).includes(patient.id)) return;
        if ((group.patientIds || []).length >= groupCapacity(group)) {
          alert("El grupo ya esta completo.");
          return;
        }
        groups = groups.map((item) => item.id === groupId ? { ...item, patientIds: [...(item.patientIds || []), patient.id] } : item);
        saveClinicState("groups", groups);
        renderAll();
      });
    });
    $$("[data-config-remove-fixed]").forEach((button) => {
      button.addEventListener("click", () => {
        const [groupId, patientId] = button.dataset.configRemoveFixed.split(":");
        groups = groups.map((item) => item.id === groupId ? { ...item, patientIds: (item.patientIds || []).filter((id) => id !== patientId) } : item);
        saveClinicState("groups", groups);
        renderAll();
      });
    });
  }
}
function renderServices() {
  $("#services-table").innerHTML = services
    .map((service) => `
      <tr>
        <td><strong>${service.name}</strong><br><span>${service.description || "Sin descripcion"}</span></td>
        <td>${service.duration} min</td>
        <td>
          ${service.type === "group"
            ? `Sesion grupal - ${service.dropInPrice || service.price || 0} EUR/sesion - ${service.monthlyPrice || 0} EUR/mes - ${service.commissionPerPatient || 0}% prof.`
            : `${service.price || 0} EUR`}
        </td>
        <td><span class="status-pill ${service.active ? "confirmed" : "cancelled"}">${service.active ? "Activo" : "Inactivo"}</span></td>
      </tr>
    `)
    .join("");
}

function renderStats() {
  const values = [68, 74, 61, 82, 77, 48, 32];
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  $("#bar-chart").innerHTML = values
    .map((value, index) => `
      <div class="bar">
        <span style="height:${value}%"></span>
        <small>${days[index]}</small>
      </div>
    `)
    .join("");
}

function renderBilling() {
  const appointmentRows = appointments
    .filter((appointment) => byId(services, appointment.serviceId)?.type !== "group")
    .map((appointment) => ({
      id: appointment.id,
      sortKey: `${appointment.date || selectedDate} ${appointment.start}`,
      concept: `${appointment.start} - ${byId(services, appointment.serviceId)?.name || "Servicio no encontrado"}`,
      patient: byId(patients, appointment.patientId)?.name || "Paciente no encontrado",
      practitioner: byId(practitioners, appointment.practitionerId)?.name || "Profesional",
      status: appointment.status,
      statusText: statusLabel(appointment.status),
      amount: servicePrice(appointment),
      appointmentId: appointment.id
    }));
  const groupRows = groupBillingRows();
  const packRows = patientPacks
    .filter((pack) => pack.invoice)
    .map((pack) => ({
      id: pack.id,
      sortKey: pack.createdAt || todayIso(),
      concept: `Bono - ${pack.name} (${pack.sessions} sesiones)`,
      patient: byId(patients, pack.patientId)?.name || "Paciente no encontrado",
      practitioner: packServiceLabel(pack),
      status: "completed",
      statusText: "Bono",
      amount: Number(pack.price || 0)
    }));
  const visible = [...appointmentRows, ...groupRows, ...packRows];
  const paid = appointmentRows
    .filter((appointment) => appointment.status === "completed")
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "completed").reduce((total, row) => total + row.amount, 0)
    + packRows.reduce((total, row) => total + row.amount, 0);
  const pending = appointmentRows
    .filter((appointment) => ["pending", "confirmed"].includes(appointment.status))
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "pending").reduce((total, row) => total + row.amount, 0);
  const lost = appointmentRows
    .filter((appointment) => ["cancelled", "no_show"].includes(appointment.status))
    .reduce((total, appointment) => total + appointment.amount, 0);

  $("#billing-paid").textContent = `${paid} EUR`;
  $("#billing-pending").textContent = `${pending} EUR`;
  $("#billing-lost").textContent = `${lost} EUR`;
  $("#billing-table").innerHTML = visible
    .slice()
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((row) => `
      <tr>
        <td>${row.concept}</td>
        <td>${row.patient}</td>
        <td>${row.practitioner}</td>
        <td><span class="status-pill ${row.status}">${row.statusText}</span></td>
        <td>${row.amount} EUR</td>
        <td>${row.appointmentId ? `<button class="secondary-button row-action" type="button" data-appointment-id="${row.appointmentId}">Abrir</button>` : ""}</td>
      </tr>
    `)
    .join("");

  $$(".row-action").forEach((button) => {
    button.addEventListener("click", () => openAppointmentDetail(button.dataset.appointmentId));
  });
}

function groupBillingRows() {
  const currentMonth = selectedDate.slice(0, 7);
  const monthlyRows = groups.flatMap((group) => {
    const pricing = groupPricing(group);
    if (!pricing.monthlyPrice) {
      return [];
    }
    const practitioner = byId(practitioners, group.practitionerId)?.name || "Profesional";
    return groupFixedPatients(group).map((patient) => ({
      id: `group-monthly-${group.id}-${patient.id}-${currentMonth}`,
      sortKey: `${currentMonth}-01 ${group.start || "00:00"}`,
      concept: `Cuota mensual - ${group.name}`,
      patient: patient.name,
      practitioner,
      status: "pending",
      statusText: "Cuota mensual",
      amount: pricing.monthlyPrice
    }));
  });
  const dropinRows = groupCompletions
    .filter((entry) => String(entry.date || "").slice(0, 7) === currentMonth)
    .map((entry) => {
      const group = groups.find((item) => item.id === entry.groupId);
      const pricing = group ? groupPricing(group) : { dropInPrice: 0 };
      const amount = Number(entry.dropinRevenue ?? entry.revenue ?? (entry.dropinCount || 0) * pricing.dropInPrice);
      return {
        id: entry.id,
        sortKey: `${entry.date} ${entry.start || "00:00"}`,
        concept: `${entry.start || ""} - Sueltos sesion grupal${group ? ` - ${group.name}` : ""}`,
        patient: `${entry.dropinCount || 0} sueltos`,
        practitioner: byId(practitioners, entry.practitionerId)?.name || "Profesional",
        status: "completed",
        statusText: "Completada",
        amount
      };
    })
    .filter((row) => row.amount > 0);
  return [...monthlyRows, ...dropinRows];
}

function billableAppointments() {
  return appointments.filter((appointment) => ["confirmed", "completed"].includes(appointment.status));
}

function groupCompletedSessionsForPractitioner(practitioner) {
  return groupCompletions
    .filter((entry) => entry.practitionerId === practitioner.id)
    .map((entry) => {
      const group = groups.find((item) => item.id === entry.groupId);
      const service = group ? groupService(group) : byId(services, entry.serviceId);
      const room = byId(rooms, entry.roomId);
      return {
        ...entry,
        groupName: group?.name || "Sesion grupal",
        serviceName: service?.name || "Servicio grupal",
        roomName: room?.name || "Sala",
        duration: service?.duration || 60
      };
    });
}

function practitionerReport(practitioner) {
  const ownAppointments = billableAppointments().filter((appointment) => appointment.practitionerId === practitioner.id);
  const ownGroupSessions = groupCompletedSessionsForPractitioner(practitioner);
  const appointmentRevenue = ownAppointments.reduce((total, appointment) => total + servicePrice(appointment), 0);
  const groupRevenue = ownGroupSessions.reduce((total, session) => total + Number(session.revenue || 0), 0);
  const revenue = appointmentRevenue + groupRevenue;
  const minutesBooked = ownAppointments.reduce((total, appointment) => total + (byId(services, appointment.serviceId)?.duration || 60), 0)
    + ownGroupSessions.reduce((total, session) => total + (session.duration || 60), 0);
  const billableItems = ownAppointments.length + ownGroupSessions.length;
  const averageTicket = billableItems ? Math.round(revenue / billableItems) : 0;
  const appointmentPayout = ownAppointments.reduce((total, appointment) => total + serviceCommissionAmount(appointment, practitioner), 0);
  const groupPayout = ownGroupSessions.reduce((total, session) => total + Number(session.payout || 0), 0);
  const payout = appointmentPayout + groupPayout;
  const occupancy = Math.min(100, Math.round((minutesBooked / 480) * 100));

  return {
    practitioner,
    appointments: ownAppointments,
    groupSessions: ownGroupSessions,
    revenue,
    averageTicket,
    payout,
    occupancy,
    targetProgress: Math.min(100, Math.round((revenue / practitioner.target) * 100))
  };
}

function renderPerformance() {
  const selectedWorker = isOwner()
    ? byId(practitioners, $("#worker-profile-select").value) || practitioners[0]
    : currentPractitioner();
  if (!selectedWorker) {
    return;
  }
  const workerReport = practitionerReport(selectedWorker);
  const allReports = practitioners.map(practitionerReport).sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = allReports.reduce((total, report) => total + report.revenue, 0);
  const totalAppointments = allReports.reduce((total, report) => total + report.appointments.length + (report.groupSessions?.length || 0), 0);
  const topReport = allReports[0];
  const averageOccupancy = allReports.length
    ? Math.round(allReports.reduce((total, report) => total + report.occupancy, 0) / allReports.length)
    : 0;

  $$("#worker-performance .permission-note").forEach((note) => note.remove());
  if (!isOwner()) {
    $("#worker-performance").insertAdjacentHTML(
      "afterbegin",
      `<p class="permission-note">Vista limitada al perfil del trabajador. El informe completo queda reservado para Direccion.</p>`
    );
  }

  $("#worker-summary").innerHTML = `
    <div>
      <span>Perfil de trabajador</span>
      <strong>${selectedWorker.name}</strong>
      <p>${selectedWorker.specialty}</p>
    </div>
    <div>
      <span>Facturacion</span>
      <strong>${workerReport.revenue} EUR</strong>
    </div>
    <div>
      <span>Comision estimada</span>
      <strong>${workerReport.payout} EUR</strong>
    </div>
    <div>
      <span>Objetivo mensual</span>
      <strong>${workerReport.targetProgress}%</strong>
      <div class="progress-track"><div class="progress-fill" style="width:${workerReport.targetProgress}%"></div></div>
    </div>
  `;

  $("#worker-billing").innerHTML = `
    <article><span>Sesiones facturables</span><strong>${workerReport.appointments.length + (workerReport.groupSessions?.length || 0)}</strong></article>
    <article><span>Ticket medio</span><strong>${workerReport.averageTicket} EUR</strong></article>
    <article><span>Ocupacion demo</span><strong>${workerReport.occupancy}%</strong></article>
    <article><span>Comision</span><strong>${Number(selectedWorker.commissionRate * 100).toLocaleString("es-ES")}%</strong></article>
  `;

  const activityItems = [
    ...workerReport.appointments.map((appointment) => ({
      type: "appointment",
      start: appointment.start,
      label: `${appointment.start} - ${byId(patients, appointment.patientId)?.name || "Paciente no encontrado"}`,
      detail: `${byId(services, appointment.serviceId)?.name || "Servicio"} - ${byId(rooms, appointment.roomId)?.name || "Sala"}`
    })),
    ...(workerReport.groupSessions || []).map((session) => ({
      type: "group",
      start: session.start,
      label: `${session.start} - ${session.groupName}`,
      detail: `${session.serviceName} - ${session.roomName} - ${session.attendees} asistentes - ${session.revenue} EUR`
    }))
  ];

  $("#worker-activity").innerHTML = activityItems.length
    ? activityItems
        .slice()
        .sort((a, b) => minutes(a.start) - minutes(b.start))
        .map((item) => `
          <article class="compact-item">
            <strong>${item.label}</strong>
            <span>${item.detail}</span>
          </article>
        `)
        .join("")
    : `<article class="compact-item"><span>Sin sesiones facturables todavia.</span></article>`;

  $("#owner-summary").innerHTML = `
    <div><span>Facturacion equipo</span><strong>${totalRevenue} EUR</strong></div>
    <div><span>Citas facturables</span><strong>${totalAppointments}</strong></div>
    <div><span>Mayor facturacion</span><strong>${topReport ? topReport.practitioner.name : "-"}</strong></div>
    <div><span>Ocupacion media</span><strong>${averageOccupancy}%</strong></div>
  `;

  $("#owner-report-table").innerHTML = allReports
    .map((report) => `
      <tr>
        <td><strong>${report.practitioner.name}</strong><br><span>${report.practitioner.specialty}</span></td>
        <td>${report.appointments.length + (report.groupSessions?.length || 0)}</td>
        <td>${report.revenue} EUR</td>
        <td>${report.averageTicket} EUR</td>
        <td>
          ${report.occupancy}%
          <div class="progress-track"><div class="progress-fill" style="width:${report.occupancy}%"></div></div>
        </td>
      </tr>
    `)
    .join("");
}


function appointmentDateTime(appointment) {
  return new Date(`${appointment.date || selectedDate}T${appointment.start || "00:00"}:00`);
}

function reminderKey(appointmentId, windowKey) {
  return `${appointmentId}:${windowKey}`;
}

function formatDateTimeForReminder(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function reminderMessage(reminder) {
  const patient = byId(patients, reminder.patientId);
  const practitioner = byId(practitioners, reminder.practitionerId);
  const service = byId(services, reminder.serviceId);
  const clinicName = clinic?.name || "la clinica";
  return `Hola ${patient?.name || "paciente"}, te recordamos tu cita en ${clinicName} el ${reminder.date} a las ${reminder.start} con ${practitioner?.name || "tu profesional"}${service ? ` para ${service.name}` : ""}. Si necesitas cambiarla, responde a este mensaje.`;
}

function reminderSlotsForAppointment(appointment) {
  if (!["pending", "confirmed"].includes(appointment.status)) {
    return [];
  }
  const patient = byId(patients, appointment.patientId);
  if (!patient?.phone) {
    return [];
  }
  const appointmentAt = appointmentDateTime(appointment);
  const slots = [
    { windowKey: "24h", label: "Pendiente 24h", hoursBefore: 24 },
    { windowKey: "2h", label: "Pendiente 2h", hoursBefore: 2 }
  ];
  return slots.map((slot) => {
    const sendAt = new Date(appointmentAt.getTime() - slot.hoursBefore * 60 * 60 * 1000);
    return {
      id: reminderKey(appointment.id, slot.windowKey),
      appointmentId: appointment.id,
      windowKey: slot.windowKey,
      label: slot.label,
      sendAt: sendAt.toISOString(),
      date: appointment.date || selectedDate,
      start: appointment.start,
      patientId: appointment.patientId,
      practitionerId: appointment.practitionerId,
      serviceId: appointment.serviceId,
      phone: patient.phone,
      patientName: patient.name
    };
  });
}

function reminderActionFor(id) {
  return reminderActions.find((item) => item.id === id);
}

function isFinalReminderStatus(status) {
  return ["sent", "failed"].includes(status === "confirmed" ? "sent" : status);
}

function hasFinalReminderForSlot(reminderId) {
  return reminderActions.some((item) =>
    item.id === reminderId && isFinalReminderStatus(item.status)
  );
}

function dedupeReminderActions(actions) {
  const ordered = [...actions].sort((a, b) =>
    new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  );
  const seen = new Set();
  const result = [];
  ordered.forEach((item) => {
    const key = `action:${item.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  });
  return result;
}

function buildReminderQueue() {
  const allSlots = appointments.flatMap(reminderSlotsForAppointment);
  const pendingSlots = allSlots
    .filter((slot) => !hasFinalReminderForSlot(slot.id))
    .filter((slot) => !isFinalReminderStatus(reminderActionFor(slot.id)?.status))
    .map((slot) => {
      const action = reminderActionFor(slot.id);
      return { ...slot, ...(action || {}), status: action?.status || "pending" };
    })
    .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt));

  const byAppointment = new Map();
  pendingSlots.forEach((slot) => {
    if (!byAppointment.has(slot.appointmentId)) {
      byAppointment.set(slot.appointmentId, slot);
    }
  });
  return [...byAppointment.values()].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt));
}

function buildReminderHistory() {
  const activeAppointmentIds = new Set(appointments.map((item) => String(item.id)));
  return dedupeReminderActions(reminderActions)
    .filter((item) => isFinalReminderStatus(item.status))
    .filter((item) => activeAppointmentIds.has(String(item.appointmentId)))
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

function saveReminderAction(reminder, status) {
  const normalizedStatus = status === "confirmed" ? "sent" : status;
  const finalStatus = isFinalReminderStatus(normalizedStatus);
  const previous = reminderActionFor(reminder.id);
  const next = {
    ...(previous || reminder),
    ...reminder,
    status: normalizedStatus,
    message: reminderMessage(reminder),
    updatedAt: new Date().toISOString()
  };

  reminderActions = reminderActions
    .filter((item) => item.id !== reminder.id);

  reminderActions = dedupeReminderActions([next, ...reminderActions]);
  saveClinicState("reminder-actions", reminderActions);
  renderAll();
}

function whatsappReminderUrl(reminder) {
  const phone = cleanPhone(reminder.phone);
  const message = reminderMessage(reminder);
  if (!phone) {
    return "";
  }
  return `https://wa.me/34${phone.replace(/^34/, "")}?text=${encodeURIComponent(message)}`;
}

function prepareReminderWhatsApp(reminder, options = {}) {
  const { openWindow = true, auto = false } = options;
  const url = whatsappReminderUrl(reminder);
  const message = reminderMessage(reminder);
  navigator.clipboard?.writeText(message).catch(() => {});
  if (!url) {
    alert("Este paciente no tiene telefono valido para WhatsApp.");
    saveReminderAction(reminder, "failed");
    return false;
  }
  if (openWindow) {
    window.open(url, "_blank", "noopener");
  }
  saveReminderAction({ ...reminder, message, whatsappUrl: url, autoPrepared: auto }, "prepared");
  return true;
}

function openReminderWhatsApp(reminder) {
  prepareReminderWhatsApp(reminder, { openWindow: true });
}

function dueReminderQueue() {
  const now = Date.now();
  return buildReminderQueue()
    .filter((reminder) => new Date(reminder.sendAt).getTime() <= now)
    .filter((reminder) => reminder.status !== "prepared");
}

function runDueWhatsAppReminders(openWindows = true) {
  if (autoReminderRunning) {
    return 0;
  }
  autoReminderRunning = true;
  const due = dueReminderQueue();
  let prepared = 0;
  due.forEach((reminder, index) => {
    if (prepareReminderWhatsApp(reminder, { openWindow: openWindows && index === 0, auto: true })) {
      prepared += 1;
    }
  });
  autoReminderRunning = false;
  const status = $("#automation-status");
  if (status) {
    status.textContent = prepared
      ? `${prepared} recordatorio(s) vencido(s) preparados. WhatsApp se abre con el primero para confirmar el envio.`
      : "No hay recordatorios vencidos para preparar ahora.";
  }
  return prepared;
}

function renderReminderCard(reminder, mode = "pending") {
  const article = document.createElement("article");
  article.className = `reminder-card ${mode}`;
  const patient = byId(patients, reminder.patientId);
  const phone = reminder.phone || patient?.phone || "Sin telefono";
  const sendAt = formatDateTimeForReminder(new Date(reminder.sendAt || reminder.updatedAt || Date.now()));
  const statusText = {
    pending: reminder.label || "Pendiente",
    prepared: "Preparado",
    sent: "Enviado",
    failed: "Fallido"
  }[reminder.status === "confirmed" ? "sent" : reminder.status] || reminder.status;

  article.innerHTML = `
    <div class="reminder-card-header">
      <strong>${patient?.name || reminder.patientName || "Paciente"}</strong>
      <span class="status-pill ${reminder.status}">${statusText}</span>
    </div>
    <p>${reminder.message || reminderMessage(reminder)}</p>
    <small>Enviar: ${sendAt} - Cita: ${reminder.date}, ${reminder.start} - Tel: ${phone}</small>
  `;

  if (mode === "pending") {
    const actions = document.createElement("div");
    actions.className = "reminder-actions";
    const whatsappLabel = reminder.status === "prepared" ? "Abrir WhatsApp" : "Preparar WhatsApp";
    actions.innerHTML = `
      <button class="primary-button" type="button" data-reminder-action="whatsapp">${whatsappLabel}</button>
      <button class="secondary-button" type="button" data-reminder-action="sent">Enviado</button>
      <button class="secondary-button danger" type="button" data-reminder-action="failed">Fallido</button>
    `;
    actions.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        actions.querySelectorAll("button").forEach((item) => {
          item.disabled = true;
        });
        const action = button.dataset.reminderAction;
        if (action === "whatsapp") {
          openReminderWhatsApp(reminder);
        } else {
          saveReminderAction(reminder, action);
        }
      });
    });
    article.append(actions);
  } else if (mode === "history") {
    const reopen = document.createElement("button");
    reopen.className = "secondary-button";
    reopen.type = "button";
    reopen.textContent = "Reabrir";
    reopen.addEventListener("click", () => {
      reminderActions = reminderActions.filter((item) => item.id !== reminder.id);
      saveClinicState("reminder-actions", reminderActions);
      renderAll();
    });
    article.append(reopen);
  }

  return article;
}

function renderAutomations() {
  const pendingList = $("#reminders-pending-list");
  const historyList = $("#reminders-history-list");
  if (!pendingList || !historyList) {
    return;
  }
  const queue = buildReminderQueue();
  const history = buildReminderHistory();
  const today = todayIso();
  const todayCount = queue.filter((item) => item.sendAt.slice(0, 10) === today).length;
  const dueCount = dueReminderQueue().length;
  const metricCount = dueCount || todayCount || queue.length;
  const metricLabel = dueCount
    ? "Vencidos por preparar"
    : todayCount
      ? (todayCount === 1 ? "Programado para hoy" : "Programados para hoy")
      : queue.length
        ? "Pendientes proximos"
        : "Sin pendientes";

  $("#reminders-today").textContent = todayCount;
  $("#reminders-pending-total").textContent = queue.length;
  $("#reminders-mode-label").textContent = reminderSettings.autoWhatsapp ? "Automatico" : "Manual";
  $("#auto-whatsapp-reminders").checked = Boolean(reminderSettings.autoWhatsapp);
  $("#metric-reminders").textContent = metricCount;
  $("#metric-reminders-label").textContent = metricLabel;
  $("#prepare-due-whatsapp").disabled = !dueCount;
  $("#automation-status").textContent = dueCount
    ? `${dueCount} recordatorio(s) vencido(s) pendientes de preparar por WhatsApp.`
    : "Los mensajes se abren en WhatsApp con el texto preparado para confirmar el envio.";

  pendingList.innerHTML = "";
  queue.forEach((reminder) => pendingList.append(renderReminderCard(reminder, "pending")));
  if (!queue.length) {
    pendingList.innerHTML = `<article class="compact-item"><span>No hay recordatorios pendientes. Crea una cita confirmada con telefono de paciente.</span></article>`;
  }

  historyList.innerHTML = "";
  history.forEach((reminder) => historyList.append(renderReminderCard(reminder, "history")));
  if (!history.length) {
    historyList.innerHTML = `<article class="compact-item"><span>Sin historial de recordatorios todavia.</span></article>`;
  }

  if (reminderSettings.autoWhatsapp && dueCount) {
    window.setTimeout(() => runDueWhatsAppReminders(true), 0);
  }
}

function renderMetrics() {
  const visible = visibleAppointments();
  const revenueAppointments = visible.filter((item) => ["confirmed", "completed"].includes(item.status));
  const revenue = revenueAppointments.reduce((total, item) => total + servicePrice(item), 0);
  $("#metric-appointments").textContent = visible.length;
  $("#metric-occupancy").textContent = `${Math.round((visible.length / 24) * 100)}%`;
  $("#metric-revenue").textContent = `${revenue} EUR`;
  if ($("#metric-reminders")) {
    const queue = buildReminderQueue();
    const dueCount = dueReminderQueue().length;
    const todayCount = queue.filter((item) => item.sendAt.slice(0, 10) === todayIso()).length;
    $("#metric-reminders").textContent = dueCount || todayCount || queue.length;
    $("#metric-reminders-label").textContent = dueCount
      ? "Vencidos por preparar"
      : todayCount
        ? (todayCount === 1 ? "Programado para hoy" : "Programados para hoy")
        : queue.length
          ? "Pendientes proximos"
          : "Sin pendientes";
  }
}



function renderSaasSettings() {
  const account = currentClinicAccount();
  const plan = saasPlanById(account.paymentPlan);
  const status = account.subscriptionStatus || account.billingStatus || "trialing";
  const statusCard = $("#saas-status-card");
  const billingForm = $("#saas-billing-form");
  if (!statusCard || !billingForm) {
    return;
  }

  statusCard.innerHTML = `
    <div>
      <strong>${plan.name}</strong>
      <span>${subscriptionStatusLabel(status)}</span>
    </div>
    <div>
      <strong>${plan.price} EUR</strong>
      <span>${plan.interval}</span>
    </div>
  `;

  const options = $("#settings-plan-options");
  if (options) {
    options.innerHTML = saasPlans.map((item) => `
      <label class="plan-option ${item.id === account.paymentPlan ? "selected" : ""}">
        <input name="settingsPaymentPlan" type="radio" value="${item.id}" ${item.id === account.paymentPlan ? "checked" : ""} />
        <strong>${item.name}</strong>
        <span>${item.summary}</span>
        <small>${item.price ? `${item.price} EUR/${item.interval}` : "0 EUR"}</small>
      </label>
    `).join("");
    $$('input[name="settingsPaymentPlan"]').forEach((input) => {
      input.addEventListener("change", () => {
        clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
          item.key === activeClinicKey
            ? {
                ...item,
                paymentPlan: input.value,
                subscriptionStatus: input.value === "trial" ? "trialing" : "incomplete",
                billingStatus: input.value === "trial" ? "trial" : "pending_stripe"
              }
            : item
        )));
        saveClinicAccounts();
        renderSaasSettings();
      });
    });
  }

  billingForm.elements.billingName.value = account.billingProfile?.billingName || clinic.name || "";
  billingForm.elements.taxId.value = account.billingProfile?.taxId || "";
  billingForm.elements.billingEmail.value = account.billingProfile?.billingEmail || clinic.email || "";
  billingForm.elements.billingAddress.value = account.billingProfile?.billingAddress || "";
}


function setupSaasSettings() {
  $("#saas-billing-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const billingProfile = {
      billingName: form.elements.billingName.value.trim(),
      taxId: form.elements.taxId.value.trim(),
      billingEmail: form.elements.billingEmail.value.trim(),
      billingAddress: form.elements.billingAddress.value.trim()
    };
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey ? { ...account, billingProfile } : account
    )));
    clinic = {
      ...clinic,
      billingName: billingProfile.billingName,
      taxId: billingProfile.taxId,
      billingEmail: billingProfile.billingEmail,
      billingAddress: billingProfile.billingAddress
    };
    saveClinicAccounts();
    saveClinicState("clinic", clinic);
    $("#saas-save-status").textContent = "Datos fiscales guardados.";
    renderSaasSettings();
  });

  $("#start-subscription")?.addEventListener("click", () => {
    const account = currentClinicAccount();
    const selectedPlan = account.paymentPlan === "trial" ? "kliniaplan" : account.paymentPlan;
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
      item.key === activeClinicKey
        ? {
            ...item,
            paymentPlan: selectedPlan,
            subscriptionStatus: "pending_stripe",
            billingStatus: "pending_stripe",
            checkoutUrl: `https://checkout.stripe.com/demo/${item.key}?plan=${selectedPlan}`
          }
        : item
    )));
    saveClinicAccounts();
    $("#saas-save-status").textContent = "Checkout preparado. Con STRIPE_SECRET_KEY se abrira Stripe real desde el backend.";
    renderSaasSettings();
  });

  $("#open-billing-portal")?.addEventListener("click", () => {
    const account = currentClinicAccount();
    $("#saas-save-status").textContent = account.stripeCustomerId
      ? "Portal de pagos preparado para este cliente."
      : "Portal disponible cuando exista cliente Stripe.";
  });
}


function renderCommercialSettings() {
  const consentList = $("#settings-consents");
  const packList = $("#settings-packs");
  if (consentList) {
    consentList.innerHTML = consentTemplates.length
      ? consentTemplates.map((item) => `
        <article class="compact-item action-card">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(excerptText(item.body || "Plantilla de consentimiento del centro."))}</span>
          </div>
          <details class="item-menu">
            <summary aria-label="Opciones de ${escapeHtml(item.name)}">...</summary>
            <div class="item-menu-popover">
              <button type="button" data-edit-consent="${item.id}">Editar</button>
              <button class="danger-menu-action" type="button" data-delete-consent="${item.id}">Eliminar</button>
            </div>
          </details>
        </article>
      `).join("")
      : `<article class="compact-item"><span>Sin consentimientos creados.</span></article>`;
  }
  if (packList) {
    packList.innerHTML = sessionPacks.length
      ? sessionPacks.map((item) => `
        <article class="compact-item action-card">
          <div>
            <strong>${item.name}</strong>
            <span>${item.sessions} sesiones - ${item.price} EUR - ${packServiceLabel(item)} ${item.invoice ? "- Facturable" : ""}</span>
          </div>
          <details class="item-menu">
            <summary aria-label="Opciones de ${item.name}">...</summary>
            <div class="item-menu-popover">
              <button type="button" data-edit-pack="${item.id}">Editar</button>
              <button class="danger-menu-action" type="button" data-delete-pack="${item.id}">Eliminar</button>
            </div>
          </details>
        </article>
      `).join("")
      : `<article class="compact-item"><span>Sin bonos creados.</span></article>`;
  }

  $$('[data-edit-consent]').forEach((button) => button.addEventListener('click', () => editConsentTemplate(button.dataset.editConsent)));
  $$('[data-delete-consent]').forEach((button) => button.addEventListener('click', () => deleteConsentTemplate(button.dataset.deleteConsent)));
  $$('[data-edit-pack]').forEach((button) => button.addEventListener('click', () => editSessionPack(button.dataset.editPack)));
  $$('[data-delete-pack]').forEach((button) => button.addEventListener('click', () => deleteSessionPack(button.dataset.deletePack)));
}

function openConsentTemplateDialog(existing = null) {
  const dialog = $("#consent-template-dialog");
  const form = $("#consent-template-form");
  if (!dialog || !form) return;
  form.dataset.editingConsentId = existing?.id || "";
  form.elements.name.value = existing?.name || "";
  form.elements.body.value = existing?.body || "Autorizo el tratamiento fisioterapeutico y el uso de mis datos segun la politica del centro.";
  $("#consent-template-dialog-title").textContent = existing ? "Editar consentimiento" : "Crear consentimiento";
  $("#consent-template-error").classList.remove("visible");
  $("#consent-template-error").textContent = "";
  dialog.showModal();
}

function upsertConsentTemplate(existing = null) {
  openConsentTemplateDialog(existing);
}

function editConsentTemplate(id) {
  const template = byId(consentTemplates, id);
  if (template) upsertConsentTemplate(template);
}

function deleteConsentTemplate(id) {
  const template = byId(consentTemplates, id);
  if (!template) return;
  const dialog = $("#consent-delete-dialog");
  const form = $("#consent-delete-form");
  if (!dialog || !form) return;
  const used = patientConsents.some((item) => item.templateId === id);
  form.dataset.deleteConsentId = id;
  $("#consent-delete-message").textContent = `Vas a eliminar la plantilla "${template.name}".`;
  $("#consent-delete-help").textContent = used
    ? "Ya esta asignada a pacientes. Los consentimientos firmados se mantienen con su documento y firma propios."
    : "Esta plantilla dejara de aparecer al crear nuevos consentimientos.";
  dialog.showModal();
}

function confirmConsentTemplateDeletion(id) {
  const template = byId(consentTemplates, id);
  if (!template) return;
  consentTemplates = consentTemplates.filter((item) => item.id !== id);
  saveClinicState("consent-templates", consentTemplates);
  $("#consent-delete-dialog")?.close();
  renderCommercialSettings();
  renderPatientDetail();
}

function openSessionPackDialog(existing = null) {
  const dialog = $("#session-pack-dialog");
  const form = $("#session-pack-form");
  if (!dialog || !form) return;
  form.reset();
  form.dataset.editingPackId = existing?.id || "";
  form.elements.name.value = existing?.name || "Bono 10 sesiones";
  form.elements.sessions.value = existing?.sessions || 10;
  form.elements.price.value = existing?.price || 400;
  fillPackServiceOptions(form.elements.serviceId, existing?.serviceId || "");
  form.elements.invoice.checked = existing?.invoice !== false;
  $("#session-pack-dialog-title").textContent = existing ? "Editar bono" : "Crear bono";
  $("#session-pack-error").classList.remove("visible");
  $("#session-pack-error").textContent = "";
  dialog.showModal();
}

function upsertSessionPack(existing = null) {
  openSessionPackDialog(existing);
}

function editSessionPack(id) {
  const pack = byId(sessionPacks, id);
  if (pack) upsertSessionPack(pack);
}

function deleteSessionPack(id) {
  const pack = byId(sessionPacks, id);
  if (!pack) return;
  const dialog = $("#session-pack-delete-dialog");
  const form = $("#session-pack-delete-form");
  if (!dialog || !form) return;
  const used = patientPacks.some((item) => item.packId === id);
  form.dataset.deletePackId = id;
  $("#session-pack-delete-message").textContent = `Vas a eliminar el bono "${pack.name}".`;
  $("#session-pack-delete-help").textContent = used
    ? "Ya esta asignado a pacientes. Los bonos asignados se mantienen en sus fichas."
    : "Dejara de estar disponible para nuevas asignaciones.";
  dialog.showModal();
}

function confirmSessionPackDeletion(id) {
  const pack = byId(sessionPacks, id);
  if (!pack) return;
  sessionPacks = sessionPacks.filter((item) => item.id !== id);
  saveClinicState("session-packs", sessionPacks);
  $("#session-pack-delete-dialog")?.close();
  renderCommercialSettings();
  renderPatientDetail();
}

function setupCommercialSettings() {
  $("#new-consent-template")?.addEventListener("click", () => upsertConsentTemplate());
  $("#consent-template-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    const body = form.elements.body.value.trim();
    if (!name || !body) {
      $("#consent-template-error").textContent = "Completa titulo y texto del consentimiento.";
      $("#consent-template-error").classList.add("visible");
      return;
    }
    const editingId = form.dataset.editingConsentId;
    const next = {
      id: editingId || `consent-${Date.now()}`,
      name,
      body,
      updatedAt: new Date().toISOString()
    };
    consentTemplates = editingId
      ? consentTemplates.map((item) => item.id === editingId ? { ...item, ...next } : item)
      : [...consentTemplates, { ...next, createdAt: new Date().toISOString() }];
    saveClinicState("consent-templates", consentTemplates);
    $("#consent-template-dialog").close();
    renderCommercialSettings();
    renderPatientDetail();
  });
  $("#consent-delete-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmConsentTemplateDeletion(event.currentTarget.dataset.deleteConsentId);
  });
  $("#new-session-pack")?.addEventListener("click", () => upsertSessionPack());
  $("#session-pack-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    const sessions = Math.max(1, Number(form.elements.sessions.value || 1));
    const price = Math.max(0, Number(form.elements.price.value || 0));
    if (!name) {
      $("#session-pack-error").textContent = "El nombre del bono es obligatorio.";
      $("#session-pack-error").classList.add("visible");
      return;
    }
    const editingPackId = form.dataset.editingPackId || "";
    const next = {
      id: editingPackId || `pack-${Date.now()}`,
      name,
      sessions,
      price,
      serviceId: form.elements.serviceId.value || "",
      invoice: form.elements.invoice.checked
    };
    sessionPacks = editingPackId
      ? sessionPacks.map((item) => item.id === editingPackId ? next : item)
      : [...sessionPacks, next];
    saveClinicState("session-packs", sessionPacks);
    $("#session-pack-dialog").close();
    renderCommercialSettings();
    renderPatientDetail();
  });
  $("#session-pack-delete-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmSessionPackDeletion(event.currentTarget.dataset.deletePackId);
  });
  $("#clinic-logo-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      clinicLogo = reader.result;
      saveClinicState("clinic-logo", clinicLogo);
      renderCommercialSettings();
    });
    reader.readAsDataURL(file);
  });
}



function kliniaLocalStorageSnapshot() {
  const data = {};
  Object.keys(localStorage)
    .filter((key) => key.startsWith("klinia:") || key.startsWith("clinicaflow:"))
    .sort()
    .forEach((key) => {
      data[key] = localStorage.getItem(key);
    });
  return {
    product: "Klinia",
    version: "local-backup-v1",
    exportedAt: new Date().toISOString(),
    activeClinicKey,
    clinicName: clinic?.name || "Klinia",
    origin: window.location.origin,
    data
  };
}

function downloadTextFile(filename, content, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportClinicBackup() {
  const snapshot = kliniaLocalStorageSnapshot();
  const safeClinic = slugifyClinicName(snapshot.clinicName || "klinia");
  const date = new Date().toISOString().slice(0, 10);
  downloadTextFile(`klinia-backup-${safeClinic}-${date}.json`, JSON.stringify(snapshot, null, 2));
  const status = $("#backup-status");
  if (status) {
    status.textContent = "Copia exportada. Guarda el archivo fuera del navegador.";
  }
}

function importClinicBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const snapshot = JSON.parse(String(reader.result || "{}"));
      if (snapshot.product !== "Klinia" || !snapshot.data || typeof snapshot.data !== "object") {
        throw new Error("Archivo de copia no valido.");
      }
      const totalKeys = Object.keys(snapshot.data).length;
      if (!window.confirm(`Vas a restaurar una copia de Klinia con ${totalKeys} claves. Se sobrescribiran los datos locales actuales. Continuar?`)) {
        return;
      }
      Object.entries(snapshot.data).forEach(([key, value]) => {
        if ((key.startsWith("klinia:") || key.startsWith("clinicaflow:")) && typeof value === "string") {
          localStorage.setItem(key, value);
        }
      });
      alert("Copia restaurada. La aplicacion se recargara ahora.");
      window.location.reload();
    } catch (error) {
      alert(`No se pudo importar la copia: ${error.message}`);
    }
  });
  reader.readAsText(file);
}

function setupDataSafety() {
  $("#export-clinic-backup")?.addEventListener("click", exportClinicBackup);
  $("#import-clinic-backup")?.addEventListener("change", (event) => {
    importClinicBackupFile(event.target.files?.[0]);
    event.target.value = "";
  });
}

function renderAll() {
  $("#calendar-date").value = selectedDate;
  $$(".calendar-mode").forEach((button) => {
    button.classList.toggle("selected", button.dataset.mode === calendarMode);
  });
  renderMetrics();
  renderSchedule();
  renderNextList();
  renderPatients();
  renderPatientDetail();
  renderTeam();
  renderSettings();
  renderSaasSettings();
  renderCommercialSettings();
  renderServices();
  renderStats();
  renderBilling();
  renderPerformance();
  renderAutomations();
  renderPermissions();
}

function permissionRowHtml(id, title, selectedSections) {
  const selected = new Set(selectedSections || []);
  return `
    <article class="permission-row" data-permission-row="${id}">
      <div>
        <strong>${title}</strong>
        <span>${selected.size} secciones activas</span>
      </div>
      <div class="permission-options">
        ${permissionSections.map((section) => `
          <label class="check-row permission-check">
            <input type="checkbox" value="${section}" ${selected.has(section) ? "checked" : ""} data-permission-target="${id}" />
            ${permissionLabels[section]}
          </label>
        `).join("")}
      </div>
    </article>
  `;
}

function renderPermissions() {
  const list = $("#permissions-list");
  if (!list) {
    return;
  }
  list.innerHTML = [
    permissionRowHtml("staff", "Utilidades / recepcion", permissionSettings.staff),
    ...practitioners.map((practitioner) => permissionRowHtml(
      `practitioner:${practitioner.id}`,
      practitioner.name,
      permissionSettings.practitioners?.[practitioner.id] || defaultPractitionerPermissions()
    ))
  ].join("");

  $$("[data-permission-target]").forEach((input) => {
    input.addEventListener("change", () => {
      const target = input.dataset.permissionTarget;
      const checkedSections = $$(`[data-permission-target="${target}"]:checked`).map((item) => item.value);
      if (target === "staff") {
        permissionSettings = { ...permissionSettings, staff: checkedSections };
      } else {
        const practitionerId = target.replace("practitioner:", "");
        permissionSettings = {
          ...permissionSettings,
          practitioners: { ...(permissionSettings.practitioners || {}), [practitionerId]: checkedSections }
        };
      }
      saveClinicState("permissions", permissionSettings);
      renderPermissions();
      applyRolePermissions();
    });
  });
}

async function hydrateFromApi() {
  if (!apiEnabled || !isDemoClinic()) {
    return;
  }

  return;

  try {
    const [apiPatients, apiServices, apiAppointments] = await Promise.all([
      apiRequest("/api/patients"),
      apiRequest("/api/services"),
      apiRequest("/api/appointments")
    ]);
    patients = mergeById(apiPatients.map(apiPatientToUi), defaultPatients);
    services = mergeById(apiServices.map(apiServiceToUi), defaultServices);
    appointments = apiAppointments.length
      ? normalizeAppointments(mergeById(apiAppointments.map(apiAppointmentToUi), defaultAppointments))
      : defaultAppointments;
    selectedPatientId = patients[0]?.id || null;
    saveClinicState("patients", patients);
    saveClinicState("services", services);
    saveClinicState("appointments", appointments);
    renderAppointmentFormOptions();
    renderAll();
  } catch (error) {
    console.warn("Klinia API demo unavailable, using local data.", error);
  }
}

function setupNavigation() {
  $("#reminders-metric-card")?.addEventListener("click", () => setActiveSection("automatizaciones"));
  $("#reminders-metric-card")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveSection("automatizaciones");
    }
  });
  $("#recalculate-reminders")?.addEventListener("click", () => renderAutomations());
  $("#prepare-due-whatsapp")?.addEventListener("click", () => runDueWhatsAppReminders(true));
  $("#auto-whatsapp-reminders")?.addEventListener("change", (event) => {
    reminderSettings = { ...reminderSettings, autoWhatsapp: event.target.checked };
    saveClinicState("reminder-settings", reminderSettings);
    renderAutomations();
    if (reminderSettings.autoWhatsapp) {
      runDueWhatsAppReminders(true);
    }
  });
  window.setInterval(() => {
    if (reminderSettings.autoWhatsapp) {
      runDueWhatsAppReminders(true);
    }
  }, 60000);
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setActiveSection(button.dataset.section));
  });
}

function setActiveSection(section, persist = true) {
  if (!visibleSectionIds.includes(section)) {
    section = "agenda";
  }
  const button = $(`.nav-item[data-section='${section}']`);
  const panel = $(`#${section}`);
  if (!button || !panel || button.classList.contains("hidden")) {
    return false;
  }
  $$(".nav-item").forEach((item) => item.classList.remove("active"));
  $$(".content-section").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  panel.classList.add("active");
  $("#section-title").textContent = sectionTitles[section] || "Agenda";
  document.body.dataset.activeSection = section;
  activeSection = section;
  if (persist) {
    saveState("active-section", activeSection);
  }
  return true;
}

function renderSession() {
  $("#session-select").value = isPractitionerSession() ? currentSession.practitionerId : currentSession.role;
  $$("#filter-practitioner input").forEach((input) => {
    input.disabled = isPractitionerSession();
  });
  $("#worker-profile-select").disabled = !canViewDirectionReports();
  $("#owner-mode-button").disabled = !canViewDirectionReports();
  $$(".new-service-button").forEach((button) => {
    button.disabled = !canManageClinic();
  });
  $("#new-patient").disabled = !canManageOperations();
  $("#new-appointment").disabled = false;
  document.body.classList.toggle("availability-only-settings", isAvailabilityOnlySettingsSession());

  if (isPractitionerSession()) {
    selectedPractitionerIds = [currentSession.practitionerId];
    saveState("selected-practitioner-ids", selectedPractitionerIds);
    $("#worker-profile-select").value = currentSession.practitionerId;
    $$(".performance-mode").forEach((item) => item.classList.remove("selected"));
    $(".performance-mode[data-mode='worker']").classList.add("selected");
    $("#worker-performance").classList.remove("hidden");
    $("#owner-performance").classList.add("hidden");
    $("#worker-filter-wrap").classList.add("hidden");
  } else {
    $("#worker-filter-wrap").classList.remove("hidden");
  }

  applyRolePermissions();
}

function applyLoginState() {
  document.body.classList.toggle("login-mode", !isAuthenticated);
}

function applyRolePermissions() {
  const allowedSections = permissionsForCurrentSession();

  $$(".nav-item").forEach((button) => {
    button.classList.toggle("hidden", !canAccessSection(button.dataset.section));
  });

  const activeHidden = !canAccessSection($(".nav-item.active")?.dataset.section);
  if (activeHidden) {
    const fallback = canAccessSection(activeSection)
      ? activeSection
      : allowedSections.includes("disponibilidad")
        ? "configuracion"
        : allowedSections[0] || "agenda";
    setActiveSection(fallback, false);
  }
}

function currentSessionName() {
  if (isOwner()) {
    return "Direccion";
  }
  if (isStaff()) {
    return "Recepcion";
  }
  return currentPractitioner()?.name || "Trabajador";
}

function setupSession() {
  $("#session-select").disabled = true;
}

function setSessionFromProfile(value) {
  currentSession = value === "owner"
    ? { role: "owner", practitionerId: null }
    : value === "staff"
      ? { role: "staff", practitionerId: null }
      : { role: "practitioner", practitionerId: value };
  saveState("session", currentSession);
}

function enterPlatform(profile, clinicKey = demoClinicKey) {
  setSessionFromProfile(profile);
  loadActiveClinicData(clinicKey);
  pendingClinicKey = null;
  isAuthenticated = true;
  saveState("authenticated", true);
  saveState("authenticated-at", Date.now());
  applyLoginState();
  renderFilters();
  renderAppointmentFormOptions();
  renderSession();
  setActiveSection(activeSection, false);
  renderAll();
  hydrateFromApi();
}

function updateRegisterPlanChoice() {
  const form = $("#register-form");
  if (!form) return;
  const plan = saasPlanById(form.elements.paymentPlan?.value || "trial");
  $$("#register-form .plan-option").forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("selected", input?.checked);
  });
  const summary = $("#register-payment-summary");
  if (summary) {
    summary.textContent = plan.summary;
  }
}

function setupLogin() {
  renderLoginClinics();
  showClinicLoginStep();

  $("#login-clinic-select").addEventListener("change", renderLoginProfiles);
  $("#login-clinic-select").addEventListener("input", renderLoginProfiles);

  $("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const account = clinicAccountByLogin(form.elements.center.value);
    if (!account) {
      form.elements.center.setCustomValidity("No encuentro esa clinica. Escribe el nombre o el email registrado.");
      form.reportValidity();
      form.elements.center.setCustomValidity("");
      return;
    }
    const password = form.elements.password.value;
    if (password !== account.password) {
      form.elements.password.setCustomValidity("Contrasena incorrecta para esta clinica.");
      form.reportValidity();
      form.elements.password.setCustomValidity("");
      return;
    }
    showProfileLoginStep(account.key);
  });

  $("#profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const account = clinicAccountByKey(pendingClinicKey || demoClinicKey);
    const profile = form.elements.profile.value;
    const loginPractitioners = normalizePractitioners(loadClinicStateFor(account.key, "practitioners", account.key === demoClinicKey ? defaultPractitioners : []));
    const practitioner = byId(loginPractitioners, profile);
    const expectedPassword = profile === "owner"
      ? account.password
      : profile === "staff"
        ? (account.staffPassword || account.password)
        : practitioner?.password || "demo";
    if (form.elements.password.value !== expectedPassword) {
      form.elements.password.setCustomValidity("Contrasena incorrecta para este perfil.");
      form.reportValidity();
      form.elements.password.setCustomValidity("");
      return;
    }
    enterPlatform(profile, account.key);
  });

  $("#back-to-clinic-login").addEventListener("click", () => {
    showClinicLoginStep();
  });

  $("#demo-login").addEventListener("click", () => {
    $("#login-clinic-select").value = defaultClinicAccount.name;
    $("#login-form").elements.password.value = defaultClinicAccount.password;
    renderLoginProfiles();
    showProfileLoginStep(demoClinicKey);
  });

  $("#open-register").addEventListener("click", () => {
    $("#register-error").classList.remove("visible");
    $("#register-error").textContent = "";
    updateRegisterPlanChoice();
    $("#register-dialog").showModal();
  });

  $$('input[name="paymentPlan"]').forEach((input) => {
    input.addEventListener("change", updateRegisterPlanChoice);
  });

  $("#register-google").addEventListener("click", () => {
    const form = $("#register-form");
    const email = form.elements.email.value.trim();
    if (!email) {
      $("#register-error").textContent = "Escribe primero el email para preparar el acceso con Google.";
      $("#register-error").classList.add("visible");
      form.elements.email.focus();
      return;
    }
    const cleanEmail = email;
    const suggestedName = cleanEmail.split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    form.elements.email.value = cleanEmail;
    form.elements.billingEmail.value = cleanEmail;
    if (!form.elements.name.value.trim()) {
      form.elements.name.value = suggestedName ? `Clinica ${suggestedName}` : "Nueva clinica";
    }
    if (!form.elements.billingName.value.trim()) {
      form.elements.billingName.value = form.elements.name.value;
    }
    form.elements.password.value = "google-demo";
    $("#register-error").textContent = "Google preparado en modo local: para OAuth real falta conectar credenciales de Google Cloud y backend.";
    $("#register-error").classList.add("visible");
  });

  $("#register-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    const key = slugifyClinicName(name);
    if (clinicAccounts.some((account) => account.key === key)) {
      $("#register-error").textContent = "Ya existe una clinica con ese nombre. Entra desde el selector de clinicas.";
      $("#register-error").classList.add("visible");
      return;
    }

    const paymentPlan = form.elements.paymentPlan?.value || "trial";
    const billingProfile = {
      billingName: form.elements.billingName?.value.trim() || name,
      billingEmail: form.elements.billingEmail?.value.trim() || form.elements.email?.value.trim() || "",
      taxId: form.elements.taxId?.value.trim() || "",
      billingAddress: form.elements.billingAddress?.value.trim() || ""
    };
    const account = {
      key,
      name,
      ownerName: form.elements.ownerName?.value.trim() || "Direccion",
      email: form.elements.email?.value.trim() || "",
      phone: form.elements.phone?.value.trim() || "No indicado",
      password: form.elements.password.value,
      staffPassword: "demo",
      paymentPlan,
      billingStatus: paymentPlan === "trial" ? "trial" : "pending_stripe",
      subscriptionStatus: paymentPlan === "trial" ? "trialing" : "pending_stripe",
      trialEndsAt: paymentPlan === "trial" ? addDaysIso(todayIso(), 30) : "",
      checkoutUrl: paymentPlan === "trial" ? "" : `https://checkout.stripe.com/demo/${key}?plan=${paymentPlan}`,
      billingProfile
    };
    clinicAccounts = normalizeClinicAccounts([...clinicAccounts, account]);
    saveClinicAccounts();

    activeClinicKey = key;
    saveClinicState("clinic", {
      name: account.name,
      email: account.email,
      phone: account.phone,
      billingName: billingProfile.billingName,
      billingEmail: billingProfile.billingEmail,
      taxId: billingProfile.taxId,
      billingAddress: billingProfile.billingAddress
    });
    saveClinicState("patients", []);
    saveClinicState("appointments", []);
    saveClinicState("clinical-notes", []);
    saveClinicState("services", []);
    saveClinicState("practitioners", []);
    saveClinicState("rooms", []);
    saveClinicState("groups", []);
    saveClinicState("availability-blocks", []);
    saveClinicState("permissions", defaultPermissionSettings);
    saveClinicState("group-dropins", []);
    saveClinicState("group-completions", []);
    saveClinicState("reminder-actions", []);
    saveClinicState("reminder-settings", { autoWhatsapp: false });

    renderLoginClinics();
    $("#login-clinic-select").value = account.name;
    renderLoginProfiles();
    $("#login-form").elements.password.value = account.password;
    $("#profile-form").elements.password.value = account.password;
    form.reset();
    form.elements.password.value = "demo";
    updateRegisterPlanChoice();
    $("#register-dialog").close();
    enterPlatform("owner", key);
  });

  $("#logout-button").addEventListener("click", () => {
    isAuthenticated = false;
    saveState("authenticated", false);
    saveState("authenticated-at", 0);
    showClinicLoginStep();
    applyLoginState();
  });
}

function setupDialogCloseButtons() {
  $$(".dialog-close").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.dialogId);
      if (dialog?.open) {
        dialog.close();
      }
    });
  });
}

function clearFormError(errorSelector) {
  const error = $(errorSelector);
  if (!error) {
    return;
  }
  error.classList.remove("visible");
  error.textContent = "";
}

function setupFormErrorClearing(formSelector, errorSelector) {
  const form = $(formSelector);
  if (!form) {
    return;
  }
  ["input", "change"].forEach((eventName) => {
    form.addEventListener(eventName, () => clearFormError(errorSelector));
  });
}

function addMonthsIso(value, amount) {
  const date = dateOnly(value);
  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + amount);
  if (date.getDate() < originalDay) {
    date.setDate(0);
  }
  return toIsoDate(date);
}

function nextRecurrenceDate(value, frequency) {
  if (frequency === "monthly") {
    return addMonthsIso(value, 1);
  }
  return addDaysIso(value, frequency === "biweekly" ? 14 : 7);
}

function buildAppointmentCandidates(candidate, form) {
  const repeatEnabled = Boolean(form.elements.repeatEnabled?.checked || form.elements.repeatWeekly?.checked);
  if (!repeatEnabled) {
    return [candidate];
  }
  const frequency = form.elements.repeatFrequency?.value || "weekly";
  const endDate = form.elements.repeatEndDate?.value || addDaysIso(candidate.date, 21);
  const recurrenceId = candidate.recurrenceId || `rec-${Date.now()}`;
  const baseId = Date.now();
  const items = [];
  for (let cursor = candidate.date; cursor <= endDate && items.length < 80; cursor = nextRecurrenceDate(cursor, frequency)) {
    items.push({
      ...candidate,
      id: items.length ? `local-${baseId}-${items.length}` : candidate.id,
      date: cursor,
      recurrenceId,
      recurrenceFrequency: frequency,
      recurrenceStartDate: candidate.date,
      recurrenceEndDate: endDate
    });
  }
  return items;
}

function appointmentConflictDetails(candidate) {
  const service = byId(services, candidate.serviceId);
  const end = addMinutes(candidate.start, service?.duration || 60);
  const availabilityBlock = availabilityBlockFor(candidate.practitionerId, candidate.date, candidate.start, end);
  if (availabilityBlock) {
    return {
      type: "availability",
      item: candidate,
      label: `${candidate.date} ${candidate.start}: ${availabilityBlockLabel(availabilityBlock)}`
    };
  }
  const appointmentConflict = findConflict(candidate);
  if (appointmentConflict) {
    const patient = byId(patients, appointmentConflict.patientId)?.name || "otra cita";
    return {
      type: "appointment",
      item: candidate,
      label: `${candidate.date} ${candidate.start}: conflicto con ${patient} a las ${appointmentConflict.start}`
    };
  }
  const groupConflict = findGroupConflict(candidate);
  if (groupConflict) {
    return {
      type: "group",
      item: candidate,
      label: `${candidate.date} ${candidate.start}: bloqueado por ${groupConflict.name} a las ${groupConflict.start}`
    };
  }
  return null;
}

function resetRecurrenceReview() {
  pendingRecurringReview = null;
  const review = $("#appointment-recurrence-review");
  if (review) {
    review.classList.add("hidden");
    review.innerHTML = "";
  }
}

function renderRecurrenceReview(available, conflicts) {
  const review = $("#appointment-recurrence-review");
  if (!review) return;
  pendingRecurringReview = { available, conflicts };
  review.classList.remove("hidden");
  review.innerHTML = `
    <strong>Revision de citas recurrentes</strong>
    <span>${available.length} cita(s) disponibles y ${conflicts.length} conflicto(s).</span>
    <div class="recurrence-conflicts">
      ${conflicts.map((conflict) => `<span>${conflict.label}</span>`).join("")}
    </div>
    <button class="secondary-button" type="button" id="create-available-recurring" ${available.length ? "" : "disabled"}>Crear solo disponibles</button>
  `;
  $("#create-available-recurring")?.addEventListener("click", () => {
    const dialog = $("#appointment-dialog");
    const form = $("#appointment-form");
    if (!pendingRecurringReview?.available?.length) return;
    finishAppointmentCreation(pendingRecurringReview.available, dialog, form);
    resetRecurrenceReview();
  });
}

function finishAppointmentCreation(newAppointments, dialog = $("#appointment-dialog"), form = $("#appointment-form")) {
  const items = Array.isArray(newAppointments) ? newAppointments : [newAppointments];
  appointments = [...appointments, ...items];
  saveClinicState("appointments", appointments);
  selectedDate = items[0]?.date || selectedDate;
  saveState("selected-date", selectedDate);
  dialog.close();
  form.reset();
  form.elements.start.value = "12:00";
  if (form.elements.groupAttendees) {
    form.elements.groupAttendees.value = 1;
  }
  if (form.elements.patientPack) {
    form.elements.patientPack.value = "";
  }
  if (form.elements.repeatEnabled) {
    form.elements.repeatEnabled.checked = false;
    $("#appointment-repeat-options")?.classList.add("hidden");
  }
  if (form.elements.repeatWeekly) {
    form.elements.repeatWeekly.checked = false;
    if (form.elements.repeatCount) form.elements.repeatCount.value = 4;
  }
  if (form.elements.repeatEndDate) {
    form.elements.repeatEndDate.value = "";
  }
  $("#appointment-repeat-options")?.classList.add("hidden");
  updateAppointmentOutsideHoursWarning(form);
  resetRecurrenceReview();
  renderAll();
}

function openAppointmentDialog(defaults = {}) {
  const dialog = $("#appointment-dialog");
  const form = $("#appointment-form");
  form.reset();
  form.querySelector(".modal-header h2").textContent = "Nueva cita";
  renderAppointmentFormOptions();
  form.elements.date.value = defaults.date || selectedDate;
  form.elements.start.value = defaults.start || "12:00";
  form.elements.status.value = "confirmed";
  if (form.elements.groupAttendees) {
    form.elements.groupAttendees.value = 1;
  }
  if (form.elements.repeatEnabled) {
    form.elements.repeatEnabled.checked = false;
    $("#appointment-repeat-options")?.classList.add("hidden");
  }
  if (form.elements.repeatWeekly) {
    form.elements.repeatWeekly.checked = false;
    if (form.elements.repeatCount) form.elements.repeatCount.value = 4;
    $("#appointment-repeat-options")?.classList.add("hidden");
  }
  if (form.elements.repeatEndDate) {
    form.elements.repeatEndDate.value = addDaysIso(form.elements.date.value, 21);
  }
  if (defaults.practitionerId && byId(practitioners, defaults.practitionerId)) {
    form.elements.practitioner.value = defaults.practitionerId;
  }
  if (defaults.roomId && byId(rooms, defaults.roomId)) {
    form.elements.room.value = defaults.roomId;
  }
  updateAppointmentGroupAttendeesVisibility(form);
  updateAppointmentPackOptions(form);
  resetRecurrenceReview();
  $("#form-error").classList.remove("visible");
  $("#form-error").textContent = "";
  const missing = appointmentSetupMissing();
  if (missing.length) {
    $("#form-error").textContent = `Antes de crear citas configura: ${missing.join(", ")}. Puedes hacerlo en Configuracion.`;
    $("#form-error").classList.add("visible");
  }
  updateAppointmentOutsideHoursWarning(form);
  dialog.showModal();
}

function blockAgendaFromAppointmentForm() {
  const form = $("#appointment-form");
  const practitionerId = form.elements.practitioner.value || practitioners[0]?.id;
  const start = form.elements.start.value || "12:00";
  const service = byId(services, form.elements.service.value);
  $("#appointment-dialog").close();
  openUnavailabilityDialog({
    practitionerId,
    date: form.elements.date.value || selectedDate,
    start,
    end: addMinutes(start, service?.duration || 60),
    allDay: false
  });
}

function setupDialog() {
  const dialog = $("#appointment-dialog");
  const form = $("#appointment-form");
  renderAppointmentFormOptions();

  $("#new-appointment").addEventListener("click", () => {
    openAppointmentDialog();
  });

  form.elements.service.addEventListener("change", () => {
    updateAppointmentGroupAttendeesVisibility(form);
    updateAppointmentPackOptions(form);
    updateAppointmentOutsideHoursWarning(form);
    resetRecurrenceReview();
  });
  ["date", "start", "practitioner", "room", "patient"].forEach((fieldName) => {
    form.elements[fieldName]?.addEventListener("change", () => {
      if (fieldName === "date" && form.elements.repeatEndDate && (!form.elements.repeatEndDate.value || form.elements.repeatEndDate.value < form.elements.date.value)) {
        form.elements.repeatEndDate.value = addDaysIso(form.elements.date.value, 21);
      }
      updateAppointmentOutsideHoursWarning(form);
      if (fieldName === "patient" || fieldName === "service") {
        updateAppointmentPackOptions(form);
      }
      resetRecurrenceReview();
    });
    form.elements[fieldName]?.addEventListener("input", () => updateAppointmentOutsideHoursWarning(form));
  });
  form.elements.repeatEnabled?.addEventListener("change", () => {
    $("#appointment-repeat-options")?.classList.toggle("hidden", !form.elements.repeatEnabled.checked);
    resetRecurrenceReview();
  });
  ["repeatFrequency", "repeatEndDate"].forEach((fieldName) => {
    form.elements[fieldName]?.addEventListener("change", resetRecurrenceReview);
  });
  form.elements.repeatWeekly?.addEventListener("change", () => {
    $("#appointment-repeat-options")?.classList.toggle("hidden", !form.elements.repeatWeekly.checked);
    resetRecurrenceReview();
  });
  $("#appointment-block-agenda").addEventListener("click", blockAgendaFromAppointmentForm);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    $("#form-error").classList.remove("visible");
    $("#form-error").textContent = "";
    const candidate = {
      id: `local-${Date.now()}`,
      date: form.elements.date.value || selectedDate,
      patientId: form.elements.patient.value,
      practitionerId: form.elements.practitioner.value,
      roomId: form.elements.room.value,
      serviceId: form.elements.service.value,
      start: form.elements.start.value,
      status: form.elements.status.value,
      groupAttendees: Math.max(1, Number(form.elements.groupAttendees?.value || 1)),
      plannedPatientPackId: form.elements.patientPack?.value || "",
      internalNotes: "",
      createdBy: currentSessionName()
    };

    if (!candidate.patientId || !candidate.practitionerId || !candidate.roomId || !candidate.serviceId || !candidate.start) {
      $("#form-error").textContent = "Faltan datos para crear la cita.";
      $("#form-error").classList.add("visible");
      return;
    }

    const practitioner = byId(practitioners, candidate.practitionerId);
    const candidateService = byId(services, candidate.serviceId);
    const candidateEnd = addMinutes(candidate.start, candidateService?.duration || 60);
    const outsideHours = isOutsidePractitionerHours(practitioner, candidate.start, candidateEnd);
    if (outsideHours) {
      candidate.outsideHours = true;
      candidate.outsideHoursNotice = "Está creando una cita fuera de horario";
    }

    if ((form.elements.repeatEnabled?.checked || form.elements.repeatWeekly?.checked) && form.elements.repeatEndDate?.value < candidate.date) {
      $("#form-error").textContent = "La fecha fin de la recurrencia no puede ser anterior al inicio.";
      $("#form-error").classList.add("visible");
      return;
    }

    const candidates = buildAppointmentCandidates(candidate, form);
    const conflicts = candidates
      .map(appointmentConflictDetails)
      .filter(Boolean);
    if (conflicts.length) {
      const available = candidates.filter((item) => !conflicts.some((conflict) => conflict.item.id === item.id));
      if (candidates.length > 1) {
        renderRecurrenceReview(available, conflicts);
      } else {
        $("#form-error").textContent = conflicts[0].label;
        $("#form-error").classList.add("visible");
      }
      return;
    }

    if (apiEnabled && isDemoClinic() && candidates.length === 1 && candidate.serviceId && byId(services, candidate.serviceId)) {
      apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(uiAppointmentToApi(candidate))
      })
        .then((appointment) => finishAppointmentCreation(apiAppointmentToUi(appointment), dialog, form))
        .catch(() => finishAppointmentCreation(candidate, dialog, form));
      return;
    }

    finishAppointmentCreation(candidates, dialog, form);
  });
}

function openAppointmentDetail(appointmentId) {
  const appointment = byId(appointments, appointmentId);
  if (!appointment) {
    return;
  }

  selectedAppointmentId = appointmentId;
  const form = $("#appointment-detail-form");
  const service = byId(services, appointment.serviceId);
  const patient = byId(patients, appointment.patientId);
  $("#appointment-detail-title").textContent = `${patient?.name || "Paciente"} - ${appointment.start}`;
  $("#appointment-detail-data").innerHTML = `
    <dt>Paciente</dt>
    <dd><button class="link-button detail-link-button" type="button" id="open-appointment-patient">${patient?.name || "Paciente no encontrado"}</button></dd>
    <dt>Servicio</dt>
    <dd>${service?.name || "Servicio no encontrado"}</dd>
    <dt>Profesional</dt>
    <dd>${byId(practitioners, appointment.practitionerId)?.name || "Profesional"}</dd>
    <dt>Sala</dt>
    <dd>${byId(rooms, appointment.roomId)?.name || "Sala"}</dd>
    <dt>Tipo</dt>
    <dd>${serviceKindLabel(service)}</dd>
    <dt>Asistentes</dt>
    <dd>${service?.type === "group" ? (appointment.groupAttendees || 1) : 1}</dd>
    <dt>Importe</dt>
    <dd>${servicePrice(appointment)} EUR</dd>
    ${appointment.patientPackId ? `<dt>Bono aplicado</dt><dd>${byId(patientPacks, appointment.patientPackId)?.name || "Bono"}</dd>` : ""}
    ${!appointment.patientPackId && appointment.plannedPatientPackId ? `<dt>Bono previsto</dt><dd>${byId(patientPacks, appointment.plannedPatientPackId)?.name || "Bono"}</dd>` : ""}
    ${appointment.cancelledBy ? `<dt>Cancelada por</dt><dd>${appointment.cancelledBy}</dd>` : ""}
    ${appointment.cancelledAt ? `<dt>Fecha cancelacion</dt><dd>${new Date(appointment.cancelledAt).toLocaleString("es-ES")}</dd>` : ""}
    ${appointment.invoiceGenerated ? `<dt>Factura</dt><dd>${appointment.invoiceNumber || "Generada"}</dd>` : ""}
  `;
  $("#open-appointment-patient")?.addEventListener("click", () => {
    $("#appointment-detail-dialog")?.close();
    openPatientProfile(appointment.patientId);
  });
  form.elements.status.value = appointment.status;
  if (form.elements.cancelledBy) {
    form.elements.cancelledBy.value = appointment.cancelledBy || "";
  }
  form.querySelector(".cancelled-by-field")?.classList.toggle("hidden", appointment.status !== "cancelled");
  const packField = form.querySelector(".appointment-pack-field");
  const packSelect = form.elements.patientPack;
  if (packField && packSelect) {
    const selectedPackId = appointment.patientPackId || appointment.plannedPatientPackId || "";
    const availablePacks = patientPacksForAppointment(appointment);
    packSelect.innerHTML = "";
    packSelect.append(new Option("No usar bono", ""));
    availablePacks.forEach((pack) => packSelect.append(new Option(`${pack.name} - ${patientPackRemaining(pack)} disponibles`, pack.id)));
    if (selectedPackId && !availablePacks.some((pack) => pack.id === selectedPackId)) {
      const usedPack = byId(patientPacks, selectedPackId);
      if (usedPack) packSelect.append(new Option(`${usedPack.name} - ${appointment.patientPackId ? "aplicado" : "previsto"}`, usedPack.id));
    }
    packSelect.value = selectedPackId;
    packField.classList.toggle("hidden", packSelect.options.length <= 1 && !selectedPackId);
  }
  form.elements.internalNotes.value = appointment.internalNotes || "";
  $("#appointment-invoice-button").textContent = appointment.invoiceGenerated ? "Reimprimir factura" : "Generar factura";
  $("#appointment-detail-dialog").showModal();
}



function generateInvoiceForAppointment(appointment) {
  const patient = byId(patients, appointment.patientId);
  const practitioner = byId(practitioners, appointment.practitionerId);
  const service = byId(services, appointment.serviceId);
  const amount = servicePrice(appointment);
  const invoiceNumber = appointment.invoiceNumber || `KL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Factura ${invoiceNumber}</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#202621}header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #ddd;padding-bottom:18px}img{max-width:90px;max-height:90px}h1{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:28px}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:22px;font-weight:700;margin-top:24px}</style></head>
<body>
<header><div>${clinicLogo ? `<img src="${clinicLogo}" alt="Logo">` : ""}<h1>${clinic.name || "Klinia"}</h1><p>${clinic.email || ""}<br>${clinic.phone || ""}</p></div><div><strong>Factura ${invoiceNumber}</strong><p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p></div></header>
<section><h2>Paciente</h2><p>${patient?.name || "Paciente"}<br>${patient?.dni || ""}<br>${patient?.address || ""}</p></section>
<table><thead><tr><th>Fecha cita</th><th>Servicio</th><th>Profesional</th><th>Importe</th></tr></thead><tbody><tr><td>${appointment.date || selectedDate} ${appointment.start}</td><td>${service?.name || "Servicio"}</td><td>${practitioner?.name || "Profesional"}</td><td>${amount} EUR</td></tr></tbody></table>
<p class="total">Total: ${amount} EUR</p>
</body></html>`;
  downloadTextFile(`factura-${invoiceNumber}.html`, html, "text/html");
  appointments = appointments.map((item) => item.id === appointment.id ? { ...item, invoiceGenerated: true, invoiceGeneratedAt: new Date().toISOString(), invoiceNumber } : item);
  saveClinicState("appointments", appointments);
  openAppointmentDetail(appointment.id);
}

function setupAppointmentDetail() {
  $("#appointment-detail-form")?.elements.status?.addEventListener("change", (event) => {
    $("#appointment-detail-form")?.querySelector(".cancelled-by-field")?.classList.toggle("hidden", event.target.value !== "cancelled");
    if (event.target.value === "cancelled" && $("#appointment-detail-form")?.elements.cancelledBy && !$("#appointment-detail-form").elements.cancelledBy.value.trim()) {
      $("#appointment-detail-form").elements.cancelledBy.value = currentSessionName();
    }
  });
  $("#appointment-invoice-button")?.addEventListener("click", () => {
    const appointment = byId(appointments, selectedAppointmentId);
    if (!appointment) return;
    generateInvoiceForAppointment(appointment);
  });
  $("#appointment-detail-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const finalStatusIsCancelled = form.elements.status.value === "cancelled";
    const existingAppointment = byId(appointments, selectedAppointmentId);
    const selectedPackId = form.elements.patientPack?.value || "";
    let nextPatientPackId = existingAppointment?.patientPackId || "";
    let nextPlannedPatientPackId = existingAppointment?.plannedPatientPackId || "";
    let restoredExistingPack = false;
    if (existingAppointment?.patientPackId && existingAppointment.patientPackId !== selectedPackId) {
      restorePatientPackUse(existingAppointment.patientPackId);
      nextPatientPackId = "";
      restoredExistingPack = true;
    }
    if (form.elements.status.value === "completed" && selectedPackId && existingAppointment?.patientPackId !== selectedPackId) {
      usePatientPackForAppointment(existingAppointment, selectedPackId);
      nextPatientPackId = selectedPackId;
      nextPlannedPatientPackId = "";
    }
    if (form.elements.status.value !== "completed" && existingAppointment?.patientPackId && !restoredExistingPack) {
      restorePatientPackUse(existingAppointment.patientPackId);
      nextPatientPackId = "";
    }
    if (form.elements.status.value !== "completed") {
      nextPlannedPatientPackId = selectedPackId;
    }
    const cancelledBy = finalStatusIsCancelled
      ? (form.elements.cancelledBy?.value.trim() || currentSessionName())
      : "";
    const payload = {
      status: form.elements.status.value,
      internal_notes: form.elements.internalNotes.value.trim() || null
    };

    const finish = (updatedAppointment) => {
      appointments = appointments.map((appointment) => {
        if (appointment.id !== selectedAppointmentId) {
          return appointment;
        }
        return updatedAppointment;
      });
      saveClinicState("appointments", appointments);
      $("#appointment-detail-dialog").close();
      renderAll();
    };

    const localUpdate = {
      ...existingAppointment,
      status: form.elements.status.value,
      internalNotes: form.elements.internalNotes.value.trim(),
      patientPackId: nextPatientPackId,
      plannedPatientPackId: nextPlannedPatientPackId,
      patientPackUsedAt: nextPatientPackId ? (existingAppointment?.patientPackUsedAt || new Date().toISOString()) : "",
      cancelledBy,
      cancelledAt: finalStatusIsCancelled ? (existingAppointment?.cancelledAt || new Date().toISOString()) : ""
    };

    if (apiEnabled && isDemoClinic() && !String(selectedAppointmentId).startsWith("local-")) {
      apiRequest(`/api/appointments/${selectedAppointmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      })
        .then((appointment) => finish({ ...apiAppointmentToUi(appointment), cancelledBy, cancelledAt: localUpdate.cancelledAt, invoiceGenerated: localUpdate.invoiceGenerated, patientPackId: localUpdate.patientPackId, plannedPatientPackId: localUpdate.plannedPatientPackId, patientPackUsedAt: localUpdate.patientPackUsedAt }))
        .catch(() => finish(localUpdate));
      return;
    }

    finish(localUpdate);
  });
}

function resetPatientForm(form = $("#patient-form")) {
  form.reset();
  form.dataset.editingPatientId = "";
  form.querySelector(".modal-header h2").textContent = "Alta paciente";
  form.querySelector('button[type="submit"]').textContent = "Guardar paciente";
  clearFormError("#patient-form-error");
}

function openPatientEditor(patientId) {
  const patient = byId(patients, patientId);
  const form = $("#patient-form");
  if (!patient || !form || !canManageOperations()) return;
  resetPatientForm(form);
  form.dataset.editingPatientId = patient.id;
  form.elements.firstName.value = patient.firstName || "";
  form.elements.lastName.value = patient.lastName || "";
  form.elements.name.value = patient.name || "";
  form.elements.dni.value = patient.dni || "";
  form.elements.sex.value = patient.sex || "";
  form.elements.birthDate.value = patient.birthDate || "";
  form.elements.occupation.value = patient.occupation || "";
  form.elements.phone.value = patient.phone || "";
  form.elements.email.value = patient.email || "";
  form.elements.address.value = patient.address || "";
  form.elements.alert.value = patient.alert || "";
  form.querySelector(".modal-header h2").textContent = "Editar paciente";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  $("#patient-dialog").showModal();
}

function deletePatientById(patientId) {
  const patient = byId(patients, patientId);
  if (!patient || !canManageOperations()) return;
  const inUse = appointments.some((appointment) => appointment.patientId === patientId)
    || groups.some((group) => (group.patientIds || []).includes(patientId))
    || groupDropIns.some((entry) => entry.patientId === patientId);
  if (inUse) {
    alert("No se puede eliminar una persona con citas o grupos asociados.");
    return;
  }
  if (!confirm(`Eliminar a ${patient.name}?`)) return;
  patients = patients.filter((item) => item.id !== patientId);
  if (selectedPatientId === patientId) {
    selectedPatientId = patients[0]?.id || null;
  }
  saveClinicState("patients", patients);
  renderAppointmentFormOptions();
  renderAll();
}

function setupPatientDialog() {
  const dialog = $("#patient-dialog");
  const form = $("#patient-form");

  $("#new-patient").addEventListener("click", () => {
    if (!canManageOperations()) {
      return;
    }
    resetPatientForm(form);
    const status = $("#patient-save-status");
    if (status) {
      status.textContent = "";
      status.classList.remove("error");
    }
    dialog.showModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const patientName = patientFullNameFromForm(form);
    if (!patientName) {
      const error = $("#patient-form-error");
      if (error) {
        error.textContent = "Escribe al menos el nombre del paciente.";
        error.classList.add("visible");
      }
      form.elements.firstName?.focus();
      return;
    }

    const existingPatient = byId(patients, form.dataset.editingPatientId);
    const duplicatePatient = patientDuplicateFor(form, form.dataset.editingPatientId);
    if (duplicatePatient) {
      const status = $("#patient-save-status");
      if (status) {
        status.textContent = `Ya existe una ficha para ${duplicatePatient.name}. Se abre la ficha existente.`;
        status.classList.add("error");
      }
      resetPatientForm(form);
      dialog.close();
      openPatientProfile(duplicatePatient.id);
      return;
    }
    const dniFile = form.elements.dniFile?.files?.[0];
    const dniFileData = dniFile ? await readFileAsDataUrl(dniFile).catch(() => "") : (existingPatient?.dniFileData || "");
    const localPatient = {
      id: form.dataset.editingPatientId || `p${Date.now()}`,
      firstName: form.elements.firstName?.value.trim() || "",
      lastName: form.elements.lastName?.value.trim() || "",
      name: patientName,
      dni: form.elements.dni?.value.trim() || "",
      dniFileName: dniFile?.name || existingPatient?.dniFileName || "",
      dniFileData,
      sex: form.elements.sex?.value || "",
      birthDate: form.elements.birthDate?.value || "",
      occupation: form.elements.occupation?.value.trim() || "",
      phone: form.elements.phone?.value.trim() || "No indicado",
      email: form.elements.email?.value.trim() || "",
      address: form.elements.address?.value.trim() || "",
      alert: form.elements.alert?.value.trim() || "Sin alertas relevantes",
      last: byId(patients, form.dataset.editingPatientId)?.last || "Sin citas",
      status: byId(patients, form.dataset.editingPatientId)?.status || "Activo"
    };

    const finish = (patient) => {
      const editingPatientId = form.dataset.editingPatientId || "";
      patients = editingPatientId
        ? patients.map((item) => item.id === patient.id ? patient : item)
        : [...patients, patient];
      selectedPatientId = patient.id;
      patientProfileOpen = true;
      saveClinicState("patients", patients);
      renderAppointmentFormOptions();
      resetPatientForm(form);
      dialog.close();
      renderAll();
      const status = $("#patient-save-status");
      if (status) {
        status.textContent = editingPatientId ? "Paciente actualizado correctamente." : "Paciente guardado correctamente.";
        status.classList.remove("error");
      }
    };

    if (!form.dataset.editingPatientId && apiEnabled && isDemoClinic()) {
      apiRequest("/api/patients", {
        method: "POST",
        body: JSON.stringify(uiPatientToApi(form))
      })
        .then((patient) => finish({ ...localPatient, ...apiPatientToUi(patient) }))
        .catch(() => {
          const error = $("#patient-form-error");
          if (error) {
            error.textContent = "No se pudo guardar en servidor. Se guarda localmente para no perder los datos.";
            error.classList.add("visible");
          }
          finish(localPatient);
        });
      return;
    }

    finish(localPatient);
  });
}

function updateServiceGroupFieldsVisibility(form = $("#service-form")) {
  const fields = form?.querySelector(".group-service-fields");
  if (!fields) {
    return;
  }
  const isGroup = Boolean(form.elements.groupSession?.checked);
  fields.classList.toggle("hidden", !isGroup);
  form.querySelector(".service-price-field")?.classList.toggle("hidden", isGroup);
  form.elements.price.required = !isGroup;
}

function resetServiceForm(form = $("#service-form")) {
  form.reset();
  form.dataset.editingServiceId = "";
  form.querySelector(".modal-header h2").textContent = "Nuevo servicio";
  form.querySelector('button[type="submit"]').textContent = "Guardar servicio";
  form.elements.duration.value = 60;
  form.elements.price.value = 45;
  if (form.elements.groupSession) form.elements.groupSession.checked = false;
  if (form.elements.capacity) form.elements.capacity.value = 1;
  if (form.elements.monthlyPrice) form.elements.monthlyPrice.value = 0;
  if (form.elements.dropInPrice) form.elements.dropInPrice.value = 0;
  if (form.elements.commissionPerPatient) form.elements.commissionPerPatient.value = "0";
  form.elements.active.checked = true;
  updateServiceGroupFieldsVisibility(form);
}

function fillServiceForm(form, service) {
  form.dataset.editingServiceId = service.id;
  form.elements.name.value = service.name || "";
  form.elements.description.value = service.description || "";
  form.elements.duration.value = service.duration || 60;
  form.elements.price.value = service.price || 0;
  form.elements.groupSession.checked = (service.type || "individual") === "group";
  if (form.elements.capacity) form.elements.capacity.value = service.capacity || 1;
  form.elements.monthlyPrice.value = service.monthlyPrice || 0;
  form.elements.dropInPrice.value = service.dropInPrice || 0;
  form.elements.commissionPerPatient.value = Number(service.commissionPerPatient || 0).toLocaleString("es-ES");
  form.elements.active.checked = service.active !== false;
  form.querySelector(".modal-header h2").textContent = "Editar servicio";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  updateServiceGroupFieldsVisibility(form);
}

function openServiceEditor(serviceId) {
  const service = byId(services, serviceId);
  const form = $("#service-form");
  if (!service || !form || !canManageClinic()) return;
  resetServiceForm(form);
  fillServiceForm(form, service);
  $("#service-dialog").showModal();
}

function deleteServiceById(serviceId) {
  const service = byId(services, serviceId);
  if (!service || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.serviceId === serviceId) || groups.some((group) => group.serviceId === serviceId);
  if (inUse) {
    alert("No se puede eliminar un servicio con citas o grupos asociados. Puedes editarlo y marcarlo como inactivo.");
    return;
  }
  if (!confirm(`Eliminar el servicio ${service.name}?`)) return;
  services = services.filter((item) => item.id !== serviceId);
  saveClinicState("services", services);
  renderAppointmentFormOptions();
  renderAll();
}

function setupServiceDialog() {
  const dialog = $("#service-dialog");
  const form = $("#service-form");

  $$(".new-service-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canManageClinic()) {
        return;
      }
      resetServiceForm(form);
      dialog.showModal();
    });
  });

  form.elements.groupSession?.addEventListener("change", () => updateServiceGroupFieldsVisibility(form));
  updateServiceGroupFieldsVisibility(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const serviceType = form.elements.groupSession?.checked ? "group" : "individual";
    const localService = {
      id: form.dataset.editingServiceId || `svc${Date.now()}`,
      name: form.elements.name.value.trim(),
      description: form.elements.description.value.trim(),
      duration: Number(form.elements.duration.value),
      price: serviceType === "group"
        ? Number(form.elements.dropInPrice?.value || form.elements.monthlyPrice?.value || 0)
        : Number(form.elements.price.value),
      type: serviceType,
      capacity: 1,
      monthlyPrice: serviceType === "group" ? Number(form.elements.monthlyPrice?.value || 0) : 0,
      dropInPrice: serviceType === "group" ? Number(form.elements.dropInPrice?.value || form.elements.price.value || 0) : 0,
      commissionPerPatient: serviceType === "group" ? parseDecimal(form.elements.commissionPerPatient?.value, 0) : 0,
      active: form.elements.active.checked
    };

    const finish = (service) => {
      services = form.dataset.editingServiceId
        ? services.map((item) => item.id === service.id ? service : item)
        : [...services, service];
      saveClinicState("services", services);
      renderAppointmentFormOptions();
      resetServiceForm(form);
      dialog.close();
      renderAll();
    };

    if (!form.dataset.editingServiceId && apiEnabled && isDemoClinic()) {
      apiRequest("/api/services", {
        method: "POST",
        body: JSON.stringify(uiServiceToApi(form))
      })
        .then((service) => finish(apiServiceToUi(service)))
        .catch(() => finish(localService));
      return;
    }

    finish(localService);
  });
}


function resetGroupForm(form) {
  form.reset();
  form.dataset.editingGroupId = "";
  form.elements.capacity.value = 6;
  form.elements.start.value = "18:00";
  form.querySelector(".modal-header h2").textContent = "Nueva sesion grupal";
  form.querySelector('button[type="submit"]').textContent = "Guardar sesion";
  $("#group-form-error").classList.remove("visible");
  $("#group-form-error").textContent = "";
}

function fillGroupForm(form, group) {
  form.dataset.editingGroupId = group.id;
  form.elements.name.value = group.name || "";
  form.elements.service.value = group.serviceId || "";
  form.elements.practitioner.value = group.practitionerId || "";
  form.elements.room.value = group.roomId || "";
  [...form.querySelectorAll('input[name="days"]')].forEach((input) => {
    input.checked = (group.days || []).includes(input.value);
  });
  form.elements.start.value = group.start || "18:00";
  form.elements.capacity.value = group.capacity || 6;
  [...form.elements.patients.options].forEach((option) => {
    option.selected = (group.patientIds || []).includes(option.value);
  });
  form.querySelector(".modal-header h2").textContent = "Editar sesion grupal";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
}

function openGroupEditor(groupId) {
  const group = groups.find((item) => item.id === groupId);
  const dialog = $("#group-dialog");
  const form = $("#group-form");
  if (!group || !dialog || !form) return;
  refreshGroupFormOptions(form);
  resetGroupForm(form);
  fillGroupForm(form, group);
  dialog.showModal();
}

function deleteGroupById(groupId) {
  const group = groups.find((item) => item.id === groupId);
  if (!group) return;
  if (!confirm(`Eliminar el grupo ${group.name}?`)) return;
  groups = groups.filter((item) => item.id !== groupId);
  groupDropIns = groupDropIns.filter((entry) => entry.groupId !== groupId);
  groupCompletions = groupCompletions.filter((entry) => entry.groupId !== groupId);
  saveClinicState("groups", groups);
  saveClinicState("group-dropins", groupDropIns);
  saveClinicState("group-completions", groupCompletions);
  renderAll();
}

function refreshGroupFormOptions(form = $("#group-form")) {
  if (!form) return;
  const groupServices = services.filter((service) => service.active && service.type === "group");
  fillSelect(form.elements.service, groupServices);
  form.elements.service.disabled = !groupServices.length;
  fillSelect(form.elements.practitioner, practitioners);
  fillSelect(form.elements.room, rooms);
  const patientsSelect = form.elements.patients;
  patientsSelect.innerHTML = "";
  patients.forEach((patient) => patientsSelect.append(new Option(`${patient.name} - ${patient.phone || "sin telefono"}`, patient.id)));
}

function setupGroupDialog() {
  const dialog = $("#group-dialog");
  const form = $("#group-form");
  if (!dialog || !form) {
    return;
  }

  $("#new-group")?.addEventListener("click", () => {
    if (!canManageClinic()) {
      return;
    }
    resetGroupForm(form);
    refreshGroupFormOptions(form);
    if (!form.elements.service.options.length) {
      $("#group-form-error").textContent = "Crea primero un servicio marcado como sesion grupal.";
      $("#group-form-error").classList.add("visible");
    }
    dialog.showModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedDays = [...form.querySelectorAll('input[name="days"]:checked')].map((input) => input.value);
    const selectedPatients = [...form.elements.patients.selectedOptions].map((option) => option.value);
    if (!form.elements.service.value) {
      $("#group-form-error").textContent = "Selecciona un servicio de sesion grupal.";
      $("#group-form-error").classList.add("visible");
      return;
    }
    if (!selectedDays.length) {
      $("#group-form-error").textContent = "Selecciona al menos un dia de sesion.";
      $("#group-form-error").classList.add("visible");
      return;
    }
    const capacity = Math.max(1, Number(form.elements.capacity.value || 1));
    if (selectedPatients.length > capacity) {
      $("#group-form-error").textContent = "Hay mas pacientes inscritos que plazas disponibles.";
      $("#group-form-error").classList.add("visible");
      return;
    }
    const group = {
      id: `grp-${Date.now()}`,
      name: form.elements.name.value.trim(),
      serviceId: form.elements.service.value,
      practitionerId: form.elements.practitioner.value,
      roomId: form.elements.room.value,
      days: selectedDays,
      start: form.elements.start.value,
      capacity,
      patientIds: selectedPatients,
      active: true
    };

    const editingGroupId = form.dataset.editingGroupId || "";
    const conflict = groups.find((existing) => {
      if (existing.id === editingGroupId) return false;
      if (existing.active === false) return false;
      const sharesDay = existing.days.some((day) => group.days.includes(day));
      const sameResource = existing.roomId === group.roomId || existing.practitionerId === group.practitionerId;
      return sharesDay && sameResource && overlaps(group.start, groupEnd(group), existing.start, groupEnd(existing));
    });
    if (conflict) {
      $("#group-form-error").textContent = `Conflicto con el grupo ${conflict.name} a las ${conflict.start}.`;
      $("#group-form-error").classList.add("visible");
      return;
    }

    if (editingGroupId) {
      group.id = editingGroupId;
      groups = groups.map((existing) => existing.id === editingGroupId ? group : existing);
    } else {
      groups = [...groups, group];
    }
    saveClinicState("groups", groups);
    $("#group-form-error").classList.remove("visible");
    $("#group-form-error").textContent = "";
    form.reset();
    dialog.close();
    renderAll();
  });
}

function setupGroupSessionDialog() {
  const dialog = $("#group-session-dialog");
  if (!dialog) return;
  $("#edit-group-from-session")?.addEventListener("click", () => {
    const group = groups.find((item) => item.id === dialog.dataset.groupId);
    if (!group) return;
    dialog.close();
    openGroupEditor(group.id);
  });
  $("#add-fixed-patient")?.addEventListener("click", () => {
    const group = groups.find((item) => item.id === dialog.dataset.groupId);
    const dateValue = dialog.dataset.date || selectedDate;
    const patientId = $("#group-fixed-patient")?.value;
    if (!group || !patientId) return;
    const capacity = groupCapacity(group);
    const currentFixed = group.patientIds || [];
    if (currentFixed.includes(patientId)) {
      $("#group-session-warning").textContent = "Este paciente ya esta inscrito como fijo.";
      return;
    }
    if (currentFixed.length >= capacity) {
      $("#group-session-warning").textContent = "No quedan plazas fijas disponibles en el grupo.";
      return;
    }
    groups = groups.map((item) => item.id === group.id
      ? { ...item, patientIds: [...(item.patientIds || []), patientId] }
      : item
    );
    saveClinicState("groups", groups);
    const updatedGroup = groups.find((item) => item.id === group.id) || group;
    renderGroupSessionPanel(updatedGroup, dateValue);
    renderAll();
  });
  $("#complete-group-session")?.addEventListener("click", () => {
    const group = groups.find((item) => item.id === dialog.dataset.groupId);
    const dateValue = dialog.dataset.date || selectedDate;
    if (!group) return;
    if (isGroupCompleted(group, dateValue)) return;
    const production = groupSessionProduction(group, dateValue);
    groupCompletions = [
      ...groupCompletions,
      {
        id: `group-completed-${group.id}-${dateValue}`,
        groupId: group.id,
        date: dateValue,
        practitionerId: group.practitionerId,
        roomId: group.roomId,
        serviceId: group.serviceId,
        start: group.start,
        attendees: production.attendees,
        fixedCount: production.fixedCount,
        dropinCount: production.dropinCount,
        fixedMonthlyRevenue: production.fixedMonthlyRevenue,
        dropinRevenue: production.dropinRevenue,
        revenue: production.revenue,
        payout: production.payout,
        completedAt: new Date().toLocaleString("es-ES")
      }
    ];
    saveClinicState("group-completions", groupCompletions);
    renderGroupSessionPanel(group, dateValue);
    renderAll();
  });
  $("#add-dropin")?.addEventListener("click", () => {
    const group = groups.find((item) => item.id === dialog.dataset.groupId);
    const dateValue = dialog.dataset.date || selectedDate;
    const patientId = $("#group-dropin-patient")?.value;
    if (!group || !patientId) return;
    if (!groupHasFreeSpot(group, dateValue)) {
      $("#group-session-warning").textContent = "Sesion completa para este dia.";
      return;
    }
    const alreadyAdded = groupDropIns.some((entry) => entry.groupId === group.id && entry.date === dateValue && entry.patientId === patientId);
    const isFixed = (group.patientIds || []).includes(patientId);
    if (alreadyAdded || isFixed) {
      $("#group-session-warning").textContent = "Este paciente ya esta en la sesion.";
      return;
    }
    groupDropIns = [
      ...groupDropIns,
      { id: `dropin-${Date.now()}`, groupId: group.id, date: dateValue, patientId, createdAt: new Date().toLocaleString("es-ES") }
    ];
    saveClinicState("group-dropins", groupDropIns);
    renderGroupSessionPanel(group, dateValue);
    renderAll();
  });
}

function resetPractitionerForm(form = $("#practitioner-form")) {
  form.elements.commissionRate.type = "text";
  form.elements.commissionRate.inputMode = "decimal";
  form.reset();
  form.dataset.editingPractitionerId = "";
  form.querySelector(".modal-header h2").textContent = "Nuevo trabajador";
  form.querySelector('button[type="submit"]').textContent = "Guardar trabajador";
  form.elements.color.value = workerColorPalette[practitioners.length % workerColorPalette.length];
  form.elements.password.value = "demo";
  form.elements.commissionRate.value = "40";
  form.elements.target.value = 2500;
  form.elements.availabilityStart.value = "08:00";
  form.elements.availabilityEnd.value = "14:00";
  form.elements.availabilityStart2.value = "15:00";
  form.elements.availabilityEnd2.value = "20:00";
}

function openPractitionerEditor(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  const form = $("#practitioner-form");
  if (!practitioner || !form || !canManageClinic()) return;
  resetPractitionerForm(form);
  form.dataset.editingPractitionerId = practitioner.id;
  form.elements.name.value = practitioner.name || "";
  form.elements.specialty.value = practitioner.specialty || "";
  form.elements.email.value = practitioner.email || "";
  form.elements.password.value = practitioner.password || "demo";
  form.elements.commissionRate.value = Number((practitioner.commissionRate || 0) * 100).toLocaleString("es-ES");
  form.elements.target.value = practitioner.target || 0;
  form.elements.availabilityStart.value = practitioner.availabilityStart || "08:00";
  form.elements.availabilityEnd.value = practitioner.availabilityEnd || "20:00";
  form.elements.availabilityStart2.value = practitioner.availabilityStart2 || "";
  form.elements.availabilityEnd2.value = practitioner.availabilityEnd2 || "";
  form.elements.color.value = practitioner.color || "#168776";
  form.querySelector(".modal-header h2").textContent = "Editar trabajador";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  $("#practitioner-dialog").showModal();
}

function deletePractitionerById(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  if (!practitioner || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.practitionerId === practitionerId)
    || groups.some((group) => group.practitionerId === practitionerId);
  if (inUse) {
    alert("No se puede eliminar un trabajador con citas o grupos asociados.");
    return;
  }
  if (!confirm(`Eliminar a ${practitioner.name}?`)) return;
  practitioners = practitioners.filter((item) => item.id !== practitionerId);
  saveClinicState("practitioners", practitioners);
  renderFilters();
  renderLoginProfiles();
  renderAppointmentFormOptions();
  renderAll();
}

function resetRoomForm(form = $("#room-form")) {
  form.reset();
  form.dataset.editingRoomId = "";
  form.querySelector(".modal-header h2").textContent = "Nueva sala";
  form.querySelector('button[type="submit"]').textContent = "Guardar sala";
}

function openRoomEditor(roomId) {
  const room = byId(rooms, roomId);
  const form = $("#room-form");
  if (!room || !form || !canManageClinic()) return;
  resetRoomForm(form);
  form.dataset.editingRoomId = room.id;
  form.elements.name.value = room.name || "";
  form.elements.type.value = room.type || "";
  form.querySelector(".modal-header h2").textContent = "Editar sala";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  $("#room-dialog").showModal();
}

function deleteRoomById(roomId) {
  const room = byId(rooms, roomId);
  if (!room || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.roomId === roomId)
    || groups.some((group) => group.roomId === roomId);
  if (inUse) {
    alert("No se puede eliminar una sala con citas o grupos asociados.");
    return;
  }
  if (!confirm(`Eliminar la sala ${room.name}?`)) return;
  rooms = rooms.filter((item) => item.id !== roomId);
  saveClinicState("rooms", rooms);
  renderFilters();
  renderAppointmentFormOptions();
  renderAll();
}

function resetUnavailabilityForm(form = $("#unavailability-form")) {
  form.reset();
  form.elements.date.value = selectedDate;
  if (form.elements.endDate) form.elements.endDate.value = selectedDate;
  form.elements.allDay.checked = true;
  form.elements.start.value = "08:00";
  form.elements.end.value = "21:00";
  form.querySelector(".unavailability-hours").classList.add("hidden");
  $("#unavailability-form-error").classList.remove("visible");
  $("#unavailability-form-error").textContent = "";
}

function renderUnavailabilityWorkerOptions(form = $("#unavailability-form")) {
  fillSelect(form.elements.practitioner, practitioners);
  if (isPractitionerSession()) {
    form.elements.practitioner.value = currentSession.practitionerId;
    form.elements.practitioner.disabled = true;
  } else {
    form.elements.practitioner.disabled = false;
  }
}

function openUnavailabilityDialog(defaults = {}) {
  const form = $("#unavailability-form");
  resetUnavailabilityForm(form);
  renderUnavailabilityWorkerOptions(form);
  if (defaults.practitionerId && byId(practitioners, defaults.practitionerId)) {
    form.elements.practitioner.value = defaults.practitionerId;
  }
  if (defaults.date) {
    form.elements.date.value = defaults.date;
    if (form.elements.endDate) form.elements.endDate.value = defaults.endDate || defaults.date;
  }
  if (defaults.allDay === false) {
    form.elements.allDay.checked = false;
    form.querySelector(".unavailability-hours").classList.remove("hidden");
  }
  if (defaults.start) {
    form.elements.start.value = defaults.start;
  }
  if (defaults.end) {
    form.elements.end.value = defaults.end;
  }
  $("#unavailability-dialog").showModal();
}

function deleteAvailabilityBlockById(blockId) {
  const block = availabilityBlocks.find((item) => item.id === blockId);
  if (!block) return;
  if (!canManageAvailability()) return;
  if (isPractitionerSession() && block.practitionerId !== currentSession.practitionerId) return;
  if (!confirm(`Eliminar ${availabilityBlockLabel(block)}?`)) return;
  availabilityBlocks = availabilityBlocks.filter((item) => item.id !== blockId);
  saveClinicState("availability-blocks", availabilityBlocks);
  renderAll();
}

function setupUnavailabilityDialog() {
  const dialog = $("#unavailability-dialog");
  const form = $("#unavailability-form");
  if (!dialog || !form) return;

  const openFromButton = () => {
    if (!canManageAvailability()) {
      return;
    }
    const practitionerId = isPractitionerSession()
      ? currentSession.practitionerId
      : selectedAgendaPractitioners()[0]?.id || practitioners[0]?.id;
    openUnavailabilityDialog({ practitionerId, date: selectedDate });
  };

  $("#new-unavailability-settings")?.addEventListener("click", openFromButton);
  form.elements.allDay.addEventListener("change", () => {
    form.querySelector(".unavailability-hours").classList.toggle("hidden", form.elements.allDay.checked);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const allDay = form.elements.allDay.checked;
    const start = allDay ? "00:00" : form.elements.start.value;
    const end = allDay ? "23:59" : form.elements.end.value;
    if (!allDay && (!start || !end || start >= end)) {
      $("#unavailability-form-error").textContent = "Indica una franja valida.";
      $("#unavailability-form-error").classList.add("visible");
      return;
    }
    const startDate = form.elements.date.value;
    const endDate = form.elements.endDate?.value || startDate;
    if (!canManageAvailability()) {
      return;
    }
    if (isPractitionerSession() && form.elements.practitioner.value !== currentSession.practitionerId) {
      $("#unavailability-form-error").textContent = "Solo puedes gestionar tu propia disponibilidad.";
      $("#unavailability-form-error").classList.add("visible");
      return;
    }
    if (endDate < startDate) {
      $("#unavailability-form-error").textContent = "La fecha final no puede ser anterior a la inicial.";
      $("#unavailability-form-error").classList.add("visible");
      return;
    }
    const block = {
      id: `block-${Date.now()}`,
      practitionerId: form.elements.practitioner.value,
      date: startDate,
      endDate,
      type: form.elements.type.value,
      allDay,
      start,
      end,
      reason: form.elements.reason.value.trim()
    };
    availabilityBlocks = [...availabilityBlocks, block];
    saveClinicState("availability-blocks", availabilityBlocks);
    dialog.close();
    renderAll();
  });
}

function confirmClinicReset(message) {
  const firstConfirmed = window.confirm(`${message}\n\n¿Estas seguro de que quieres continuar?`);
  if (!firstConfirmed) {
    return false;
  }
  const answer = window.prompt('Confirmacion final: escribe "SI" para resetear los datos de la clinica.', "");
  return ["SI", "SÍ"].includes(String(answer || "").trim().toUpperCase());
}

function setupConfiguration() {
  $("#clinic-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    clinic = {
      ...clinic,
      name: form.elements.name.value.trim() || defaultClinic.name,
      email: form.elements.email?.value.trim() || "",
      phone: form.elements.phone.value.trim()
    };
    saveClinicState("clinic", clinic);
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey
        ? { ...account, name: clinic.name, email: clinic.email, phone: clinic.phone }
        : account
    )));
    saveClinicAccounts();
    renderLoginClinics();
    $("#clinic-save-status").textContent = "Clinica guardada.";
    renderFilters();
    renderAppointmentFormOptions();
    renderAll();
  });

  $("#delete-clinic").addEventListener("click", () => {
    if (isDemoClinic()) {
      const confirmed = confirmClinicReset("Esto limpiara la demo local y la dejara con datos de ejemplo.");
      if (!confirmed) {
        $("#clinic-save-status").textContent = "Reset cancelado. No se ha cambiado nada.";
        return;
      }
      deleteClinicStorage(demoClinicKey);
      saveClinicState("reminder-actions", []);
      reminderActions = [];
      loadActiveClinicData(demoClinicKey);
    } else {
      const account = clinicAccountByKey(activeClinicKey);
      const confirmed = confirmClinicReset(`Vas a resetear pacientes, citas, trabajadores, salas y servicios de ${clinic.name}. La clinica seguira existiendo para poder entrar de nuevo.`);
      if (!confirmed) {
        $("#clinic-save-status").textContent = "Reset cancelado. No se ha cambiado nada.";
        return;
      }
      deleteClinicStorage(activeClinicKey);
      ensureClinicAccount(account);
      saveClinicState("clinic", {
        name: account.name,
        email: account.email || "",
        phone: account.phone || ""
      });
      saveClinicState("patients", []);
      saveClinicState("appointments", []);
      saveClinicState("clinical-notes", []);
      saveClinicState("services", []);
      saveClinicState("practitioners", []);
      saveClinicState("rooms", []);
      saveClinicState("groups", []);
      saveClinicState("availability-blocks", []);
      saveClinicState("permissions", defaultPermissionSettings);
      saveClinicState("group-dropins", []);
      saveClinicState("group-completions", []);
      saveClinicState("reminder-actions", []);
      reminderActions = [];
      loadActiveClinicData(account.key);
    }
    renderLoginClinics();
    renderFilters();
    renderAppointmentFormOptions();
    renderSession();
    renderAll();
    $("#clinic-save-status").textContent = "Clinica reseteada. La cuenta sigue disponible para entrar.";
  });

  $("#new-practitioner").addEventListener("click", () => {
    if (!canManageClinic()) {
      return;
    }
    resetPractitionerForm($("#practitioner-form"));
    $("#practitioner-dialog").showModal();
  });

  $("#practitioner-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const requiredFields = ["name", "specialty", "password", "availabilityStart", "availabilityEnd"];
    const missingField = requiredFields.map((name) => form.elements[name]).find((field) => !String(field.value || "").trim());
    if (missingField) {
      missingField.setCustomValidity("Completa este campo.");
      form.reportValidity();
      missingField.setCustomValidity("");
      return;
    }
    const commissionPercent = parseDecimal(form.elements.commissionRate.value, NaN);
    if (!Number.isFinite(commissionPercent) || commissionPercent < 0 || commissionPercent > 100) {
      form.elements.commissionRate.setCustomValidity("Escribe un porcentaje entre 0 y 100. Puedes usar coma, por ejemplo 30,5.");
      form.reportValidity();
      form.elements.commissionRate.setCustomValidity("");
      return;
    }
    const hasSecondRange = Boolean(form.elements.availabilityStart2.value || form.elements.availabilityEnd2.value);
    if (hasSecondRange && (!form.elements.availabilityStart2.value || !form.elements.availabilityEnd2.value || form.elements.availabilityStart2.value >= form.elements.availabilityEnd2.value)) {
      form.elements.availabilityStart2.setCustomValidity("Completa la franja de tarde con una hora de inicio menor que la de fin.");
      form.reportValidity();
      form.elements.availabilityStart2.setCustomValidity("");
      return;
    }
    const practitioner = {
      id: form.dataset.editingPractitionerId || `worker-${Date.now()}`,
      name: form.elements.name.value.trim(),
      specialty: form.elements.specialty.value.trim(),
      email: form.elements.email?.value.trim() || "",
      password: form.elements.password.value,
      color: form.elements.color.value,
      commissionRate: commissionPercent / 100,
      target: Number(form.elements.target.value),
      availabilityStart: form.elements.availabilityStart.value,
      availabilityEnd: form.elements.availabilityEnd.value,
      availabilityStart2: form.elements.availabilityStart2.value,
      availabilityEnd2: form.elements.availabilityEnd2.value
    };
    practitioners = form.dataset.editingPractitionerId
      ? practitioners.map((item) => item.id === practitioner.id ? practitioner : item)
      : [...practitioners, practitioner];
    saveClinicState("practitioners", practitioners);
    resetPractitionerForm(form);
    $("#practitioner-dialog").close();
    renderFilters();
    renderLoginProfiles();
    renderAppointmentFormOptions();
    renderAll();
  });

  $("#new-room").addEventListener("click", () => {
    if (!canManageClinic()) {
      return;
    }
    resetRoomForm($("#room-form"));
    $("#room-dialog").showModal();
  });

  $("#room-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const room = {
      id: form.dataset.editingRoomId || `room-${Date.now()}`,
      name: form.elements.name.value.trim(),
      type: form.elements.type.value.trim()
    };
    rooms = form.dataset.editingRoomId
      ? rooms.map((item) => item.id === room.id ? room : item)
      : [...rooms, room];
    saveClinicState("rooms", rooms);
    resetRoomForm(form);
    $("#room-dialog").close();
    renderFilters();
    renderAppointmentFormOptions();
    renderAll();
  });
}



function setupPatientTabs() {
  $$(".patient-tab").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".patient-tab").forEach((item) => item.classList.remove("selected"));
      $$(".patient-tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("selected");
      $(`[data-patient-panel="${button.dataset.patientTab}"]`)?.classList.add("active");
    });
  });
}

function consentBodyForPatient(template, patient, city = "", signatureDate = todayIso()) {
  const base = template?.body || "Autorizo el tratamiento fisioterapeutico y el uso de mis datos segun la politica del centro.";
  return base
    .replaceAll("{{nombre}}", patient?.name || "")
    .replaceAll("{{dni}}", patient?.dni || "")
    .replaceAll("{{email}}", patient?.email || "")
    .replaceAll("{{telefono}}", patient?.phone || "")
    .replaceAll("{{direccion}}", patient?.address || "")
    .replaceAll("{{ciudad}}", city || "")
    .replaceAll("{{fecha}}", formatConsentDate(signatureDate));
}

function patientConsentById(id) {
  return patientConsents.find((item) => item.id === id);
}

function patientConsentCanvasContext() {
  const canvas = $("#patient-consent-signature-canvas");
  return canvas ? { canvas, context: canvas.getContext("2d") } : null;
}

function clearPatientConsentCanvas() {
  const drawing = patientConsentCanvasContext();
  if (!drawing) return;
  drawing.context.clearRect(0, 0, drawing.canvas.width, drawing.canvas.height);
  drawing.canvas.dataset.hasSignature = "";
  clearFormError("#patient-consent-error");
}

function loadPatientConsentSignature(signatureData = "") {
  const drawing = patientConsentCanvasContext();
  if (!drawing) return;
  clearPatientConsentCanvas();
  if (!signatureData) return;
  const image = new Image();
  image.addEventListener("load", () => {
    drawing.context.drawImage(image, 0, 0, drawing.canvas.width, drawing.canvas.height);
    drawing.canvas.dataset.hasSignature = "true";
  });
  image.src = signatureData;
}

function setupPatientConsentSignatureCanvas() {
  const canvas = $("#patient-consent-signature-canvas");
  if (!canvas || canvas.dataset.ready === "true") return;
  canvas.dataset.ready = "true";
  const context = canvas.getContext("2d");
  context.lineWidth = 2.4;
  context.lineCap = "round";
  context.strokeStyle = "#10231f";
  let drawing = false;
  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  };
  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    canvas.dataset.hasSignature = "true";
    clearFormError("#patient-consent-error");
    const next = point(event);
    context.beginPath();
    context.arc(next.x, next.y, 1.4, 0, Math.PI * 2);
    context.fillStyle = context.strokeStyle;
    context.fill();
    context.beginPath();
    context.moveTo(next.x, next.y);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.stroke();
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
    canvas.addEventListener(eventName, () => {
      drawing = false;
    });
  });
  canvas.addEventListener("mousedown", (event) => {
    drawing = true;
    canvas.dataset.hasSignature = "true";
    clearFormError("#patient-consent-error");
    const next = point(event);
    context.beginPath();
    context.arc(next.x, next.y, 1.4, 0, Math.PI * 2);
    context.fillStyle = context.strokeStyle;
    context.fill();
    context.beginPath();
    context.moveTo(next.x, next.y);
  });
  canvas.addEventListener("mousemove", (event) => {
    if (!drawing) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.stroke();
  });
  window.addEventListener("mouseup", () => {
    drawing = false;
  });
  $("#clear-patient-consent-signature")?.addEventListener("click", clearPatientConsentCanvas);
}

function fillPatientConsentTemplateOptions(select, selectedTemplateId = "", existing = null) {
  select.innerHTML = "";
  patientConsentTemplateChoices(selectedTemplateId, existing).forEach((template) => {
    select.append(new Option(template.name || "Plantilla archivada", template.id));
  });
  select.value = selectedTemplateId || consentTemplates[0]?.id || "";
}

function patientConsentTemplateChoices(selectedTemplateId = "", existing = null) {
  const choices = [...consentTemplates];
  if (selectedTemplateId && !choices.some((template) => template.id === selectedTemplateId)) {
    choices.push({
      id: selectedTemplateId,
      name: existing?.templateName || "Plantilla archivada",
      body: existing?.templateBody || existing?.body || ""
    });
  }
  return choices;
}

function renderPatientConsentTemplateList(selectedTemplateId = "", locked = false, existing = null) {
  const list = $("#patient-consent-template-list");
  const form = $("#patient-consent-form");
  if (!list || !form) return;
  const choices = patientConsentTemplateChoices(selectedTemplateId, existing);
  if (!choices.length) {
    list.innerHTML = `<article class="compact-item consent-template-empty"><span>Crea primero una plantilla en Configuracion para poder firmarla con el paciente.</span></article>`;
    return;
  }
  list.innerHTML = choices.map((template) => {
    const selected = template.id === selectedTemplateId;
    return `
      <button class="consent-template-option ${selected ? "selected" : ""}" type="button" data-patient-consent-template="${template.id}" ${locked ? "disabled" : ""}>
        <strong>${escapeHtml(template.name || "Plantilla archivada")}</strong>
        <span>${escapeHtml(excerptText(template.body || "Documento archivado de este consentimiento."))}</span>
      </button>
    `;
  }).join("");

  $$("[data-patient-consent-template]").forEach((button) => {
    button.addEventListener("click", () => {
      if (locked) return;
      form.elements.template.value = button.dataset.patientConsentTemplate;
      hydratePatientConsentBody();
      renderPatientConsentTemplateList(button.dataset.patientConsentTemplate, false);
    });
  });
}

function renderPatientConsentDialogData(patient) {
  $("#patient-consent-patient-name").textContent = patient?.name || "Paciente";
  $("#patient-consent-patient-data").innerHTML = `
    <dt>DNI/NIE</dt>
    <dd>${escapeHtml(patient?.dni || "No indicado")}</dd>
    <dt>Email</dt>
    <dd>${escapeHtml(patient?.email || "No indicado")}</dd>
    <dt>Telefono</dt>
    <dd>${escapeHtml(patient?.phone || "No indicado")}</dd>
    <dt>Direccion</dt>
    <dd>${escapeHtml(patient?.address || "No indicada")}</dd>
  `;
}

function hydratePatientConsentBody() {
  const form = $("#patient-consent-form");
  const patient = byId(patients, selectedPatientId);
  if (!form || !patient || form.dataset.editingConsentId) return;
  const template = byId(consentTemplates, form.elements.template.value);
  form.elements.body.value = template ? consentBodyForPatient(template, patient, form.elements.city.value.trim(), form.elements.signatureDate.value) : "";
}

function openPatientConsentDialog(consentId = "") {
  const dialog = $("#patient-consent-dialog");
  const form = $("#patient-consent-form");
  const patient = byId(patients, selectedPatientId);
  if (!dialog || !form || !patient) return;
  const existing = consentId ? patientConsentById(consentId) : null;
  const selectedTemplateId = existing?.templateId || consentTemplates[0]?.id || "";
  form.dataset.editingConsentId = existing?.id || "";
  fillPatientConsentTemplateOptions(form.elements.template, selectedTemplateId, existing);
  form.elements.template.disabled = Boolean(existing);
  form.elements.city.value = existing?.city || "";
  form.elements.signatureDate.value = existing?.signatureDate || todayIso();
  const selectedTemplate = byId(consentTemplates, selectedTemplateId) || (existing ? { ...existing, id: existing.templateId, name: existing.templateName, body: existing.templateBody || existing.body || "" } : null);
  form.elements.body.value = existing?.body || (selectedTemplate ? consentBodyForPatient(selectedTemplate, patient, form.elements.city.value.trim(), form.elements.signatureDate.value) : "");
  renderPatientConsentDialogData(patient);
  renderPatientConsentTemplateList(selectedTemplateId, Boolean(existing), existing);
  $("#patient-consent-dialog-title").textContent = existing ? "Revisar consentimiento" : "Preparar consentimiento";
  $("#save-patient-consent").textContent = existing?.signed ? "Guardar cambios" : "Guardar consentimiento firmado";
  $("#patient-consent-error").classList.remove("visible");
  $("#patient-consent-error").textContent = consentTemplates.length ? "" : "Crea primero una plantilla de consentimiento en Configuracion.";
  $("#save-patient-consent").disabled = !consentTemplates.length && !existing;
  setupPatientConsentSignatureCanvas();
  loadPatientConsentSignature(existing?.signatureData || "");
  dialog.showModal();
}

function setupPatientConsentsAndPacks() {
  setupPatientConsentSignatureCanvas();
  $("#patient-consent-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const patient = byId(patients, selectedPatientId);
    const existing = form.dataset.editingConsentId ? patientConsentById(form.dataset.editingConsentId) : null;
    const template = byId(consentTemplates, form.elements.template.value) || (existing ? { id: existing.templateId, name: existing.templateName, body: existing.templateBody || existing.body || "" } : null);
    const drawing = patientConsentCanvasContext();
    const error = $("#patient-consent-error");
    if (!patient || !template) {
      error.textContent = "Selecciona una plantilla de consentimiento.";
      error.classList.add("visible");
      return;
    }
    if (!drawing?.canvas.dataset.hasSignature) {
      error.textContent = "Firma el consentimiento antes de guardarlo.";
      error.classList.add("visible");
      return;
    }
    const city = form.elements.city.value.trim();
    const signatureDate = form.elements.signatureDate.value;
    const body = form.elements.body.value.trim();
    if (!signatureDate) {
      error.textContent = "Selecciona la fecha del consentimiento.";
      error.classList.add("visible");
      return;
    }
    if (!body) {
      error.textContent = "El documento del consentimiento no puede estar vacio.";
      error.classList.add("visible");
      return;
    }
    const now = new Date().toISOString();
    const next = {
      ...(existing || {}),
      id: existing?.id || `patient-consent-${Date.now()}`,
      patientId: patient.id,
      templateId: template.id,
      templateName: template.name || existing?.templateName || "Consentimiento",
      templateBody: template.body || existing?.templateBody || "",
      body,
      city,
      signatureDate,
      signatureDateLabel: formatConsentDate(signatureDate),
      createdAt: existing?.createdAt || new Date().toLocaleString("es-ES"),
      signed: true,
      signedAt: existing?.signedAt || now,
      updatedAt: now,
      signatureData: drawing.canvas.toDataURL("image/png"),
      fiscalData: {
        name: patient.name,
        dni: patient.dni || "",
        email: patient.email || "",
        phone: patient.phone || "",
        address: patient.address || ""
      }
    };
    patientConsents = existing
      ? patientConsents.map((item) => item.id === existing.id ? next : item)
      : [...patientConsents, next];
    saveClinicState("patient-consents", patientConsents);
    $("#patient-consent-dialog").close();
    clearPatientConsentCanvas();
    renderPatientDetail();
  });

  $("#patient-consent-form select[name='template']")?.addEventListener("change", (event) => {
    const form = $("#patient-consent-form");
    const existing = form?.dataset.editingConsentId ? patientConsentById(form.dataset.editingConsentId) : null;
    hydratePatientConsentBody();
    renderPatientConsentTemplateList(event.target.value, Boolean(existing), existing);
  });
  $("#patient-consent-form input[name='city']")?.addEventListener("input", hydratePatientConsentBody);
  $("#patient-consent-form input[name='signatureDate']")?.addEventListener("change", hydratePatientConsentBody);

  $("#add-patient-consent")?.addEventListener("click", () => {
    openPatientConsentDialog();
  });

  $("#assign-patient-pack")?.addEventListener("click", () => {
    const patient = byId(patients, selectedPatientId);
    const pack = byId(sessionPacks, $("#patient-pack-template")?.value);
    if (!patient || !pack) {
      $("#patient-packs").innerHTML = `<article class="compact-item"><span>Crea primero un bono en Configuracion.</span></article>`;
      return;
    }
    patientPacks = [...patientPacks, {
      id: `patient-pack-${Date.now()}`,
      patientId: patient.id,
      packId: pack.id,
      name: pack.name,
      sessions: pack.sessions,
      used: 0,
      price: pack.price,
      serviceId: pack.serviceId || "",
      invoice: pack.invoice,
      createdAt: new Date().toLocaleString("es-ES")
    }];
    saveClinicState("patient-packs", patientPacks);
    renderPatientDetail();
  });

  $("#patient-pack-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const pack = byId(patientPacks, form.dataset.editingPatientPackId);
    if (!pack) return;
    const sessions = Math.max(1, Number(form.elements.sessions.value || 1));
    const used = Math.max(0, Math.min(sessions, Number(form.elements.used.value || 0)));
    const name = form.elements.name.value.trim();
    if (!name) {
      $("#patient-pack-error").textContent = "El nombre del bono es obligatorio.";
      $("#patient-pack-error").classList.add("visible");
      return;
    }
    patientPacks = patientPacks.map((item) => item.id === pack.id
      ? {
          ...item,
          name,
          sessions,
          used,
          price: Math.max(0, Number(form.elements.price.value || 0)),
          serviceId: form.elements.serviceId.value || "",
          invoice: form.elements.invoice.checked,
          updatedAt: new Date().toISOString()
        }
      : item
    );
    saveClinicState("patient-packs", patientPacks);
    $("#patient-pack-dialog").close();
    renderPatientDetail();
    renderBilling();
  });

  $("#invoice-patient-pack")?.addEventListener("click", () => {
    const packId = $("#patient-pack-form")?.dataset.editingPatientPackId;
    if (packId) generateInvoiceForPatientPack(packId);
  });
}

function consumePatientPack(packId) {
  const pack = byId(patientPacks, packId);
  if (!pack || patientPackRemaining(pack) <= 0) return;
  patientPacks = patientPacks.map((item) => item.id === packId
    ? { ...item, used: Number(item.used || 0) + 1, updatedAt: new Date().toISOString() }
    : item
  );
  saveClinicState("patient-packs", patientPacks);
  renderPatientDetail();
  renderBilling();
}

function openPatientPackDialog(packId) {
  const pack = byId(patientPacks, packId);
  const form = $("#patient-pack-form");
  if (!pack || !form) return;
  form.reset();
  form.dataset.editingPatientPackId = pack.id;
  form.elements.name.value = pack.name || "";
  form.elements.sessions.value = pack.sessions || 1;
  form.elements.used.value = Number(pack.used || 0);
  form.elements.price.value = Number(pack.price || 0);
  fillPackServiceOptions(form.elements.serviceId, pack.serviceId || "");
  form.elements.invoice.checked = Boolean(pack.invoice);
  $("#patient-pack-error").classList.remove("visible");
  $("#patient-pack-error").textContent = "";
  $("#invoice-patient-pack").textContent = pack.invoiceGenerated ? "Reimprimir factura" : "Facturar bono";
  $("#patient-pack-dialog").showModal();
}

function generateInvoiceForPatientPack(packId) {
  const pack = byId(patientPacks, packId);
  if (!pack) return;
  const patient = byId(patients, pack.patientId);
  const invoiceNumber = pack.invoiceNumber || `KL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Factura ${invoiceNumber}</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#202621}header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #ddd;padding-bottom:18px}img{max-width:90px;max-height:90px}h1{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:28px}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:22px;font-weight:700;margin-top:24px}</style></head>
<body>
<header><div>${clinicLogo ? `<img src="${clinicLogo}" alt="Logo">` : ""}<h1>${clinic.name || "Klinia"}</h1><p>${clinic.email || ""}<br>${clinic.phone || ""}</p></div><div><strong>Factura ${invoiceNumber}</strong><p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p></div></header>
<section><h2>Paciente</h2><p>${patient?.name || "Paciente"}<br>${patient?.dni || ""}<br>${patient?.address || ""}</p></section>
<table><thead><tr><th>Concepto</th><th>Servicio</th><th>Sesiones</th><th>Importe</th></tr></thead><tbody><tr><td>${pack.name}</td><td>${packServiceLabel(pack)}</td><td>${pack.sessions}</td><td>${pack.price} EUR</td></tr></tbody></table>
<p class="total">Total: ${pack.price} EUR</p>
</body></html>`;
  downloadTextFile(`factura-${invoiceNumber}.html`, html, "text/html");
  patientPacks = patientPacks.map((item) => item.id === pack.id
    ? { ...item, invoice: true, invoiceGenerated: true, invoiceGeneratedAt: new Date().toISOString(), invoiceNumber }
    : item
  );
  saveClinicState("patient-packs", patientPacks);
  renderPatientDetail();
  renderBilling();
}

function clinicalNoteById(noteId) {
  return clinicalNotes.find((note) => String(note.id) === String(noteId));
}

function renderClinicalNoteAttachmentPanel(note) {
  const panel = $("#clinical-note-attachment-current");
  const removeRow = $("#clinical-note-remove-attachment-row");
  if (!panel || !removeRow) return;
  if (!note?.attachmentName) {
    panel.innerHTML = `<span class="muted-text">Sin archivo adjunto.</span>`;
    removeRow.classList.add("hidden");
    return;
  }
  panel.innerHTML = `
    <strong>Archivo actual</strong>
    <span>${escapeHtml(note.attachmentName)}</span>
    <div class="compact-actions">
      <button class="secondary-button compact-inline-button" type="button" id="open-current-note-file">Abrir archivo</button>
      <button class="secondary-button compact-inline-button" type="button" id="download-current-note-file">Descargar</button>
    </div>
  `;
  removeRow.classList.remove("hidden");
  $("#open-current-note-file")?.addEventListener("click", () => openDataUrlDocument(note.attachmentData, note.attachmentName || "Archivo clinico"));
  $("#download-current-note-file")?.addEventListener("click", () => downloadDataUrlFile(note.attachmentData, note.attachmentName || "archivo-clinico"));
}

function openClinicalNoteDialog(noteId) {
  const note = clinicalNoteById(noteId);
  const form = $("#clinical-note-dialog-form");
  if (!note || !form) return;
  selectedClinicalNoteId = note.id;
  form.reset();
  form.elements.date.value = note.date || todayIso();
  form.elements.reason.value = note.reason || note.diagnosis || "";
  form.elements.content.value = note.content || "";
  form.elements.removeAttachment.checked = false;
  $("#clinical-note-dialog-title").textContent = `${note.date || ""} - ${note.reason || note.diagnosis || "Nota clinica"}`;
  $("#clinical-note-dialog-error").classList.remove("visible");
  $("#clinical-note-dialog-error").textContent = "";
  renderClinicalNoteAttachmentPanel(note);
  $("#clinical-note-dialog").showModal();
}

function deleteClinicalNoteById(noteId) {
  clinicalNotes = clinicalNotes.filter((note) => String(note.id) !== String(noteId));
  saveClinicState("clinical-notes", clinicalNotes);
  selectedClinicalNoteId = null;
  $("#clinical-note-dialog")?.close();
  renderPatientDetail();
}

function setupPatientDetail() {
  $("#edit-patient-from-detail")?.addEventListener("click", () => {
    if (selectedPatientId) {
      openPatientEditor(selectedPatientId);
    }
  });

  $("#close-patient-detail").addEventListener("click", () => {
    closePatientProfile();
  });

  $("#patient-detail").addEventListener("click", (event) => {
    if (event.target.id === "patient-detail") {
      closePatientProfile();
    }
  });

  $("#clinical-note-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const content = form.elements.content.value.trim();
    if (!content || !selectedPatientId) {
      return;
    }
    const attachment = form.elements.attachment?.files?.[0];

    clinicalNotes = [
      {
        id: Date.now(),
        patientId: selectedPatientId,
        date: new Date().toISOString().slice(0, 10),
        author: currentSessionName(),
        reason: form.elements.reason?.value.trim() || "",
        attachmentName: attachment?.name || "",
        attachmentData: attachment ? await readFileAsDataUrl(attachment).catch(() => "") : "",
        content
      },
      ...clinicalNotes
    ];
    saveClinicState("clinical-notes", clinicalNotes);
    form.reset();
    renderPatientDetail();
  });

  $("#clinical-note-dialog-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = clinicalNoteById(selectedClinicalNoteId);
    if (!note) return;
    const content = form.elements.content.value.trim();
    if (!content) {
      $("#clinical-note-dialog-error").textContent = "La evolucion u observacion no puede estar vacia.";
      $("#clinical-note-dialog-error").classList.add("visible");
      return;
    }
    const attachment = form.elements.attachment?.files?.[0];
    const nextAttachmentData = attachment
      ? await readFileAsDataUrl(attachment).catch(() => "")
      : form.elements.removeAttachment.checked
        ? ""
        : note.attachmentData || "";
    clinicalNotes = clinicalNotes.map((item) => String(item.id) === String(note.id)
      ? {
          ...item,
          date: form.elements.date.value || note.date || todayIso(),
          reason: form.elements.reason.value.trim(),
          diagnosis: "",
          content,
          attachmentName: attachment ? attachment.name : form.elements.removeAttachment.checked ? "" : note.attachmentName || "",
          attachmentData: nextAttachmentData,
          updatedAt: new Date().toISOString()
        }
      : item
    );
    saveClinicState("clinical-notes", clinicalNotes);
    $("#clinical-note-dialog").close();
    renderPatientDetail();
  });

  $("#delete-clinical-note")?.addEventListener("click", () => {
    if (selectedClinicalNoteId) {
      deleteClinicalNoteById(selectedClinicalNoteId);
    }
  });
}

function setupFilters() {
  $("#filter-practitioner").addEventListener("change", (event) => {
    if (isPractitionerSession() || event.target.tagName !== "INPUT") {
      return;
    }
    const value = event.target.value;
    if (value === "all") {
      selectedPractitionerIds = event.target.checked ? ["all"] : practitioners.map((item) => item.id);
    } else {
      const current = selectedPractitionerIds.includes("all")
        ? practitioners.map((item) => item.id)
        : selectedPractitionerIds.slice();
      selectedPractitionerIds = event.target.checked
        ? [...new Set([...current, value])]
        : current.filter((id) => id !== value);
      if (!selectedPractitionerIds.length || selectedPractitionerIds.length === practitioners.length) {
        selectedPractitionerIds = ["all"];
      }
    }
    saveState("selected-practitioner-ids", selectedPractitionerIds);
    renderFilters();
    renderSession();
    renderSchedule();
    renderNextList();
  });
  $("#filter-room").addEventListener("change", () => {
    renderSchedule();
    renderNextList();
  });
}

function moveSelectedDate(amount) {
  if (calendarMode === "month") {
    const date = dateOnly(monthStartIso(selectedDate));
    date.setMonth(date.getMonth() + amount);
    selectedDate = toIsoDate(date);
  } else if (calendarMode === "week") {
    selectedDate = addDaysIso(weekStartIso(selectedDate), amount * 7);
  } else {
    const date = dateOnly(selectedDate);
    date.setDate(date.getDate() + amount);
    selectedDate = toIsoDate(date);
  }
  saveState("selected-date", selectedDate);
  renderAll();
}

function setupCalendarControls() {
  $("#calendar-date").addEventListener("change", (event) => {
    selectedDate = event.target.value || todayIso();
    saveState("selected-date", selectedDate);
    renderAll();
  });

  $("#prev-date").addEventListener("click", () => moveSelectedDate(-1));
  $("#next-date").addEventListener("click", () => moveSelectedDate(1));

  $$(".calendar-mode").forEach((button) => {
    button.addEventListener("click", () => {
      calendarMode = button.dataset.mode;
      saveState("calendar-mode", calendarMode);
      renderAll();
    });
  });
}

function setupPerformance() {
  $("#worker-profile-select").addEventListener("change", renderPerformance);

  $$(".performance-mode").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mode === "owner" && !isOwner()) {
        return;
      }
      $$(".performance-mode").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      const workerMode = button.dataset.mode === "worker";
      $("#worker-performance").classList.toggle("hidden", !workerMode);
      $("#owner-performance").classList.toggle("hidden", workerMode);
      $("#worker-filter-wrap").classList.toggle("hidden", !workerMode);
    });
  });
}


function setupPwaInstall() {
  const installButton = $("#install-app");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Klinia PWA service worker unavailable.", error);
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton?.classList.remove("hidden");
  });

  installButton?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    installButton.classList.add("hidden");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installButton?.classList.add("hidden");
  });
}
renderFilters();
applyLoginState();
renderSession();
setupPwaInstall();
setupNavigation();
setActiveSection(activeSection, false);
setupLogin();
setupDialogCloseButtons();
setupFormErrorClearing("#appointment-form", "#form-error");
setupFormErrorClearing("#patient-form", "#patient-form-error");
setupFormErrorClearing("#group-form", "#group-form-error");
setupFormErrorClearing("#unavailability-form", "#unavailability-form-error");
setupFormErrorClearing("#consent-template-form", "#consent-template-error");
setupFormErrorClearing("#patient-consent-form", "#patient-consent-error");
setupFormErrorClearing("#clinical-note-dialog-form", "#clinical-note-dialog-error");
setupFormErrorClearing("#session-pack-form", "#session-pack-error");
setupFormErrorClearing("#patient-pack-form", "#patient-pack-error");
setupSession();
setupDialog();
setupAppointmentDetail();
setupPatientDialog();
setupServiceDialog();
setupGroupDialog();
setupGroupSessionDialog();
setupUnavailabilityDialog();
setupConfiguration();
setupDataSafety();
setupSaasSettings();
setupCommercialSettings();
setupPatientDetail();
setupPatientTabs();
setupPatientConsentsAndPacks();
setupFilters();
setupCalendarControls();
setupPerformance();
renderAll();


