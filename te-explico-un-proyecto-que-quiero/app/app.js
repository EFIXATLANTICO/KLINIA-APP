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
  { id: "kliniaplan", name: "Kliniaplan mensual", price: 50, interval: "mes", summary: "Kliniaplan - 50 EUR/mes" },
  { id: "kliniaplan_annual", name: "Kliniaplan anual", price: 500, interval: "año", summary: "Kliniaplan - 500 EUR/año" }
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

const clinicScopedCollectionKeys = new Set([
  "patients",
  "appointments",
  "clinical-notes",
  "services",
  "practitioners",
  "rooms",
  "groups",
  "availability-blocks",
  "group-dropins",
  "group-completions",
  "group-session-overrides",
  "consent-templates",
  "session-packs",
  "patient-consents",
  "patient-packs",
  "reminder-actions",
  "audit-log"
]);

function loadState(key, fallback) {
  if (typeof localStorage === "undefined") {
    return fallback;
  }

  try {
    const saved =
      localStorage.getItem(`klinia:${key}`) ||
      localStorage.getItem(`clinicaflow:${key}`);

    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveState(key, value) {
  if (typeof localStorage === "undefined") {
    return;
  }

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
  ownerEmail: defaultClinic.email,
  ownerPassword: "demo",
  staffPassword: "demo",
  staffEmail: "",
  paymentPlan: "trial",
  subscriptionStatus: "trialing",
  billingStatus: "trial",
  backendToken: "",
  backendClinicId: "",
  stripeConfigured: false,
  trialEndsAt: addDaysIso(todayIso(), 30),
  billingHistory: [],
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

function scopeClinicValue(key, value, clinicKey = activeClinicKey) {
  if (clinicScopedCollectionKeys.has(key) && Array.isArray(value)) {
    return value.map((item) => (
      item && typeof item === "object" && !Array.isArray(item)
        ? { ...item, clinicKey }
        : item
    ));
  }
  if (key === "clinic" && value && typeof value === "object" && !Array.isArray(value)) {
    return { ...value, clinicKey };
  }
  return value;
}

function filterClinicValue(key, value, clinicKey) {
  if (clinicScopedCollectionKeys.has(key) && Array.isArray(value)) {
    return value.filter((item) => !item || typeof item !== "object" || !item.clinicKey || item.clinicKey === clinicKey);
  }
  if (key === "clinic" && value && typeof value === "object" && value.clinicKey && value.clinicKey !== clinicKey) {
    return {};
  }
  return value;
}

function loadClinicStateFor(clinicKey, key, fallback) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return fallback;
  }

  try {
    const scoped = localStorage.getItem(`klinia:${clinicStateKeyFor(clinicKey, key)}`);
    return scoped ? filterClinicValue(key, JSON.parse(scoped), clinicKey) : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadClinicState(key, fallback) {
  return loadClinicStateFor(activeClinicKey, key, fallback);
}

function saveClinicState(key, value) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(
    `klinia:${clinicStateKey(key)}`,
    JSON.stringify(scopeClinicValue(key, value, activeClinicKey))
  );
}

function appendAuditLog(action, detail = {}) {
  auditLog = [
    {
      id: `audit-${Date.now()}`,
      clinicKey: activeClinicKey,
      action,
      detail,
      actor: currentSessionName(),
      createdAt: new Date().toISOString()
    },
    ...auditLog
  ].slice(0, 500);
  saveClinicState("audit-log", auditLog);
}

function isDemoClinic() {
  return activeClinicKey === demoClinicKey;
}

function normalizeSaasPlanId(planId) {
  const normalized = String(planId || "trial").toLowerCase();
  if (normalized === "trial" || normalized === "demo") {
    return "trial";
  }
  if (["annual", "anual", "kliniaplan_annual", "professional_annual", "profesional_anual"].includes(normalized)) {
    return "kliniaplan_annual";
  }
  if (["monthly", "mensual", "starter", "pro", "business", "kliniaplan", "kliniaplan_monthly"].includes(normalized)) {
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
        checkoutUrl: "",
        stripeCustomerId: "",
        stripeSubscriptionId: "",
        stripeConfigured: false,
        backendToken: "",
        backendClinicId: "",
        currentPeriodEnd: "",
        ...account,
        key,
        password: account.password || "",
        ownerEmail: account.ownerEmail || account.email || "",
        ownerPassword: account.ownerPassword || account.password || "",
        staffPassword: account.staffPassword || "",
        staffEmail: account.staffEmail || "",
        paymentPlan: plan,
        billingStatus: account.billingStatus || (plan === "trial" ? "trial" : "pending_stripe"),
        subscriptionStatus: account.subscriptionStatus || (plan === "trial" ? "trialing" : "incomplete"),
        trialEndsAt: account.trialEndsAt || addDaysIso(todayIso(), 30),
        billingHistory: Array.isArray(account.billingHistory) ? account.billingHistory : [],
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
      password: "",
      ownerEmail: legacyClinic?.email || "",
      ownerPassword: "",
      staffPassword: "",
      staffEmail: "",
      paymentPlan: "trial",
      billingStatus: "trial",
      subscriptionStatus: "trialing",
      backendToken: "",
      backendClinicId: "",
      stripeConfigured: false,
      trialEndsAt: addDaysIso(todayIso(), 30),
      billingHistory: [],
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

function clinicAccountByClinicIdentifier(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return clinicAccounts.find((account) => (
    account.key.toLowerCase() === normalized
      || account.name.toLowerCase() === normalized
  ));
}

function ownerEmailForAccount(account) {
  return account?.ownerEmail || account?.email || "";
}

function ownerPasswordForAccount(account) {
  return account?.ownerPassword || account?.password || "";
}

function clinicAccessPasswordForAccount(account) {
  return account?.password || ownerPasswordForAccount(account);
}

function loginPrincipalByIdentifier(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  for (const account of clinicAccounts) {
    if (account.key === demoClinicKey) {
      continue;
    }
    if (String(ownerEmailForAccount(account)).trim().toLowerCase() === normalized) {
      return {
        account,
        profile: "owner",
        password: ownerPasswordForAccount(account),
        label: account.ownerName || "Direccion"
      };
    }
    if (String(account.staffEmail || "").trim().toLowerCase() === normalized) {
      return {
        account,
        profile: "staff",
        password: account.staffPassword || "",
        label: "Recepcion / empleado"
      };
    }
    const loginPractitioners = normalizePractitioners(loadClinicStateFor(account.key, "practitioners", []));
    const practitioner = loginPractitioners.find((item) => String(item.email || "").trim().toLowerCase() === normalized);
    if (practitioner) {
      return {
        account,
        profile: practitioner.id,
        password: practitioner.password || "",
        label: practitioner.name || "Trabajador"
      };
    }
  }
  return null;
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

function subscriptionAllowsUse(account = currentClinicAccount()) {
  if (!account || account.key === demoClinicKey) {
    return true;
  }
  const status = account.subscriptionStatus || account.billingStatus || "trialing";
  if (status === "active") {
    return true;
  }
  if (["trialing", "trial"].includes(status)) {
    return !account.trialEndsAt || account.trialEndsAt >= todayIso();
  }
  if (["pending_stripe", "incomplete"].includes(status) && account.trialEndsAt && account.trialEndsAt >= todayIso()) {
    return true;
  }
  return false;
}

function subscriptionUseBlocked(account = currentClinicAccount()) {
  return !subscriptionAllowsUse(account);
}

function subscriptionBlockMessage(account = currentClinicAccount()) {
  const status = account?.subscriptionStatus || account?.billingStatus || "";
  if (["trialing", "trial"].includes(status)) {
    return "La prueba gratuita ha expirado. Activa la suscripcion para seguir usando Klinia.";
  }
  return "La suscripcion no esta activa. Revisa Mi suscripcion para continuar.";
}

function ensureClinicAccount(account) {
  clinicAccounts = normalizeClinicAccounts([
    ...clinicAccounts.filter((item) => item.key !== account.key),
    { password: "", ownerEmail: "", ownerPassword: "", staffPassword: "", staffEmail: "", ...account }
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
  return (Array.isArray(savedAppointments) ? savedAppointments : []).map((appointment) => ({
    date: todayIso(),
    ...appointment,
    status: normalizeAppointmentStatus(appointment.status),
    paymentStatus: appointment.paymentStatus || appointment.paymentMethod || (appointment.invoiceGenerated ? "card" : "unpaid"),
    paymentMethod: appointment.paymentMethod || appointment.paymentStatus || (appointment.invoiceGenerated ? "card" : "")
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

function normalizeGroupSessionOverrides(savedOverrides) {
  const bySession = new Map();
  (Array.isArray(savedOverrides) ? savedOverrides : []).forEach((override) => {
    if (!override?.groupId || !override.date) {
      return;
    }
    const baseGroup = groups?.find((group) => group.id === override.groupId);
    const practitionerId = practitioners?.some((practitioner) => practitioner.id === override.practitionerId)
      ? override.practitionerId
      : baseGroup?.practitionerId || "";
    const start = /^\d{2}:\d{2}$/.test(String(override.start || ""))
      ? override.start
      : baseGroup?.start || "";
    if (!practitionerId || !start) {
      return;
    }
    bySession.set(`${override.groupId}-${override.date}`, {
      id: override.id || `group-override-${Date.now()}`,
      groupId: override.groupId,
      date: override.date,
      basePractitionerId: override.basePractitionerId || baseGroup?.practitionerId || "",
      baseStart: override.baseStart || baseGroup?.start || "",
      practitionerId,
      start,
      updatedAt: override.updatedAt || new Date().toISOString(),
      updatedBy: override.updatedBy || ""
    });
  });
  return [...bySession.values()];
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
    expiryMonths: 12,
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
    expiresAt: "",
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
      password: "",
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
let groupSessionOverrides = normalizeGroupSessionOverrides(loadClinicState("group-session-overrides", []));
let consentTemplates = loadClinicState("consent-templates", []);
let sessionPacks = normalizeSessionPacks(loadClinicState("session-packs", []));
let clinicLogo = loadClinicState("clinic-logo", "");
let patientConsents = loadClinicState("patient-consents", []);
let patientPacks = normalizePatientPacks(loadClinicState("patient-packs", []));
let auditLog = loadClinicState("audit-log", []);
let accessRecoveryRequests = loadState("access-recovery-requests", []);
let autoReminderRunning = false;
let pendingRecurringReview = null;
let patientProfileOpen = false;
const patientPackConsumptionLocks = new Set();
const patientPackStorageLockTtlMs = 8000;
const appointmentInvoiceLocks = new Set();
const groupWorkerInvoiceLocks = new Set();
const appointmentDragMime = "application/x-klinia-appointment";
let draggedAppointmentId = "";
let suppressAppointmentClickUntil = 0;
let pendingImportSnapshot = null;
let pendingImportAnalysis = null;

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
let superadminSession = null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message, variant = "success") {
  const region = $("#toast-region");
  if (!region || !message) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${variant}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => {
    toast.classList.add("toast-leaving");
    window.setTimeout(() => toast.remove(), 180);
  }, 3600);
}

function showNotice(title, message, options = {}) {
  const dialog = $("#notice-dialog");
  if (!dialog) {
    showToast(message || title, options.variant || "info");
    return Promise.resolve();
  }
  $("#notice-dialog-eyebrow").textContent = options.eyebrow || "Aviso";
  $("#notice-dialog-title").textContent = title || "Aviso";
  $("#notice-dialog-message").textContent = message || "";
  dialog.dataset.variant = options.variant || "info";
  dialog.returnValue = "";
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(), { once: true });
    dialog.showModal();
  });
}

function showConfirm(options = {}) {
  const dialog = $("#confirm-dialog");
  if (!dialog) {
    return Promise.resolve(false);
  }
  $("#confirm-dialog-eyebrow").textContent = options.eyebrow || "Confirmacion";
  $("#confirm-dialog-title").textContent = options.title || "Confirmar accion";
  $("#confirm-dialog-message").textContent = options.message || "";
  $("#confirm-dialog-detail").textContent = options.detail || "";
  $("#confirm-dialog-accept").textContent = options.confirmLabel || "Confirmar";
  $("#confirm-dialog-accept").className = options.variant === "primary" ? "primary-button" : "danger-button";
  dialog.dataset.variant = options.variant || "danger";
  dialog.returnValue = "";
  return new Promise((resolve) => {
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "confirm"), { once: true });
    dialog.showModal();
  });
}

function confirmClinicReset(message) {
  const dialog = $("#clinic-reset-dialog");
  const form = $("#clinic-reset-form");
  if (!dialog || !form) {
    return Promise.resolve(false);
  }
  $("#clinic-reset-message").textContent = "¿Estás seguro que desea resetear clínica?";
  form.reset();
  return new Promise((resolve) => {
    let confirmed = false;
    const onSubmit = (event) => {
      event.preventDefault();
      confirmed = true;
      dialog.close("confirm");
    };
    form.addEventListener("submit", onSubmit, { once: false });
    dialog.addEventListener("close", () => {
      form.removeEventListener("submit", onSubmit);
      resolve(confirmed);
    }, { once: true });
    dialog.showModal();
  });
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

function formatShortDate(value) {
  if (!value) {
    return "";
  }
  const date = dateOnly(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
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
  groupSessionOverrides = normalizeGroupSessionOverrides(loadClinicState("group-session-overrides", []));
  consentTemplates = loadClinicState("consent-templates", []);
  sessionPacks = normalizeSessionPacks(loadClinicState("session-packs", []));
  patientConsents = loadClinicState("patient-consents", []);
  patientPacks = normalizePatientPacks(loadClinicState("patient-packs", []));
  syncPatientPackUsageFromAppointments({ persist: true });
  clinicLogo = loadClinicState("clinic-logo", "");
  reminderActions = loadClinicState("reminder-actions", []);
  reminderSettings = loadClinicState("reminder-settings", { autoWhatsapp: false });
  auditLog = loadClinicState("audit-log", []);
  selectedPatientId = patients[0]?.id || null;
  patientProfileOpen = false;
  document.body.classList.remove("patient-profile-open");
  selectedPractitionerIds = ["all"];
  saveState("selected-practitioner-ids", selectedPractitionerIds);

  if (isPractitionerSession() && !backendDataEnabled(account) && !practitioners.some((item) => item.id === currentSession.practitionerId)) {
    currentSession = { role: "owner", practitionerId: null };
    saveState("session", currentSession);
  }
  persistActiveClinicScope();
}

function persistActiveClinicScope() {
  saveClinicState("clinic", clinic);
  saveClinicState("patients", patients);
  saveClinicState("appointments", appointments);
  saveClinicState("clinical-notes", clinicalNotes);
  saveClinicState("services", services);
  saveClinicState("practitioners", practitioners);
  saveClinicState("rooms", rooms);
  saveClinicState("groups", groups);
  saveClinicState("availability-blocks", availabilityBlocks);
  saveClinicState("permissions", permissionSettings);
  saveClinicState("group-dropins", groupDropIns);
  saveClinicState("group-completions", groupCompletions);
  saveClinicState("group-session-overrides", groupSessionOverrides);
  saveClinicState("consent-templates", consentTemplates);
  saveClinicState("session-packs", sessionPacks);
  saveClinicState("patient-consents", patientConsents);
  saveClinicState("patient-packs", patientPacks);
  saveClinicState("reminder-actions", reminderActions);
  saveClinicState("reminder-settings", reminderSettings);
}

function clinicDataIsEmpty(clinicKey) {
  return ["patients", "appointments", "clinical-notes", "services", "practitioners", "rooms", "groups", "availability-blocks", "group-dropins", "group-completions", "group-session-overrides", "permissions"]
    .every((key) => !localStorage.getItem(`klinia:${clinicStateKeyFor(clinicKey, key)}`));
}

function renderLoginClinics() {
  const input = $("#login-clinic-select");
  const list = $("#login-clinic-list");
  if (!input || !list) {
    return;
  }
  list.innerHTML = "";
  clinicAccounts.filter((account) => account.key !== demoClinicKey).forEach((account) => {
    const option = document.createElement("option");
    option.value = account.name;
    option.label = account.email || account.key;
    list.append(option);
  });
  renderLoginProfiles();
}

function renderLoginProfiles() {
  const clinicInput = $("#login-clinic-select");
  const profileSelect = $("#profile-select");
  if (!clinicInput || !profileSelect) {
    return;
  }
  const selectedKey = pendingClinicKey || clinicAccountByClinicIdentifier(clinicInput.value)?.key || "";
  const loginPractitioners = normalizePractitioners(loadClinicStateFor(selectedKey, "practitioners", selectedKey === demoClinicKey ? defaultPractitioners : []));
  profileSelect.innerHTML = "";
  profileSelect.append(new Option("Direccion", "owner"));
  profileSelect.append(new Option("Recepcion / empleado", "staff"));
  loginPractitioners.forEach((practitioner) => profileSelect.append(new Option(practitioner.name, practitioner.id)));
}

function savedLoginCredentials() {
  const saved = loadState("saved-login-credentials", null);
  return saved && typeof saved === "object" ? saved : {};
}

function forgetSavedLoginCredentials() {
  localStorage.removeItem("klinia:saved-login-credentials");
  localStorage.removeItem("clinicaflow:saved-login-credentials");
}

function clearRealLoginFields() {
  const loginForm = $("#login-form");
  const profileForm = $("#profile-form");
  clearLoginErrors();
  if (loginForm) {
    loginForm.elements.center.value = "";
    loginForm.elements.password.value = "";
    loginForm.elements.remember.checked = false;
    loginForm.elements.center.removeAttribute("aria-invalid");
    loginForm.elements.password.removeAttribute("aria-invalid");
  }
  if (profileForm) {
    profileForm.elements.password.value = "";
    profileForm.elements.password.removeAttribute("aria-invalid");
  }
  pendingClinicKey = null;
  renderLoginProfiles();
}

function applySavedLoginCredentials() {
  const saved = savedLoginCredentials();
  const loginForm = $("#login-form");
  if (!loginForm || !saved.center || !saved.password) {
    return;
  }
  const principal = loginPrincipalByIdentifier(saved.center);
  const account = principal?.account || clinicAccountByClinicIdentifier(saved.center) || clinicAccountByLogin(saved.center);
  if (!account || account.key === demoClinicKey) {
    forgetSavedLoginCredentials();
    return;
  }
  loginForm.elements.center.value = saved.center;
  loginForm.elements.password.value = saved.password;
  loginForm.elements.remember.checked = true;
  renderLoginProfiles();
}

function showClinicLoginStep(options = {}) {
  if (!options.skipPublicView && !isAuthenticated) {
    showPublicView("login", { resetLogin: false });
  }
  $("#login-form").classList.remove("hidden");
  $("#profile-form").classList.add("hidden");
  clearRealLoginFields();
  if (options.allowSavedCredentials !== false) {
    applySavedLoginCredentials();
  }
}

function showProfileLoginStep(clinicKey) {
  if (!isAuthenticated) {
    showPublicView("login", { resetLogin: false });
  }
  clearLoginErrors();
  pendingClinicKey = clinicKey;
  $("#login-form").classList.add("hidden");
  $("#profile-form").classList.remove("hidden");
  $("#profile-form").elements.password.value = "";
  renderLoginProfiles();
}

function deleteClinicStorage(clinicKey) {
  ["clinic", "patients", "appointments", "clinical-notes", "services", "practitioners", "rooms", "groups", "availability-blocks", "group-dropins", "group-completions", "group-session-overrides", "permissions", "reminder-actions", "reminder-settings", "patient-consents", "patient-packs", "consent-templates", "session-packs", "clinic-logo"].forEach((key) => {
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

function backendApiBaseUrl() {
  const configured = String(window.KLINIA_API_BASE_URL || localStorage.getItem("klinia:api-base-url") || "").trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:8080";
  }
  if (["www.kliniasolutions.com", "kliniasolutions.com"].includes(window.location.hostname)) {
    return "https://api.kliniasolutions.com";
  }
  return window.location.origin;
}

function backendRequiredForProduction() {
  return Boolean(window.KLINIA_API_BASE_URL || localStorage.getItem("klinia:api-base-url"))
    || !["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function backendTokenForAccount(account = currentClinicAccount()) {
  return account?.backendToken || "";
}

function saveBackendSessionForAccount(accountKey, session = {}) {
  if (!accountKey || !session?.access_token) {
    return;
  }
  clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
    account.key === accountKey
      ? {
          ...account,
          backendToken: session.access_token,
          backendClinicId: session.clinic_id || account.backendClinicId || "",
          subscriptionStatus: session.subscription_status || account.subscriptionStatus,
          checkoutUrl: session.checkout_url || account.checkoutUrl || ""
        }
      : account
  )));
  saveClinicAccounts();
}

async function backendRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const account = options.account || currentClinicAccount();
  const token = options.token || (options.auth === false ? "" : backendTokenForAccount(account));
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${backendApiBaseUrl()}${path}`, {
    ...options,
    headers
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { detail: text };
    }
  }
  if (!response.ok) {
    const message = payload?.detail || `Error ${response.status}`;
    const error = new Error(Array.isArray(message) ? message.map((item) => item.msg || item.message || String(item)).join(", ") : String(message));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

function applyBackendBillingStatus(status) {
  if (!status?.clinic_id) {
    return;
  }
  clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
    account.key === activeClinicKey
      ? {
          ...account,
          backendClinicId: status.clinic_id || account.backendClinicId || "",
          paymentPlan: normalizeSaasPlanId(status.plan || account.paymentPlan),
          subscriptionStatus: status.status || account.subscriptionStatus,
          billingStatus: status.status || account.billingStatus,
          stripeConfigured: Boolean(status.stripe_configured),
          stripeCustomerId: status.stripe_customer_id || "",
          stripeSubscriptionId: status.stripe_subscription_id || "",
          currentPeriodEnd: (status.current_period_end || "").slice(0, 10),
          trialEndsAt: (status.trial_ends_at || account.trialEndsAt || "").slice(0, 10),
          billingProfile: {
            ...(account.billingProfile || {}),
            billingName: status.billing_name || account.billingProfile?.billingName || "",
            billingEmail: status.billing_email || account.billingProfile?.billingEmail || "",
            taxId: status.tax_id || account.billingProfile?.taxId || "",
            billingAddress: status.billing_address || account.billingProfile?.billingAddress || ""
          }
        }
      : account
  )));
  saveClinicAccounts();
}

async function syncCurrentSubscriptionFromBackend(options = {}) {
  const account = currentClinicAccount();
  if (!backendTokenForAccount(account)) {
    return null;
  }
  try {
    const status = await backendRequest("/billing/status", { account });
    applyBackendBillingStatus(status);
    if (!options.silent) {
      showToast("Estado de suscripcion sincronizado.");
    }
    return status;
  } catch (error) {
    if (!options.silent) {
      showToast(`No se pudo sincronizar Stripe: ${error.message}`, "warning");
    }
    return null;
  }
}

function backendDataEnabled(account = currentClinicAccount()) {
  return Boolean(backendTokenForAccount(account)) && account?.key !== demoClinicKey;
}

function parseBackendMetadata(value) {
  if (!value) return {};
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function backendMetadataJson(value, excludedKeys = []) {
  const blocked = new Set(["id", "password", "dniFileData", "token", "accessToken", ...excludedKeys]);
  const metadata = {};
  Object.entries(value || {}).forEach(([key, entryValue]) => {
    if (!blocked.has(key) && entryValue !== undefined) {
      metadata[key] = entryValue;
    }
  });
  return JSON.stringify(metadata);
}

function looksLikeBackendId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function backendWriteTarget(basePath, previousId = "") {
  const shouldPatch = looksLikeBackendId(previousId);
  return {
    method: shouldPatch ? "PATCH" : "POST",
    path: shouldPatch ? `${basePath}/${encodeURIComponent(previousId)}` : basePath
  };
}

function formatSuperadminDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

function superadminToken() {
  return superadminSession?.access_token || "";
}

const superadminSessionStorageKey = "klinia:superadmin-session";
const superadminModuleMeta = {
  dashboard: ["Dashboard", "Resumen general de clinicas, actividad y alertas de la plataforma."],
  clinics: ["Clinicas", "Listado completo con filtros, estado, plan, usuarios y acciones rapidas."],
  "clinic-detail": ["Detalle de clinica", "Vista operativa de una clinica: usuarios, suscripcion, actividad y acciones."],
  users: ["Usuarios", "Usuarios globales por clinica, rol, estado y ultimo acceso."],
  subscriptions: ["Planes y suscripciones", "Catalogo y estado de suscripciones conectado a datos reales disponibles."],
  billing: ["Facturacion", "Resumen preparado para ingresos, facturas, impagos y exportacion."],
  support: ["Soporte y tickets", "Base para incidencias, prioridad, estado, asignacion e historial."],
  audit: ["Auditoria", "Eventos persistentes de backend con filtros por clinica, usuario, accion y fecha."],
  communications: ["Comunicaciones", "Base para emails, campanas, aperturas e historico."],
  reports: ["Informes", "Metricas clave y exportaciones operativas."],
  settings: ["Configuracion", "Parametros globales, seguridad, branding, API y webhooks."],
  system: ["Integraciones y logs", "Estado tecnico de integraciones, errores, advertencias y eventos del sistema."]
};
let superadminActiveModule = "dashboard";
let selectedSuperadminClinicId = "";
let superadminData = {
  overview: {},
  clinics: [],
  backendClinics: [],
  users: [],
  audit: [],
  plans: [],
  health: null
};

function superadminStatusClass(value) {
  return String(value || "success").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

function renderSuperadminEmpty(tbody, colspan, message) {
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="${colspan}" class="superadmin-empty">${escapeHtml(message)}</td></tr>`;
  }
}

function localSuperadminClinics(backendClinics = []) {
  const backendKeys = new Set((backendClinics || []).flatMap((clinic) => [
    String(clinic.id || "").toLowerCase(),
    String(clinic.email || "").trim().toLowerCase(),
    String(clinic.name || "").trim().toLowerCase()
  ]).filter(Boolean));
  return clinicAccounts
    .filter((account) => account.key !== demoClinicKey)
    .filter((account) => !backendKeys.has(String(account.backendClinicId || "").toLowerCase()))
    .filter((account) => !backendKeys.has(String(account.email || "").trim().toLowerCase()))
    .filter((account) => !backendKeys.has(String(account.name || "").trim().toLowerCase()))
    .map((account) => ({
      id: `local:${account.key}`,
      name: account.name || "Clinica local",
      email: account.email || account.ownerEmail || "",
      phone: account.phone || "",
      subscription_plan: account.paymentPlan || "local",
      subscription_status: "local_pending_backend",
      created_at: account.createdAt || "",
      users_count: 0,
      last_activity_at: null,
      source: "local"
    }));
}

function mergeSuperadminClinics(backendClinics = []) {
  return [
    ...backendClinics.map((clinic) => ({ ...clinic, source: "backend" })),
    ...localSuperadminClinics(backendClinics)
  ];
}

function saveSuperadminSession(session, me) {
  try {
    sessionStorage.setItem(superadminSessionStorageKey, JSON.stringify({
      access_token: session?.access_token || "",
      token_type: session?.token_type || "bearer",
      clinic_id: session?.clinic_id || null,
      subscription_status: session?.subscription_status || "active",
      user: me?.user || session?.user || null,
      savedAt: Date.now()
    }));
  } catch {
    // Session persistence is a convenience; login still works without it.
  }
}

function clearSuperadminSession() {
  superadminSession = null;
  try {
    sessionStorage.removeItem(superadminSessionStorageKey);
  } catch {
    // Ignore storage failures.
  }
}

async function restoreSuperadminSessionIfAvailable() {
  if (publicViewFromHash() !== "superadmin") {
    return false;
  }
  let saved = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(superadminSessionStorageKey) || "null");
  } catch {
    saved = null;
  }
  if (!saved?.access_token) {
    return false;
  }
  try {
    const me = await backendRequest("/me", { token: saved.access_token, auth: false });
    if (me?.user?.role !== "superadmin") {
      clearSuperadminSession();
      return false;
    }
    enterSuperadmin(saved, me, { persist: false });
    return true;
  } catch {
    clearSuperadminSession();
    return false;
  }
}

function superadminSearchTerm() {
  return String($("#superadmin-global-search")?.value || "").trim().toLowerCase();
}

function textMatchesSearch(values, search = superadminSearchTerm()) {
  if (!search) return true;
  return values.some((value) => String(value || "").toLowerCase().includes(search));
}

function clinicBySuperadminId(clinicId = selectedSuperadminClinicId) {
  return superadminData.clinics.find((clinic) => String(clinic.id) === String(clinicId)) || null;
}

function filteredSuperadminClinics() {
  const status = $("#superadmin-clinic-status-filter")?.value || "";
  const search = superadminSearchTerm();
  return superadminData.clinics.filter((clinic) => {
    const statusOk = !status || clinic.subscription_status === status;
    return statusOk && textMatchesSearch([clinic.name, clinic.email, clinic.phone, clinic.subscription_plan, clinic.subscription_status], search);
  });
}

function filteredSuperadminUsers() {
  const role = $("#superadmin-user-role-filter")?.value || "";
  const status = $("#superadmin-user-status-filter")?.value || "";
  const search = superadminSearchTerm();
  return superadminData.users.filter((user) => {
    const roleOk = !role || user.role === role;
    const activeOk = !status || (status === "active" ? user.active : !user.active);
    return roleOk && activeOk && textMatchesSearch([user.name, user.email, user.clinic_name, user.role], search);
  });
}

function filteredSuperadminAudit() {
  const search = superadminSearchTerm();
  return superadminData.audit.filter((item) => textMatchesSearch([
    item.clinic_name,
    item.clinic_id,
    item.user_name,
    item.user_email,
    item.action,
    item.resource_type,
    item.result,
    item.origin
  ], search));
}

function superadminStatusLabel(value) {
  return {
    active: "Activa",
    trial: "En prueba",
    trialing: "En prueba",
    past_due: "Impagada",
    incomplete: "Incompleta",
    canceled: "Cancelada",
    local_pending_backend: "Pendiente backend"
  }[value] || value || "-";
}

function setSuperadminModule(module = "dashboard") {
  superadminActiveModule = superadminModuleMeta[module] ? module : "dashboard";
  $$(".superadmin-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.superadminModule === superadminActiveModule);
  });
  $$(".superadmin-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.superadminPanel === superadminActiveModule);
  });
  const [title, subtitle] = superadminModuleMeta[superadminActiveModule];
  $("#superadmin-module-title").textContent = title;
  $("#superadmin-module-subtitle").textContent = subtitle;
  renderSuperadminViews();
}

function renderSuperadminChart() {
  const chart = $("#superadmin-growth-chart");
  if (!chart) return;
  const counts = [
    ["Activas", Number(superadminData.overview.active_clinics || 0)],
    ["En prueba", Number(superadminData.overview.trialing_clinics || 0)],
    ["Impagadas", Number(superadminData.overview.past_due_clinics || 0)],
    ["Locales", superadminData.clinics.filter((clinic) => clinic.source === "local").length]
  ];
  const max = Math.max(1, ...counts.map((item) => item[1]));
  chart.innerHTML = counts.map(([label, value]) => `
    <div class="superadmin-chart-row">
      <span>${escapeHtml(label)}</span>
      <div><i style="width:${Math.max(8, Math.round((value / max) * 100))}%"></i></div>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderSuperadminDashboard() {
  const overview = superadminData.overview || {};
  const localClinics = superadminData.clinics.filter((clinic) => clinic.source === "local");
  $("#superadmin-total-clinics").textContent = localClinics.length
    ? `${overview.total_clinics ?? 0} + ${localClinics.length}`
    : (overview.total_clinics ?? "-");
  $("#superadmin-total-users").textContent = overview.total_users ?? "-";
  $("#superadmin-active-clinics").textContent = overview.active_clinics ?? "-";
  $("#superadmin-trial-clinics").textContent = overview.trialing_clinics ?? "-";
  $("#superadmin-failed-logins").textContent = overview.failed_logins_24h ?? "-";
  $("#superadmin-activity-24h").textContent = overview.activity_24h ?? "-";
  $("#superadmin-clinics-count").textContent = localClinics.length
    ? `${superadminData.backendClinics.length} backend + ${localClinics.length} locales`
    : `${superadminData.backendClinics.length} clinicas backend`;
  $("#superadmin-users-count").textContent = `${superadminData.users.length} usuarios`;
  $("#superadmin-audit-count").textContent = `${superadminData.audit.length} eventos`;
  $("#superadmin-backend-state").textContent = superadminData.health?.backend_setup_status
    ? `Backend ${superadminData.health.backend_setup_status}`
    : "Backend conectado";
  renderSuperadminChart();

  const activityTable = $("#superadmin-dashboard-activity-table");
  const recentAudit = filteredSuperadminAudit().slice(0, 8);
  if (!recentAudit.length) {
    renderSuperadminEmpty(activityTable, 4, "No hay actividad reciente para este filtro.");
  } else {
    activityTable.innerHTML = recentAudit.map((item) => `
      <tr>
        <td>${escapeHtml(formatSuperadminDate(item.created_at))}</td>
        <td>${escapeHtml(item.clinic_name || item.clinic_id || "Plataforma")}</td>
        <td><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.resource_type || "")}</span></td>
        <td><span class="superadmin-status ${superadminStatusClass(item.result)}">${escapeHtml(item.result || "success")}</span></td>
      </tr>
    `).join("");
  }

  const alerts = [];
  if (Number(overview.failed_logins_24h || 0) > 0) alerts.push(["Fallos de login", `${overview.failed_logins_24h} intentos fallidos en las ultimas 24h`, "warning"]);
  const pastDue = Number(overview.past_due_clinics || 0);
  if (pastDue > 0) alerts.push(["Suscripciones a revisar", `${pastDue} clinicas con estado impagado, incompleto o cancelado`, "danger"]);
  if (localClinics.length) alerts.push(["Clinicas locales pendientes", `${localClinics.length} clinicas existen solo en este navegador y no tienen auditoria completa`, "warning"]);
  if (!alerts.length) alerts.push(["Sin alertas criticas", "No hay incidencias operativas detectadas con los datos actuales.", "ok"]);
  $("#superadmin-alerts-count").textContent = `${alerts.length} alertas`;
  $("#superadmin-alert-list").innerHTML = alerts.map(([title, text, kind]) => `
    <article class="superadmin-alert ${kind}">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text)}</span>
    </article>
  `).join("");
}

function renderSuperadminClinicsTable() {
  const clinicsTable = $("#superadmin-clinics-table");
  const clinics = filteredSuperadminClinics();
  if (!clinics.length) {
    renderSuperadminEmpty(clinicsTable, 5, "No hay clinicas para el filtro seleccionado.");
    return;
  }
  clinicsTable.innerHTML = clinics.map((clinic) => `
    <tr class="${String(selectedSuperadminClinicId) === String(clinic.id) ? "selected" : ""}">
      <td><strong>${escapeHtml(clinic.name)}</strong><span>${escapeHtml(clinic.email || "Sin email")}</span><span class="superadmin-source ${clinic.source === "local" ? "local" : "backend"}">${clinic.source === "local" ? "Local pendiente de backend" : "Backend"}</span></td>
      <td><span class="superadmin-status ${superadminStatusClass(clinic.subscription_status)}">${escapeHtml(superadminStatusLabel(clinic.subscription_status))}</span><span>${escapeHtml(clinic.subscription_plan || "-")}</span></td>
      <td>${Number(clinic.users_count || 0)}</td>
      <td>${escapeHtml(formatSuperadminDate(clinic.last_activity_at || clinic.created_at))}</td>
      <td><div class="superadmin-row-actions"><button type="button" data-superadmin-open-clinic="${escapeHtml(clinic.id)}">Detalle</button><button type="button" data-superadmin-impersonate="${escapeHtml(clinic.id)}">Impersonar</button></div></td>
    </tr>
  `).join("");
}

function renderSuperadminUsersTable() {
  const usersTable = $("#superadmin-users-table");
  const users = filteredSuperadminUsers();
  if (!users.length) {
    renderSuperadminEmpty(usersTable, 6, "No hay usuarios para el filtro seleccionado.");
    return;
  }
  usersTable.innerHTML = users.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.email)}</span></td>
      <td>${escapeHtml(item.clinic_name || "-")}</td>
      <td>${escapeHtml(item.role || "-")}</td>
      <td><span class="superadmin-status ${item.active ? "active" : "inactive"}">${item.active ? "Activo" : "Inactivo"}</span></td>
      <td>${escapeHtml(formatSuperadminDate(item.last_access_at))}</td>
      <td><div class="superadmin-row-actions"><button type="button" data-superadmin-user-action="reset:${escapeHtml(item.id)}">Reset clave</button><button type="button" data-superadmin-user-action="role:${escapeHtml(item.id)}">Rol</button></div></td>
    </tr>
  `).join("");
}

function renderSuperadminAuditTable() {
  const auditTable = $("#superadmin-audit-table");
  const audit = filteredSuperadminAudit();
  if (!audit.length) {
    renderSuperadminEmpty(auditTable, 6, "No hay actividad para el filtro seleccionado.");
    return;
  }
  auditTable.innerHTML = audit.map((item) => `
    <tr>
      <td>${escapeHtml(formatSuperadminDate(item.created_at))}</td>
      <td>${escapeHtml(item.clinic_name || item.clinic_id || "Plataforma")}</td>
      <td><strong>${escapeHtml(item.user_name || "-")}</strong><span>${escapeHtml(item.user_email || "")}</span></td>
      <td><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.resource_type || "")}</span></td>
      <td><span class="superadmin-status ${superadminStatusClass(item.result)}">${escapeHtml(item.result || "success")}</span></td>
      <td>${escapeHtml(item.origin || "-")}</td>
    </tr>
  `).join("");
}

function renderSuperadminClinicDetail() {
  const clinic = clinicBySuperadminId();
  $("#superadmin-detail-name").textContent = clinic?.name || "Selecciona una clinica";
  $("#superadmin-detail-email").textContent = clinic?.email || "-";
  if (!clinic) {
    $("#superadmin-detail-general").innerHTML = `<dt>Estado</dt><dd>Sin clinica seleccionada</dd>`;
    $("#superadmin-detail-plan").innerHTML = "";
    $("#superadmin-detail-users").innerHTML = "";
    $("#superadmin-detail-activity").innerHTML = "";
    $("#superadmin-detail-actions").innerHTML = "";
    return;
  }
  const clinicUsers = superadminData.users.filter((user) => user.clinic_id === clinic.id);
  const clinicAudit = superadminData.audit.filter((item) => item.clinic_id === clinic.id || item.clinic_name === clinic.name).slice(0, 6);
  $("#superadmin-detail-general").innerHTML = `
    <dt>ID</dt><dd>${escapeHtml(clinic.id)}</dd>
    <dt>Email</dt><dd>${escapeHtml(clinic.email || "-")}</dd>
    <dt>Telefono</dt><dd>${escapeHtml(clinic.phone || "-")}</dd>
    <dt>Creada</dt><dd>${escapeHtml(formatSuperadminDate(clinic.created_at))}</dd>
    <dt>Origen</dt><dd>${escapeHtml(clinic.source === "local" ? "Local pendiente" : "Backend")}</dd>
  `;
  $("#superadmin-detail-plan").innerHTML = `
    <dt>Plan</dt><dd>${escapeHtml(clinic.subscription_plan || "-")}</dd>
    <dt>Estado</dt><dd><span class="superadmin-status ${superadminStatusClass(clinic.subscription_status)}">${escapeHtml(superadminStatusLabel(clinic.subscription_status))}</span></dd>
    <dt>Fin de prueba</dt><dd>${escapeHtml(formatSuperadminDate(clinic.trial_ends_at))}</dd>
    <dt>Periodo actual</dt><dd>${escapeHtml(formatSuperadminDate(clinic.current_period_end))}</dd>
  `;
  $("#superadmin-detail-users-count").textContent = `${clinicUsers.length} usuarios`;
  $("#superadmin-detail-users").innerHTML = clinicUsers.length
    ? clinicUsers.map((user) => `<article><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)} - ${escapeHtml(user.role || "-")}</span></article>`).join("")
    : `<article><strong>Sin usuarios backend</strong><span>La clinica puede estar pendiente de migracion.</span></article>`;
  $("#superadmin-detail-activity").innerHTML = clinicAudit.length
    ? clinicAudit.map((item) => `<article><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(formatSuperadminDate(item.created_at))} - ${escapeHtml(item.result || "success")}</span></article>`).join("")
    : `<article><strong>Sin actividad</strong><span>No hay eventos auditados para esta clinica.</span></article>`;
  $("#superadmin-detail-actions").innerHTML = [
    ["Impersonar clinica", "Preparado. Requiere endpoint backend con auditoria y caducidad corta."],
    ["Resetear acceso direccion", "Preparado. Debe generar clave temporal y registrar auditoria."],
    ["Bloquear clinica", "Preparado. Debe validar suscripcion, soporte y RGPD antes de activar."],
    ["Exportar auditoria", "Disponible desde el boton Exportar en el modulo Auditoria."]
  ].map(([title, text]) => `<article><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></article>`).join("");
}

function renderSuperadminPreparedPanels() {
  const planCards = (superadminData.plans || []).map((plan) => `
    <section class="superadmin-card"><div class="superadmin-card-head"><h2>${escapeHtml(plan.name)}</h2><span>${plan.checkout_enabled ? "Checkout listo" : "Sin checkout"}</span></div><dl class="superadmin-definition-list"><dt>Precio</dt><dd>${Number(plan.price_eur || 0)} EUR / ${escapeHtml(plan.interval || "-")}</dd><dt>Stripe price</dt><dd>${escapeHtml(plan.price_id || "No configurado")}</dd><dt>Recomendado</dt><dd>${plan.recommended ? "Si" : "No"}</dd></dl></section>
  `).join("");
  $("#superadmin-subscriptions-grid").innerHTML = planCards || `<section class="superadmin-card"><h2>Catalogo no disponible</h2><p>No se han recibido planes desde backend.</p></section>`;
  $("#superadmin-billing-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Facturacion plataforma</h2><span>Preparado</span></div><p>Los ingresos, facturas e impagos necesitan persistencia de facturas Stripe o tabla propia de billing. No se muestran importes inventados.</p></section><section class="superadmin-card"><div class="superadmin-card-head"><h2>Estados de cobro</h2><span>Datos reales</span></div><p>${Number(superadminData.overview.past_due_clinics || 0)} clinicas requieren revision de suscripcion.</p></section>`;
  $("#superadmin-support-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Tickets</h2><span>Modulo preparado</span></div><p>No existe todavia backend de tickets. La estructura queda lista para prioridad, estado, asignacion e historial.</p></section>`;
  $("#superadmin-communications-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Comunicaciones</h2><span>Modulo preparado</span></div><p>Preparado para campanas, emails transaccionales, aperturas e historico cuando se conecte proveedor de email.</p></section>`;
  $("#superadmin-reports-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Informe operativo</h2><span>Datos backend</span></div><dl class="superadmin-definition-list"><dt>Clinicas</dt><dd>${superadminData.backendClinics.length}</dd><dt>Usuarios</dt><dd>${superadminData.users.length}</dd><dt>Eventos auditoria</dt><dd>${superadminData.audit.length}</dd></dl></section>`;
  $("#superadmin-settings-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Seguridad</h2><span>Produccion</span></div><p>Superadmin protegido por rol backend. Queda pendiente MFA, rotacion de sesiones e impersonacion auditada.</p></section><section class="superadmin-card"><div class="superadmin-card-head"><h2>API y webhooks</h2><span>Configurado</span></div><p>Stripe webhook y API publica se supervisan desde backend. No se exponen secretos en UI.</p></section>`;
  $("#superadmin-system-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Estado del sistema</h2><span>${escapeHtml(superadminData.health?.backend_setup_status || "-")}</span></div><dl class="superadmin-definition-list"><dt>App</dt><dd>${escapeHtml(superadminData.health?.app || "Klinia")}</dd><dt>Entorno</dt><dd>${escapeHtml(superadminData.health?.env || "-")}</dd><dt>Stripe</dt><dd>${superadminData.health?.stripe_configured ? "Configurado" : "No configurado"}</dd><dt>Setup</dt><dd>${escapeHtml(superadminData.health?.backend_setup_status || "-")}</dd></dl></section>`;
}

function renderSuperadminViews() {
  renderSuperadminDashboard();
  renderSuperadminClinicsTable();
  renderSuperadminUsersTable();
  renderSuperadminAuditTable();
  renderSuperadminClinicDetail();
  renderSuperadminPreparedPanels();
}

function superadminRowsForExport() {
  if (superadminActiveModule === "users") {
    return filteredSuperadminUsers().map((user) => ({ nombre: user.name, email: user.email, clinica: user.clinic_name || "", rol: user.role || "", activo: user.active ? "si" : "no", ultimo_acceso: formatSuperadminDate(user.last_access_at) }));
  }
  if (superadminActiveModule === "audit") {
    return filteredSuperadminAudit().map((item) => ({ fecha: formatSuperadminDate(item.created_at), clinica: item.clinic_name || item.clinic_id || "Plataforma", usuario: item.user_email || item.user_name || "", accion: item.action, recurso: item.resource_type || "", resultado: item.result || "", origen: item.origin || "" }));
  }
  return filteredSuperadminClinics().map((clinic) => ({ clinica: clinic.name, email: clinic.email || "", estado: superadminStatusLabel(clinic.subscription_status), plan: clinic.subscription_plan || "", usuarios: clinic.users_count || 0, origen: clinic.source || "backend" }));
}

function exportSuperadminCsv() {
  const rows = superadminRowsForExport();
  if (!rows.length) {
    showToast("No hay datos para exportar.", "warning");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`).join(";"))
  ].join("\n");
  downloadTextFile(`superadmin-${superadminActiveModule}-${todayIso()}.csv`, csv, "text/csv");
}

async function loadSuperadminPanel() {
  const token = superadminToken();
  if (!token) return;
  const form = $("#superadmin-filter-form");
  const params = new URLSearchParams();
  const clinicId = form?.elements.clinicId?.value || "";
  const action = form?.elements.action?.value.trim() || "";
  const dateFrom = form?.elements.dateFrom?.value || "";
  const dateTo = form?.elements.dateTo?.value || "";
  if (clinicId) params.set("clinic_id", clinicId);
  if (action) params.set("action", action);
  if (dateFrom) params.set("date_from", `${dateFrom}T00:00:00`);
  if (dateTo) params.set("date_to", `${dateTo}T23:59:59`);

  try {
    const [overview, backendClinics, users, audit, plans, health] = await Promise.all([
      backendRequest("/superadmin/overview", { token, auth: false }),
      backendRequest("/superadmin/clinics", { token, auth: false }),
      backendRequest(`/superadmin/users${clinicId ? `?clinic_id=${encodeURIComponent(clinicId)}` : ""}`, { token, auth: false }),
      backendRequest(`/superadmin/audit-log${params.toString() ? `?${params.toString()}` : ""}`, { token, auth: false }),
      backendRequest("/billing/plans", { auth: false }).catch(() => []),
      backendRequest("/health", { auth: false }).catch(() => null)
    ]);
    const clinics = mergeSuperadminClinics(backendClinics);
    const localClinics = clinics.filter((clinic) => clinic.source === "local");
    superadminData = { overview, clinics, backendClinics, users, audit, plans, health };
    if (!selectedSuperadminClinicId || !clinics.some((clinic) => String(clinic.id) === String(selectedSuperadminClinicId))) {
      selectedSuperadminClinicId = clinics[0]?.id || "";
    }
    const localSyncNote = $("#superadmin-local-sync-note");
    if (localSyncNote) {
      if (localClinics.length) {
        localSyncNote.textContent = `${localClinics.length} clinica${localClinics.length === 1 ? "" : "s"} aparece${localClinics.length === 1 ? "" : "n"} solo en este navegador porque se creo antes de quedar enlazada al backend. Se muestra${localClinics.length === 1 ? "" : "n"} como pendiente${localClinics.length === 1 ? "" : "s"} para no perder visibilidad, pero no tendra${localClinics.length === 1 ? "" : "n"} auditoria completa hasta migrarla${localClinics.length === 1 ? "" : "s"} a PostgreSQL.`;
        localSyncNote.classList.remove("hidden");
      } else {
        localSyncNote.textContent = "";
        localSyncNote.classList.add("hidden");
      }
    }

    const clinicFilter = $("#superadmin-clinic-filter");
    if (clinicFilter) {
      const previousValue = clinicFilter.value || clinicId;
      clinicFilter.innerHTML = `<option value="">Todas las clinicas backend</option>${backendClinics.map((clinic) => `<option value="${escapeHtml(clinic.id)}">${escapeHtml(clinic.name)}</option>`).join("")}`;
      clinicFilter.value = previousValue;
    }
    renderSuperadminViews();
  } catch (error) {
    showToast(`No se pudo cargar el panel superadmin: ${error.message}`, "error");
  }
}

function enterSuperadmin(session, me, options = {}) {
  superadminSession = {
    ...session,
    user: me?.user || null
  };
  if (options.persist !== false) {
    saveSuperadminSession(superadminSession, me);
  }
  isAuthenticated = false;
  saveState("authenticated", false);
  document.body.classList.add("login-mode");
  showPublicView("superadmin", { updateHash: true, resetLogin: false });
  loadSuperadminPanel();
}

async function ensureBackendLoginForAccount(account, password) {
  if (!account || account.key === demoClinicKey || backendTokenForAccount(account) || !password) {
    return;
  }
  try {
    const session = await backendRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: ownerEmailForAccount(account) || account.email,
        password,
        clinic_id: account.backendClinicId || undefined,
        clinic_email: account.email || undefined
      })
    });
    saveBackendSessionForAccount(account.key, session);
  } catch {
    // El acceso local se mantiene aunque el backend aun no este enlazado en este navegador.
  }
}

async function createBackendUserIfAvailable(payload) {
  const account = currentClinicAccount();
  if (!backendTokenForAccount(account)) {
    return null;
  }
  try {
    return await backendRequest("/users", {
      method: "POST",
      account,
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (error.status !== 409) {
      throw error;
    }
    const users = await backendRequest("/users", { account });
    const existing = (Array.isArray(users) ? users : []).find((user) => String(user.email || "").toLowerCase() === String(payload.email || "").toLowerCase());
    if (!existing) {
      throw error;
    }
    return backendRequest(`/users/${existing.id}`, {
      method: "PATCH",
      account,
      body: JSON.stringify(payload)
    });
  }
}

function persistLoginCredentials(form, identifier, password) {
  if (form.elements.remember.checked) {
    saveState("saved-login-credentials", {
      center: identifier,
      password
    });
  } else {
    forgetSavedLoginCredentials();
  }
}

function setInlineError(selector, message = "") {
  const error = $(selector);
  if (!error) return;
  error.textContent = message;
  error.classList.toggle("visible", Boolean(message));
}

function clearLoginErrors() {
  setInlineError("#login-error");
  setInlineError("#profile-login-error");
}

function showLoginError(message, field = null) {
  setInlineError("#login-error", message);
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

function showProfileLoginError(message, field = null) {
  setInlineError("#profile-login-error", message);
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

function backendProfileForUser(user = {}) {
  if (user.role === "practitioner") {
    return user.practitioner_id || user.practitionerId || "practitioner";
  }
  return user.role || "owner";
}

function backendLoginMessage(error) {
  if (error?.status === 401) {
    return "Usuario o contraseña incorrectos.";
  }
  if (error?.status === 409) {
    return "Ese email existe en mas de una clinica. Entra usando el email de la clinica o selecciona la clinica guardada.";
  }
  if (error?.status === 422) {
    return "El acceso no se ha enviado con el formato correcto. Actualiza la pagina y vuelve a intentarlo.";
  }
  if (String(error?.message || "").toLowerCase().includes("failed to fetch")) {
    return "No se pudo conectar con el servidor de Klinia. Revisa la conexion y actualiza la pagina.";
  }
  return error?.message || "No se pudo comprobar el acceso con el backend.";
}

async function tryBackendLogin(identifier, password, options = {}) {
  const cleanIdentifier = String(identifier || "").trim();
  if (!cleanIdentifier || !password) {
    return { handled: false, error: null };
  }
  try {
    const session = await backendRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: cleanIdentifier,
        password,
        clinic_id: options.clinicId || options.account?.backendClinicId || undefined,
        clinic_email: options.clinicEmail || options.account?.email || undefined
      })
    });
    const me = await backendRequest("/me", { token: session.access_token, auth: false });
    if (me?.user?.role === "superadmin") {
      enterSuperadmin(session, me);
      return { handled: true, session, me };
    }
    const accountKey = options.account?.key || slugifyClinicName(me?.clinic?.name || session.clinic_id || cleanIdentifier);
    const nextAccount = {
      ...(options.account || {}),
      key: accountKey,
      name: me?.clinic?.name || options.account?.name || "Clinica Klinia",
      email: me?.clinic?.email || options.account?.email || cleanIdentifier,
      phone: me?.clinic?.phone || options.account?.phone || "",
      password: options.account?.password || "",
      ownerEmail: me?.user?.role === "owner" ? me.user.email : (options.account?.ownerEmail || me?.clinic?.email || cleanIdentifier),
      ownerPassword: options.account?.ownerPassword || "",
      paymentPlan: normalizeSaasPlanId(me?.clinic?.subscription_plan || options.account?.paymentPlan || "trial"),
      subscriptionStatus: session.subscription_status || me?.clinic?.subscription_status || options.account?.subscriptionStatus || "trialing",
      billingStatus: session.subscription_status || me?.clinic?.subscription_status || options.account?.billingStatus || "trialing",
      trialEndsAt: (me?.clinic?.trial_ends_at || options.account?.trialEndsAt || "").slice(0, 10) || addDaysIso(todayIso(), 30),
      backendToken: session.access_token,
      backendClinicId: session.clinic_id || me?.clinic?.id || options.account?.backendClinicId || "",
      billingProfile: {
        ...(options.account?.billingProfile || {}),
        billingName: me?.clinic?.billing_name || me?.clinic?.name || options.account?.billingProfile?.billingName || "",
        billingEmail: me?.clinic?.billing_email || me?.clinic?.email || options.account?.billingProfile?.billingEmail || "",
        taxId: me?.clinic?.tax_id || options.account?.billingProfile?.taxId || "",
        billingAddress: me?.clinic?.billing_address || options.account?.billingProfile?.billingAddress || ""
      }
    };
    ensureClinicAccount(nextAccount);
    renderLoginClinics();
    enterPlatform(backendProfileForUser(me?.user), accountKey);
    return { handled: true, session, me, account: nextAccount };
  } catch (error) {
    return { handled: false, error };
  }
}

function apiPatientToUi(patient, previous = {}) {
  const meta = parseBackendMetadata(patient.metadata_json);
  return {
    ...previous,
    ...meta,
    id: patient.id,
    name: patient.name || meta.name || `${meta.firstName || ""} ${meta.lastName || ""}`.trim(),
    phone: patient.phone || "",
    email: patient.email || "",
    last: "API",
    status: patient.status || (patient.active ? "Activo" : "Inactivo"),
    alert: patient.alert || patient.internal_alert || "Sin alertas relevantes"
  };
}

function uiPatientToApi(patient) {
  return {
    name: patient.name,
    phone: patient.phone && patient.phone !== "No indicado" ? patient.phone : null,
    email: patient.email || null,
    alert: patient.alert || null,
    status: patient.status || "Activo",
    metadata_json: backendMetadataJson(patient, ["name", "phone", "email", "alert", "status", "last"])
  };
}

function apiPractitionerToUi(practitioner, previous = {}) {
  const meta = parseBackendMetadata(practitioner.metadata_json);
  return {
    ...previous,
    ...meta,
    id: practitioner.id,
    name: practitioner.name || meta.name || "Trabajador",
    specialty: practitioner.specialty || meta.specialty || "",
    color: practitioner.color || meta.color || "#168776",
    commissionRate: Number(practitioner.commission_rate || 0),
    target: Math.round(Number(practitioner.monthly_target_cents || 0) / 100),
    availabilityStart: practitioner.availability_start || meta.availabilityStart || "08:00",
    availabilityEnd: practitioner.availability_end || meta.availabilityEnd || "14:00",
    availabilityStart2: practitioner.availability_start_2 || meta.availabilityStart2 || "",
    availabilityEnd2: practitioner.availability_end_2 || meta.availabilityEnd2 || "",
    active: practitioner.active !== false
  };
}

function uiPractitionerToApi(practitioner) {
  return {
    name: practitioner.name,
    specialty: practitioner.specialty || null,
    color: practitioner.color || "#168776",
    commission_rate: Number(practitioner.commissionRate || 0),
    monthly_target_cents: Math.round(Number(practitioner.target || 0) * 100),
    availability_start: practitioner.availabilityStart || "08:00",
    availability_end: practitioner.availabilityEnd || "14:00",
    availability_start_2: practitioner.availabilityStart2 || null,
    availability_end_2: practitioner.availabilityEnd2 || null,
    active: practitioner.active !== false,
    metadata_json: backendMetadataJson(practitioner, ["name", "specialty", "color", "commissionRate", "target", "availabilityStart", "availabilityEnd", "availabilityStart2", "availabilityEnd2", "active"])
  };
}

function apiServiceToUi(service) {
  return {
    id: service.id,
    name: service.name,
    description: service.description || "",
    duration: service.duration_minutes,
    price: Math.round(service.price_cents / 100),
    type: service.type || "individual",
    capacity: service.capacity || 1,
    monthlyPrice: Math.round(Number(service.monthly_price_cents || 0) / 100),
    dropInPrice: Math.round(Number(service.drop_in_price_cents || 0) / 100),
    commissionPerPatient: Number(service.commission_per_patient || 0),
    active: service.active
  };
}

function uiServiceToApi(input) {
  if (!input?.elements) {
    const service = input || {};
    return {
      name: service.name,
      description: service.description || null,
      duration_minutes: Number(service.duration || 60),
      price_cents: Math.round(Number(service.price || 0) * 100),
      type: service.type || "individual",
      capacity: Number(service.capacity || 1),
      monthly_price_cents: Math.round(Number(service.monthlyPrice || 0) * 100),
      drop_in_price_cents: Math.round(Number(service.dropInPrice || 0) * 100),
      commission_per_patient: Number(service.commissionPerPatient || 0),
      active: service.active !== false
    };
  }
  const form = input;
  const serviceType = form.elements.groupSession?.checked ? "group" : "individual";
  return {
    name: form.elements.name.value.trim(),
    description: form.elements.description.value.trim() || null,
    duration_minutes: Number(form.elements.duration.value),
    price_cents: (serviceType === "group"
      ? Number(form.elements.dropInPrice?.value || form.elements.monthlyPrice?.value || 0)
      : Number(form.elements.price.value)) * 100,
    type: serviceType,
    capacity: Number(form.elements.capacity?.value || 1),
    monthly_price_cents: Number(form.elements.monthlyPrice?.value || 0) * 100,
    drop_in_price_cents: Number(form.elements.dropInPrice?.value || 0) * 100,
    commission_per_patient: parseDecimal(form.elements.commissionPerPatient?.value, 0),
    active: form.elements.active.checked
  };
}

function apiRoomToUi(room) {
  return {
    id: room.id,
    name: room.name,
    type: room.type || "",
    active: room.active !== false
  };
}

function uiRoomToApi(input) {
  if (!input?.elements) {
    const room = input || {};
    return {
      name: room.name,
      type: room.type || null,
      active: room.active !== false
    };
  }
  return {
    name: input.elements.name.value.trim(),
    type: input.elements.type.value.trim() || null,
    active: true
  };
}

function apiAppointmentToUi(appointment, previous = {}) {
  const meta = parseBackendMetadata(appointment.metadata_json);
  return {
    ...previous,
    ...meta,
    id: appointment.id,
    date: appointment.date || meta.date || selectedDate,
    patientId: appointment.patient_id,
    practitionerId: appointment.practitioner_id,
    roomId: appointment.room_id,
    serviceId: appointment.service_id,
    start: appointment.start || meta.start || "12:00",
    end: appointment.end || meta.end || "",
    status: appointment.status,
    internalNotes: appointment.internal_notes || ""
  };
}

function uiAppointmentToApi(candidate) {
  return {
    patient_id: candidate.patientId,
    practitioner_id: candidate.practitionerId,
    room_id: candidate.roomId,
    service_id: candidate.serviceId,
    date: candidate.date || selectedDate,
    start: candidate.start,
    end: candidate.end || appointmentEnd(candidate),
    status: candidate.status,
    internal_notes: candidate.internalNotes || null,
    metadata_json: backendMetadataJson(candidate, ["patientId", "practitionerId", "roomId", "serviceId", "date", "start", "end", "status", "internalNotes"])
  };
}

async function savePatientToBackend(patient, previousId = "") {
  if (!backendDataEnabled()) return patient;
  const { method, path } = backendWriteTarget("/patients", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiPatientToApi(patient))
  });
  return apiPatientToUi(saved, patient);
}

async function deletePatientFromBackend(patientId) {
  if (!backendDataEnabled() || !looksLikeBackendId(patientId)) return;
  await backendRequest(`/patients/${encodeURIComponent(patientId)}`, { method: "DELETE" });
}

async function savePractitionerToBackend(practitioner, previousId = "") {
  if (!backendDataEnabled()) return practitioner;
  const { method, path } = backendWriteTarget("/practitioners", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiPractitionerToApi(practitioner))
  });
  return apiPractitionerToUi(saved, practitioner);
}

async function deletePractitionerFromBackend(practitionerId) {
  if (!backendDataEnabled() || !looksLikeBackendId(practitionerId)) return;
  await backendRequest(`/practitioners/${encodeURIComponent(practitionerId)}`, { method: "DELETE" });
}

async function saveRoomToBackend(room, previousId = "") {
  if (!backendDataEnabled()) return room;
  const { method, path } = backendWriteTarget("/rooms", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiRoomToApi(room))
  });
  return apiRoomToUi(saved);
}

async function deleteRoomFromBackend(roomId) {
  if (!backendDataEnabled() || !looksLikeBackendId(roomId)) return;
  await backendRequest(`/rooms/${encodeURIComponent(roomId)}`, { method: "DELETE" });
}

async function saveServiceToBackend(service, previousId = "") {
  if (!backendDataEnabled()) return service;
  const { method, path } = backendWriteTarget("/services", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiServiceToApi(service))
  });
  return apiServiceToUi(saved);
}

async function deleteServiceFromBackend(serviceId) {
  if (!backendDataEnabled() || !looksLikeBackendId(serviceId)) return;
  await backendRequest(`/services/${encodeURIComponent(serviceId)}`, { method: "DELETE" });
}

async function saveAppointmentToBackend(appointment, previousId = "") {
  if (!backendDataEnabled()) return appointment;
  const { method, path } = backendWriteTarget("/appointments", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiAppointmentToApi(appointment))
  });
  return apiAppointmentToUi(saved, appointment);
}

async function uploadLocalCollectionToBackend(localItems, saveItem) {
  const items = [];
  const idMap = new Map();
  for (const item of localItems) {
    const saved = await saveItem(item, "");
    if (item?.id && saved?.id) {
      idMap.set(String(item.id), saved.id);
    }
    items.push(saved);
  }
  return { items, idMap };
}

function remapId(value, idMap) {
  return idMap.get(String(value || "")) || value;
}

function remapBackendReferences(maps) {
  const hasPatientMap = maps.patients.size > 0;
  const hasPractitionerMap = maps.practitioners.size > 0;
  const hasRoomMap = maps.rooms.size > 0;
  const hasServiceMap = maps.services.size > 0;
  if (!hasPatientMap && !hasPractitionerMap && !hasRoomMap && !hasServiceMap) {
    return;
  }
  appointments = appointments.map((appointment) => ({
    ...appointment,
    patientId: remapId(appointment.patientId, maps.patients),
    practitionerId: remapId(appointment.practitionerId, maps.practitioners),
    roomId: remapId(appointment.roomId, maps.rooms),
    serviceId: remapId(appointment.serviceId, maps.services)
  }));
  groups = groups.map((group) => ({
    ...group,
    practitionerId: remapId(group.practitionerId, maps.practitioners),
    roomId: remapId(group.roomId, maps.rooms),
    serviceId: remapId(group.serviceId, maps.services),
    patientIds: (group.patientIds || []).map((patientId) => remapId(patientId, maps.patients))
  }));
  clinicalNotes = clinicalNotes.map((note) => ({
    ...note,
    patientId: remapId(note.patientId, maps.patients)
  }));
  patientConsents = patientConsents.map((consent) => ({
    ...consent,
    patientId: remapId(consent.patientId, maps.patients)
  }));
  patientPacks = patientPacks.map((pack) => ({
    ...pack,
    patientId: remapId(pack.patientId, maps.patients),
    serviceId: remapId(pack.serviceId, maps.services)
  }));
  availabilityBlocks = availabilityBlocks.map((block) => ({
    ...block,
    practitionerId: remapId(block.practitionerId, maps.practitioners)
  }));
  groupSessionOverrides = groupSessionOverrides.map((override) => ({
    ...override,
    practitionerId: remapId(override.practitionerId, maps.practitioners)
  }));
  if (selectedPatientId) {
    selectedPatientId = remapId(selectedPatientId, maps.patients);
  }
  if (currentSession?.practitionerId) {
    currentSession = {
      ...currentSession,
      practitionerId: remapId(currentSession.practitionerId, maps.practitioners)
    };
    saveState("session", currentSession);
  }
  saveClinicState("appointments", appointments);
  saveClinicState("groups", groups);
  saveClinicState("clinical-notes", clinicalNotes);
  saveClinicState("patient-consents", patientConsents);
  saveClinicState("patient-packs", patientPacks);
  saveClinicState("availability-blocks", availabilityBlocks);
  saveClinicState("group-session-overrides", groupSessionOverrides);
}

function appointmentWithBackendReferences(appointment, maps) {
  const end = appointment.end || appointmentEnd(appointment);
  return {
    ...appointment,
    end,
    patientId: remapId(appointment.patientId, maps.patients),
    practitionerId: remapId(appointment.practitionerId, maps.practitioners),
    roomId: remapId(appointment.roomId, maps.rooms),
    serviceId: remapId(appointment.serviceId, maps.services)
  };
}

function appointmentCanSyncToBackend(appointment) {
  return looksLikeBackendId(appointment.patientId)
    && looksLikeBackendId(appointment.practitionerId)
    && looksLikeBackendId(appointment.roomId)
    && looksLikeBackendId(appointment.serviceId)
    && Boolean(appointment.date && appointment.start);
}

async function bootstrapBackendDataIfNeeded(apiData) {
  const maps = {
    patients: new Map(),
    practitioners: new Map(),
    rooms: new Map(),
    services: new Map()
  };
  let { apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments } = apiData;

  if (!apiPatients.length && patients.length) {
    const uploaded = await uploadLocalCollectionToBackend(patients, savePatientToBackend);
    apiPatients = uploaded.items;
    maps.patients = uploaded.idMap;
  }
  if (!apiPractitioners.length && practitioners.length) {
    const uploaded = await uploadLocalCollectionToBackend(practitioners, savePractitionerToBackend);
    apiPractitioners = uploaded.items;
    maps.practitioners = uploaded.idMap;
  }
  if (!apiRooms.length && rooms.length) {
    const uploaded = await uploadLocalCollectionToBackend(rooms, saveRoomToBackend);
    apiRooms = uploaded.items;
    maps.rooms = uploaded.idMap;
  }
  if (!apiServices.length && services.length) {
    const uploaded = await uploadLocalCollectionToBackend(services, saveServiceToBackend);
    apiServices = uploaded.items;
    maps.services = uploaded.idMap;
  }

  remapBackendReferences(maps);

  if (!apiAppointments.length && appointments.length) {
    const readyAppointments = appointments
      .map((appointment) => appointmentWithBackendReferences(appointment, maps))
      .filter(appointmentCanSyncToBackend);
    if (readyAppointments.length === appointments.length) {
      const uploaded = await uploadLocalCollectionToBackend(readyAppointments, saveAppointmentToBackend);
      apiAppointments = uploaded.items;
    }
  }

  return { apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments };
}

function minutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function addMinutes(time, amount) {
  const total = minutes(time) + amount;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function minutesBetween(start, end) {
  return Math.max(0, minutes(end) - minutes(start));
}

function overlappingMinutes(firstStart, firstEnd, secondStart, secondEnd) {
  const start = Math.max(minutes(firstStart), minutes(secondStart));
  const end = Math.min(minutes(firstEnd), minutes(secondEnd));
  return Math.max(0, end - start);
}

function parseDecimal(value, fallback = 0) {
  const normalized = String(value ?? "").trim().replace(",", ".");
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
  if (subscriptionUseBlocked()) {
    return section === "suscripcion" && isOwner();
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

function datesInRange(start, end) {
  const days = [];
  for (let cursor = start; cursor <= end; cursor = addDaysIso(cursor, 1)) {
    days.push(cursor);
  }
  return days;
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

function capitalizeFirst(value) {
  const text = String(value || "");
  return text ? `${text.charAt(0).toLocaleUpperCase("es-ES")}${text.slice(1)}` : "";
}

function formatMonthYear(value) {
  return capitalizeFirst(new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(dateOnly(value)));
}

function formatMonthName(value) {
  return capitalizeFirst(new Intl.DateTimeFormat("es-ES", { month: "long" }).format(dateOnly(value)));
}

function calendarRange() {
  if (calendarMode === "day") {
    return { start: selectedDate, end: selectedDate };
  }
  if (calendarMode === "week") {
    const start = weekStartIso(selectedDate);
    return { start, end: addDaysIso(start, 6) };
  }
  return { start: monthStartIso(selectedDate), end: monthEndIso(addMonthsIso(selectedDate, 1)) };
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
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    pending: "Confirmada",
    completed: "Confirmada",
    no_show: "Cancelada"
  }[status] || status;
}

function normalizeAppointmentStatus(status) {
  return ["cancelled", "no_show"].includes(status) ? "cancelled" : "confirmed";
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

function patientPackUnitValue(pack) {
  const sessions = Math.max(1, Number(pack?.sessions || 1));
  const price = Number(pack?.price || 0);
  return Math.round((price / sessions) * 100) / 100;
}

function appointmentRevenueAmount(appointment) {
  const packId = appointment?.patientPackId || appointment?.plannedPatientPackId || "";
  if (packId) {
    const pack = byId(patientPacks, packId);
    const unitValue = patientPackUnitValue(pack);
    if (unitValue > 0) {
      return unitValue;
    }
    const service = byId(services, appointment.serviceId);
    return Number(service?.price || 0);
  }
  return servicePrice(appointment);
}

function appointmentPaymentStatus(appointment) {
  const status = appointment?.paymentStatus || appointment?.paymentMethod || "";
  if (["cash", "card", "unpaid"].includes(status)) {
    return status;
  }
  return appointment?.invoiceGenerated ? "card" : "unpaid";
}

function paymentStatusLabel(value) {
  return {
    cash: "Efectivo",
    card: "Tarjeta",
    unpaid: "No cobrada"
  }[value] || "No cobrada";
}

function serviceCommissionAmount(appointment, practitioner) {
  const service = byId(services, appointment.serviceId);
  const revenue = appointmentRevenueAmount(appointment);
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

function patientPackCounters(pack) {
  return {
    sessions: Math.max(0, Number(pack?.sessions || 0)),
    used: Math.max(0, Number(pack?.used || 0)),
    remaining: patientPackRemaining(pack || {})
  };
}

function isPatientPackExpired(pack) {
  return Boolean(pack?.expiresAt && pack.expiresAt < todayIso());
}

function patientPackExpiryLabel(pack) {
  if (!pack?.expiresAt) {
    return "Sin caducidad";
  }
  return `${isPatientPackExpired(pack) ? "Caducado" : "Caduca"} ${formatShortDate(pack.expiresAt)}`;
}

function sessionPackExpiryDate(pack) {
  const months = Number(pack?.expiryMonths || 0);
  return months > 0 ? addMonthsIso(todayIso(), months) : "";
}

function patientPackActualUsedCount(pack) {
  if (!pack?.id) {
    return 0;
  }
  return appointments.filter((appointment) => (
    appointment.patientPackId === pack.id
      && normalizeAppointmentStatus(appointment.status) === "confirmed"
  )).length;
}

function syncPatientPackUsageFromAppointments(options = {}) {
  let changed = false;
  patientPacks = patientPacks.map((pack) => {
    const actualUsed = Math.min(Math.max(0, Number(pack.sessions || 0)), patientPackActualUsedCount(pack));
    if (Number(pack.used || 0) === actualUsed) {
      return pack;
    }
    changed = true;
    return { ...pack, used: actualUsed, updatedAt: new Date().toISOString(), usageSource: "appointments" };
  });
  if (changed && options.persist) {
    saveClinicState("patient-packs", patientPacks);
  }
  return changed;
}

function patientPackLockKey(packId) {
  return `klinia:${clinicStateKey("patient-pack-lock")}:${packId}`;
}

function readJsonStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function acquirePatientPackLock(packId) {
  if (!packId || patientPackConsumptionLocks.has(packId)) {
    return null;
  }
  const key = patientPackLockKey(packId);
  const now = Date.now();
  const existing = readJsonStorage(key);
  if (existing?.token && now - Number(existing.createdAt || 0) < patientPackStorageLockTtlMs) {
    return null;
  }
  const token = `${now}-${Math.random().toString(36).slice(2)}`;
  patientPackConsumptionLocks.add(packId);
  localStorage.setItem(key, JSON.stringify({ token, createdAt: now }));
  const stored = readJsonStorage(key);
  if (stored?.token !== token) {
    patientPackConsumptionLocks.delete(packId);
    return null;
  }
  return { key, packId, token };
}

function releasePatientPackLock(lock) {
  if (!lock) {
    return;
  }
  patientPackConsumptionLocks.delete(lock.packId);
  const stored = readJsonStorage(lock.key);
  if (stored?.token === lock.token) {
    localStorage.removeItem(lock.key);
  }
}

function refreshPatientPacksForTransaction() {
  patientPacks = normalizePatientPacks(loadClinicState("patient-packs", patientPacks));
}

function validatePatientPackConsumption(pack, context = {}) {
  if (!pack) {
    return "El bono seleccionado no existe o ya no esta asignado al paciente.";
  }
  if (context.patientId && pack.patientId !== context.patientId) {
    return "El bono seleccionado pertenece a otro paciente.";
  }
  if (context.serviceId && pack.serviceId && pack.serviceId !== context.serviceId) {
    return `Este bono solo es aplicable a ${packServiceLabel(pack)}.`;
  }
  const counters = patientPackCounters(pack);
  if (counters.sessions <= 0) {
    return "Este bono no tiene sesiones configuradas.";
  }
  if (counters.used >= counters.sessions) {
    return `El bono ${pack.name || ""} esta agotado: ${counters.used}/${counters.sessions} sesiones consumidas. No se puede descontar otra sesion.`;
  }
  if (isPatientPackExpired(pack)) {
    return `El bono ${pack.name || ""} esta caducado desde ${formatShortDate(pack.expiresAt)}.`;
  }
  return "";
}

function consumePatientPackTransaction(packId, context = {}) {
  const lock = acquirePatientPackLock(packId);
  if (!lock) {
    return {
      ok: false,
      code: "busy",
      message: "Ya hay un consumo de este bono en curso. Espera un momento y revisa el saldo antes de intentarlo de nuevo."
    };
  }

  try {
    refreshPatientPacksForTransaction();
    const pack = byId(patientPacks, packId);
    const validationMessage = validatePatientPackConsumption(pack, context);
    if (validationMessage) {
      return { ok: false, code: "blocked", message: validationMessage, pack };
    }

    const counters = patientPackCounters(pack);
    const consumedAt = new Date().toISOString();
    const updatedPack = {
      ...pack,
      used: counters.used + 1,
      updatedAt: consumedAt,
      lastConsumedAt: consumedAt,
      lastConsumedBy: currentSessionName(),
      lastConsumptionSource: context.source || "manual",
      lastAppointmentId: context.appointmentId || pack.lastAppointmentId || ""
    };
    patientPacks = patientPacks.map((item) => item.id === packId ? updatedPack : item);
    saveClinicState("patient-packs", patientPacks);
    return {
      ok: true,
      pack: updatedPack,
      consumedAt,
      remaining: Math.max(0, counters.sessions - counters.used - 1)
    };
  } finally {
    releasePatientPackLock(lock);
  }
}

function patientPacksForAppointment(appointment) {
  return patientPacks.filter((pack) => (
    pack.patientId === appointment.patientId
      && patientPackRemaining(pack) > 0
      && !isPatientPackExpired(pack)
      && (!pack.serviceId || pack.serviceId === appointment.serviceId)
  ));
}

function usePatientPackForAppointment(appointment, packId) {
  if (!packId) {
    return { ok: false, code: "missing", message: "Selecciona un bono para consumir." };
  }
  return consumePatientPackTransaction(packId, {
    patientId: appointment.patientId,
    serviceId: appointment.serviceId,
    appointmentId: appointment.id,
    source: "appointment"
  });
}

function restorePatientPackUse(packId) {
  if (!packId) {
    return;
  }
  refreshPatientPacksForTransaction();
  patientPacks = patientPacks.map((item) => item.id === packId
    ? { ...item, used: Math.max(0, Number(item.used || 0) - 1), updatedAt: new Date().toISOString() }
    : item
  );
  saveClinicState("patient-packs", patientPacks);
}

const weekDayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekDayLabels = { mon: "Lunes", tue: "Martes", wed: "Miercoles", thu: "Jueves", fri: "Viernes", sat: "Sabado", sun: "Domingo" };
const registerDayKeyMap = { lun: "mon", mar: "tue", mie: "wed", jue: "thu", vie: "fri", sab: "sat", dom: "sun" };
const defaultWorkingDays = ["mon", "tue", "wed", "thu", "fri"];

function normalizeWorkingDayKey(value) {
  const key = String(value || "").trim().toLowerCase();
  return registerDayKeyMap[key] || (weekDayLabels[key] ? key : "");
}

function clinicWorkingDays() {
  const normalized = (Array.isArray(clinic?.workingDays) ? clinic.workingDays : defaultWorkingDays)
    .map(normalizeWorkingDayKey)
    .filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : [...defaultWorkingDays];
}

function clinicWorksOnDate(dateValue) {
  return clinicWorkingDays().includes(dayKeyFor(dateValue));
}

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

function groupOccurrenceDatesInRange(group, start, end) {
  return datesInRange(start, end).filter((dateValue) => groupOccursOnDate(group, dateValue));
}

function groupExpectedSessionsInMonth(group, dateValue = selectedDate) {
  const start = monthStartIso(dateValue);
  const end = monthEndIso(dateValue);
  return Math.max(1, groupOccurrenceDatesInRange(group, start, end).length);
}

function groupSessionOverrideFor(groupId, dateValue) {
  return groupSessionOverrides.find((item) => item.groupId === groupId && item.date === dateValue);
}

function groupInstanceForDate(group, dateValue) {
  const override = groupSessionOverrideFor(group.id, dateValue);
  const overrideIsValid = override
    && practitioners.some((practitioner) => practitioner.id === override.practitionerId)
    && /^\d{2}:\d{2}$/.test(String(override.start || ""));
  return {
    ...group,
    practitionerId: overrideIsValid ? override.practitionerId : group.practitionerId,
    start: overrideIsValid ? override.start : group.start,
    date: dateValue,
    sessionOverrideId: overrideIsValid ? override.id : "",
    sessionOverride: overrideIsValid ? override : null
  };
}

function groupBaseById(groupId) {
  return groups.find((item) => item.id === groupId);
}

function groupsForDate(dateValue) {
  return groups
    .filter((group) => groupOccursOnDate(group, dateValue))
    .map((group) => groupInstanceForDate(group, dateValue));
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
  const expectedSessionsInMonth = groupExpectedSessionsInMonth(group, dateValue);
  const fixedSessionRevenue = Math.round(fixedMonthlyRevenue / expectedSessionsInMonth);
  const dropinRevenue = dropinCount * pricing.dropInPrice;
  const revenue = fixedSessionRevenue + dropinRevenue;
  const payout = Math.round(revenue * (pricing.commissionPerPatient / 100));
  return { attendees, fixedCount, dropinCount, fixedMonthlyRevenue, fixedSessionRevenue, expectedSessionsInMonth, dropinRevenue, revenue, payout };
}

function syncGroupCompletionForSession(group, dateValue = selectedDate) {
  if (!groupCompletionFor(group, dateValue)) {
    return;
  }
  const production = groupSessionProduction(group, dateValue);
  groupCompletions = groupCompletions.map((entry) => (
    entry.groupId === group.id && entry.date === dateValue
      ? {
          ...entry,
          practitionerId: group.practitionerId,
          roomId: group.roomId,
          serviceId: group.serviceId,
          start: group.start,
          attendees: production.attendees,
          fixedCount: production.fixedCount,
          dropinCount: production.dropinCount,
          fixedMonthlyRevenue: production.fixedMonthlyRevenue,
          fixedSessionRevenue: production.fixedSessionRevenue,
          expectedSessionsInMonth: production.expectedSessionsInMonth,
          dropinRevenue: production.dropinRevenue,
          revenue: production.revenue,
          payout: production.payout
        }
      : entry
  ));
  saveClinicState("group-completions", groupCompletions);
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

function isOutsidePractitionerHours(practitioner, start, end = start, dateValue = selectedDate) {
  if (dateValue && !clinicWorksOnDate(dateValue)) {
    return true;
  }
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

function availableMinutesForPractitionerDay(practitioner, dateValue) {
  if (!clinicWorksOnDate(dateValue)) {
    return 0;
  }
  const ranges = practitionerAvailabilityRanges(practitioner);
  const scheduledMinutes = ranges.reduce((total, [start, end]) => total + minutesBetween(start, end), 0);
  const blockedMinutes = availabilityBlocksFor(practitioner.id, dateValue).reduce((total, block) => {
    return total + ranges.reduce((rangeTotal, [start, end]) => {
      const blockStart = block.allDay ? start : (block.start || start);
      const blockEnd = block.allDay ? end : (block.end || end);
      return rangeTotal + overlappingMinutes(start, end, blockStart, blockEnd);
    }, 0);
  }, 0);
  return Math.max(0, scheduledMinutes - Math.min(scheduledMinutes, blockedMinutes));
}

function occupancyReportForRange(range = calendarRange()) {
  const visiblePractitioners = selectedAgendaPractitioners();
  const practitionerIds = new Set(visiblePractitioners.map((practitioner) => practitioner.id));
  const days = datesInRange(range.start, range.end);
  const availableMinutes = days.reduce((total, dateValue) => (
    total + visiblePractitioners.reduce((dayTotal, practitioner) => dayTotal + availableMinutesForPractitionerDay(practitioner, dateValue), 0)
  ), 0);
  const appointmentMinutes = appointments
    .filter((appointment) => isBlockingAppointmentStatus(appointment.status))
    .filter((appointment) => (appointment.date || selectedDate) >= range.start && (appointment.date || selectedDate) <= range.end)
    .filter((appointment) => practitionerIds.has(appointment.practitionerId))
    .filter(appointmentPassesAgendaFilters)
    .reduce((total, appointment) => total + (byId(services, appointment.serviceId)?.duration || 60), 0);
  const groupMinutes = days.reduce((total, dateValue) => (
    total + groupsForDate(dateValue)
      .filter((group) => practitionerIds.has(group.practitionerId))
      .filter(groupPassesAgendaFilters)
      .reduce((dayTotal, group) => dayTotal + (groupService(group)?.duration || 60), 0)
  ), 0);
  const bookedMinutes = appointmentMinutes + groupMinutes;
  return {
    bookedMinutes,
    availableMinutes,
    percent: availableMinutes ? Math.min(100, Math.round((bookedMinutes / availableMinutes) * 100)) : 0
  };
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

function groupSessionExceptionConflict(baseGroup, dateValue, candidate) {
  const service = groupService(baseGroup);
  const end = addMinutes(candidate.start, service?.duration || 60);
  const practitioner = byId(practitioners, candidate.practitionerId);
  if (isOutsidePractitionerHours(practitioner, candidate.start, end, dateValue)) {
    return "El horario elegido queda fuera de la jornada laboral del trabajador.";
  }
  const block = availabilityBlockFor(candidate.practitionerId, dateValue, candidate.start, end);
  if (block) {
    return `El trabajador tiene ${availabilityBlockLabel(block)}.`;
  }
  const appointmentConflict = appointments.find((appointment) => (
    isBlockingAppointmentStatus(appointment.status)
      && (appointment.date || selectedDate) === dateValue
      && (appointment.practitionerId === candidate.practitionerId || appointment.roomId === baseGroup.roomId)
      && overlaps(candidate.start, end, appointment.start, appointmentEnd(appointment))
  ));
  if (appointmentConflict) {
    return `Conflicto con ${byId(patients, appointmentConflict.patientId)?.name || "otra cita"} a las ${appointmentConflict.start}.`;
  }
  const groupConflict = groupsForDate(dateValue).find((group) => (
    group.id !== baseGroup.id
      && (group.practitionerId === candidate.practitionerId || group.roomId === baseGroup.roomId)
      && overlaps(candidate.start, end, group.start, groupEnd(group))
  ));
  if (groupConflict) {
    return `Conflicto con la sesion grupal ${groupConflict.name} a las ${groupConflict.start}.`;
  }
  return "";
}

function saveGroupSessionOverride(groupId, dateValue, values) {
  const baseGroup = groupBaseById(groupId);
  const practitionerId = values.practitionerId;
  const start = values.start;
  if (baseGroup && practitionerId === baseGroup.practitionerId && start === baseGroup.start) {
    clearGroupSessionOverride(groupId, dateValue);
    return;
  }
  const existing = groupSessionOverrideFor(groupId, dateValue);
  const next = {
    id: existing?.id || `group-override-${Date.now()}`,
    groupId,
    date: dateValue,
    basePractitionerId: existing?.basePractitionerId || baseGroup?.practitionerId || "",
    baseStart: existing?.baseStart || baseGroup?.start || "",
    practitionerId,
    start,
    updatedAt: new Date().toISOString(),
    updatedBy: currentSessionName()
  };
  groupSessionOverrides = existing
    ? groupSessionOverrides.map((item) => item.id === existing.id ? next : item)
    : [...groupSessionOverrides, next];
  saveClinicState("group-session-overrides", groupSessionOverrides);
}

function clearGroupSessionOverride(groupId, dateValue) {
  groupSessionOverrides = groupSessionOverrides.filter((item) => !(item.groupId === groupId && item.date === dateValue));
  saveClinicState("group-session-overrides", groupSessionOverrides);
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
  return normalizeAppointmentStatus(status) !== "cancelled";
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
  return !isOutsidePractitionerHours(practitioner, appointment.start, end, appointment.date || selectedDate)
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
      && !isPatientPackExpired(pack)
      && (!pack.serviceId || pack.serviceId === serviceId)
  ));
  select.innerHTML = "";
  select.append(new Option("No usar bono", ""));
  packs.forEach((pack) => select.append(new Option(`${pack.name} - ${patientPackRemaining(pack)} disponibles - ${patientPackExpiryLabel(pack)}`, pack.id)));
  field.classList.toggle("hidden", packs.length === 0);
}

function appointmentOutsideHoursMessage(form = $("#appointment-form")) {
  if (!form) {
    return "";
  }
  const practitioner = byId(practitioners, form.elements.practitioner?.value);
  const service = byId(services, form.elements.service?.value);
  const start = form.elements.start?.value;
  const dateValue = form.elements.date?.value || selectedDate;
  if (!practitioner || !start) {
    return "";
  }
  const end = addMinutes(start, service?.duration || 60);
  return isOutsidePractitionerHours(practitioner, start, end, dateValue)
    ? `Está creando una cita fuera de horario o fuera de los dias de atencion. Horario habitual: ${practitionerAvailabilityLabel(practitioner)}.`
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

function applyScheduleCellAvailability(cell, practitioner, dateValue, start, end, showAvailability = false) {
  const outsideHours = isOutsidePractitionerHours(practitioner, start, end, dateValue);
  const availabilityBlock = availabilityBlockFor(practitioner.id, dateValue, start, end);
  if (availabilityBlock) {
    cell.classList.add("availability-blocked-cell");
    cell.title = availabilityBlockLabel(availabilityBlock);
  }
  if (outsideHours || availabilityBlock) {
    cell.classList.add("outside-hours");
  }
  if (!showAvailability) {
    return availabilityBlock;
  }

  if (availabilityBlock) {
    cell.classList.add("absence-hours");
    cell.dataset.availabilityState = "absence";
    return availabilityBlock;
  }
  if (!outsideHours) {
    cell.classList.add("available-hours");
    cell.dataset.availabilityState = "available";
    cell.title = "Disponible en jornada laboral";
  } else {
    cell.dataset.availabilityState = "outside";
  }
  return availabilityBlock;
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
  schedule.classList.remove("two-month-schedule");

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
      cell.dataset.date = selectedDate;
      cell.dataset.hour = hour;
      const cellEnd = addMinutes(hour, 60);
      const singlePractitionerVisible = visiblePractitioners.length === 1;
      const availabilityBlock = applyScheduleCellAvailability(cell, practitioner, selectedDate, hour, cellEnd, singlePractitionerVisible);
      setupAppointmentDropTarget(cell, selectedDate, hour, practitioner.id);
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

function renderTwoMonthPlanner(schedule, range) {
  schedule.classList.add("two-month-schedule");
  schedule.style.gridTemplateColumns = "repeat(2, minmax(280px, 1fr))";
  const monthStarts = [range.start, addMonthsIso(range.start, 1)];
  monthStarts.forEach((monthStart) => {
    const monthEnd = monthEndIso(monthStart);
    const month = document.createElement("section");
    month.className = "two-month-panel";
    month.innerHTML = `
      <h3>${formatMonthYear(monthStart)}</h3>
      <div class="two-month-weekdays">
        ${["L", "M", "X", "J", "V", "S", "D"].map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="two-month-days"></div>
    `;
    const days = month.querySelector(".two-month-days");
    const firstDay = dateOnly(monthStart).getDay() || 7;
    for (let index = 1; index < firstDay; index += 1) {
      const spacer = document.createElement("span");
      spacer.className = "two-month-spacer";
      days.append(spacer);
    }
    for (let cursor = monthStart; cursor <= monthEnd; cursor = addDaysIso(cursor, 1)) {
      const dateValue = cursor;
      const count = appointments
        .filter((appointment) => (appointment.date || selectedDate) === dateValue)
        .filter((appointment) => isOwner() || appointment.practitionerId === currentSession.practitionerId)
        .filter(appointmentPassesAgendaFilters).length;
      const groupCount = groupsForDate(dateValue)
        .filter((group) => isOwner() || group.practitionerId === currentSession.practitionerId)
        .filter(groupPassesAgendaFilters).length;
      const canNavigate = dateValue >= todayIso();
      const button = document.createElement("button");
      button.type = "button";
      button.className = `two-month-day ${dateValue === todayIso() ? "today" : ""} ${!canNavigate ? "past" : ""}`;
      button.disabled = !canNavigate;
      button.innerHTML = `
        <strong>${new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(dateOnly(dateValue))}</strong>
        <span>${count + groupCount ? `${count + groupCount} citas` : "Libre"}</span>
      `;
      button.addEventListener("click", () => {
        selectedDate = dateValue;
        calendarMode = "week";
        saveState("selected-date", selectedDate);
        saveState("calendar-mode", calendarMode);
        renderAll();
      });
      days.append(button);
    }
    schedule.append(month);
  });
}

function renderPeriodSchedule(schedule) {
  const range = calendarRange();
  const days = [];
  for (let cursor = range.start; cursor <= range.end; cursor = addDaysIso(cursor, 1)) {
    days.push(cursor);
  }
  if (calendarMode === "week") {
    const visibleWeekDays = days.filter(clinicWorksOnDate);
    renderWeekSchedule(schedule, visibleWeekDays.length ? visibleWeekDays : days);
    return;
  }

  if (calendarMode === "month") {
    renderTwoMonthPlanner(schedule, range);
    return;
  }

  schedule.style.gridTemplateColumns = "repeat(7, minmax(170px, 1fr))";

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
        item.addEventListener("click", () => showGroupSummary(group, day));
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
  schedule.style.gridTemplateColumns = `72px repeat(${days.length}, minmax(190px, 1fr))`;

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
      cell.dataset.date = day;
      cell.dataset.hour = hour;
      const singlePractitioner = visiblePractitioners.length === 1 ? visiblePractitioners[0] : null;
      if (singlePractitioner) {
        const cellEnd = addMinutes(hour, 60);
        applyScheduleCellAvailability(cell, singlePractitioner, day, hour, cellEnd, true);
      }
      setupAppointmentDropTarget(cell, day, hour);
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

function appointmentMoveConflict(candidate, movingAppointmentId) {
  const service = byId(services, candidate.serviceId);
  const candidateEnd = addMinutes(candidate.start, service?.duration || 60);
  const practitioner = byId(practitioners, candidate.practitionerId);
  if (isOutsidePractitionerHours(practitioner, candidate.start, candidateEnd, candidate.date || selectedDate)) {
    return "La nueva hora queda fuera de la jornada laboral del profesional.";
  }
  const block = availabilityBlockFor(candidate.practitionerId, candidate.date || selectedDate, candidate.start, candidateEnd);
  if (block) {
    return `El profesional tiene ${availabilityBlockLabel(block)}.`;
  }
  const appointmentConflict = appointments.find((appointment) => {
    if (String(appointment.id) === String(movingAppointmentId) || !isBlockingAppointmentStatus(appointment.status)) {
      return false;
    }
    const sameDate = (appointment.date || selectedDate) === (candidate.date || selectedDate);
    const timeConflict = overlaps(candidate.start, candidateEnd, appointment.start, appointmentEnd(appointment));
    const sameResource = appointment.practitionerId === candidate.practitionerId
      || appointment.roomId === candidate.roomId
      || appointment.patientId === candidate.patientId;
    return sameDate && timeConflict && sameResource;
  });
  if (appointmentConflict) {
    return `Conflicto con ${byId(patients, appointmentConflict.patientId)?.name || "otra cita"} a las ${appointmentConflict.start}.`;
  }
  const groupConflict = groupsForDate(candidate.date || selectedDate).find((group) => (
    (group.practitionerId === candidate.practitionerId || group.roomId === candidate.roomId)
      && overlaps(candidate.start, candidateEnd, group.start, groupEnd(group))
  ));
  if (groupConflict) {
    return `Conflicto con la sesion grupal ${groupConflict.name} a las ${groupConflict.start}.`;
  }
  return "";
}

function clearAppointmentDropFeedback() {
  $$(".schedule-cell.drag-over, .schedule-cell.drag-invalid").forEach((cell) => {
    cell.classList.remove("drag-over", "drag-invalid");
    delete cell.dataset.dropFeedback;
  });
}

function draggedAppointmentFromEvent(event) {
  const appointmentId = event.dataTransfer?.getData(appointmentDragMime) || draggedAppointmentId;
  return appointmentId ? byId(appointments, appointmentId) : null;
}

function appointmentDropValidation(appointment, dateValue, hour, targetPractitionerId = "") {
  if (!appointment) {
    return { valid: false, message: "No se ha podido identificar la cita arrastrada." };
  }
  const practitionerId = targetPractitionerId || appointment.practitionerId;
  if (practitionerId !== appointment.practitionerId) {
    return { valid: false, message: "No se puede cambiar de profesional arrastrando. Mueve la cita dentro de su misma columna o usa la edicion manual." };
  }
  if ((appointment.date || selectedDate) === dateValue && appointment.start === hour) {
    return { valid: false, noop: true, message: "La cita ya esta en ese hueco." };
  }
  const candidate = { ...appointment, date: dateValue, start: hour, practitionerId };
  const conflict = appointmentMoveConflict(candidate, appointment.id);
  if (conflict) {
    return { valid: false, message: conflict };
  }
  return { valid: true, candidate };
}

function setupAppointmentDrag(button, appointment) {
  button.draggable = true;
  button.dataset.dragAppointmentId = appointment.id;
  button.title = "Arrastra para mover la cita a otra hora o dia del mismo profesional.";
  button.addEventListener("dragstart", (event) => {
    draggedAppointmentId = String(appointment.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(appointmentDragMime, String(appointment.id));
    event.dataTransfer.setData("text/plain", String(appointment.id));
    document.body.classList.add("dragging-appointment");
    window.setTimeout(() => button.classList.add("is-dragging"), 0);
  });
  button.addEventListener("dragend", () => {
    draggedAppointmentId = "";
    suppressAppointmentClickUntil = Date.now() + 350;
    document.body.classList.remove("dragging-appointment");
    button.classList.remove("is-dragging");
    clearAppointmentDropFeedback();
  });
}

function setupAppointmentDropTarget(cell, dateValue, hour, practitionerId = "") {
  cell.addEventListener("dragover", (event) => {
    if (![...event.dataTransfer.types].includes(appointmentDragMime) && !draggedAppointmentId) return;
    event.preventDefault();
    const validation = appointmentDropValidation(draggedAppointmentFromEvent(event), dateValue, hour, practitionerId);
    cell.classList.toggle("drag-over", validation.valid);
    cell.classList.toggle("drag-invalid", !validation.valid && !validation.noop);
    cell.dataset.dropFeedback = validation.valid ? "Soltar aqui" : validation.message;
    event.dataTransfer.dropEffect = validation.valid ? "move" : "none";
  });
  cell.addEventListener("dragleave", (event) => {
    if (!cell.contains(event.relatedTarget)) {
      cell.classList.remove("drag-over", "drag-invalid");
      delete cell.dataset.dropFeedback;
    }
  });
  cell.addEventListener("drop", (event) => {
    const appointmentId = event.dataTransfer.getData(appointmentDragMime) || draggedAppointmentId;
    if (!appointmentId) return;
    event.preventDefault();
    cell.classList.remove("drag-over", "drag-invalid");
    delete cell.dataset.dropFeedback;
    moveAppointmentByDrag(appointmentId, dateValue, hour, practitionerId);
  });
}

async function moveAppointmentByDrag(appointmentId, dateValue, hour, targetPractitionerId = "") {
  const appointment = byId(appointments, appointmentId);
  if (!appointment) return;
  const validation = appointmentDropValidation(appointment, dateValue, hour, targetPractitionerId);
  if (validation.noop) {
    return;
  }
  if (!validation.valid) {
    await showNotice("No se puede mover la cita", validation.message, { variant: "warning" });
    return;
  }
  let movedAppointment = { ...appointment, date: dateValue, start: hour, movedAt: new Date().toISOString(), movedBy: currentSessionName() };
  if (backendDataEnabled()) {
    try {
      movedAppointment = await saveAppointmentToBackend(movedAppointment, appointment.id);
    } catch (error) {
      await showNotice("No se puede mover la cita", `No se pudo actualizar en backend: ${error.message}`, { variant: "warning" });
      return;
    }
  }
  appointments = appointments.map((item) => String(item.id) === String(appointment.id)
    ? movedAppointment
    : item
  );
  saveClinicState("appointments", appointments);
  selectedDate = dateValue;
  saveState("selected-date", selectedDate);
  renderAll();
  showToast("Cita movida.");
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
  setupAppointmentDrag(button, appointment);
  button.addEventListener("click", () => {
    if (Date.now() < suppressAppointmentClickUntil) return;
    openAppointmentDetail(appointment.id);
  });
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
  setupAppointmentDrag(button, appointment);
  button.addEventListener("click", () => {
    if (Date.now() < suppressAppointmentClickUntil) return;
    openAppointmentDetail(appointment.id);
  });
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
    <span>${service?.name || "Servicio grupal"} - ${groupEnrollmentLabel(group, dateValue)}</span>
    <span>${group.start} - ${groupEnd(group)} - ${room?.name || "Sala"}</span>
    ${group.sessionOverride ? `<em class="session-exception-badge">Cambio puntual</em>` : ""}
  `;
  card.addEventListener("click", () => showGroupSummary(group, dateValue));
  return card;
}

function groupSessionMetaText(group, dateValue) {
  const service = groupService(group);
  const practitioner = byId(practitioners, group.practitionerId);
  const room = byId(rooms, group.roomId);
  const exceptionLabel = group.sessionOverride ? " - cambio puntual" : "";
  return `${service?.name || "Servicio"} - ${weekDayLabels[dayKeyFor(dateValue)] || dateValue} ${dateValue} - ${group.start} - ${groupEnd(group)} - ${practitioner?.name || "Profesional"} - ${room?.name || "Sala"}${exceptionLabel}`;
}

function updateGroupSessionHeader(group, dateValue) {
  $("#group-session-title").textContent = group.name;
  $("#group-session-meta").textContent = groupSessionMetaText(group, dateValue);
  $("#group-session-capacity").textContent = groupEnrollmentLabel(group, dateValue);
}

function showGroupSummary(group, dateValue = selectedDate) {
  const dialog = $("#group-session-dialog");
  if (!dialog) {
    const service = groupService(group);
    const practitioner = byId(practitioners, group.practitionerId);
    const room = byId(rooms, group.roomId);
    const names = groupFixedPatients(group).map((patient) => patient.name).join(", ") || "Sin pacientes inscritos";
    showNotice("Sesion grupal", `${group.name}\n${service?.name || "Servicio"}\n${weekDayLabels[dayKeyFor(dateValue)] || dateValue} ${group.start} - ${groupEnd(group)}\n${practitioner?.name || "Profesional"} - ${room?.name || "Sala"}\n${groupEnrollmentLabel(group, dateValue)}\nPacientes fijos: ${names}`);
    return;
  }

  const baseGroup = groupBaseById(group.id) || group;
  const sessionGroup = groupInstanceForDate(baseGroup, dateValue);
  dialog.dataset.groupId = group.id;
  dialog.dataset.date = dateValue;
  updateGroupSessionHeader(sessionGroup, dateValue);
  renderGroupSessionPanel(sessionGroup, dateValue);
  dialog.showModal();
}

function renderGroupSessionPanel(group, dateValue) {
  const fixedList = $("#group-session-fixed");
  const extrasList = $("#group-session-extras");
  const dropinSelect = $("#group-dropin-patient");
  const fixedSelect = $("#group-fixed-patient");
  const addDropinButton = $("#add-dropin");
  const addFixedButton = $("#add-fixed-patient");
  const exceptionForm = $("#group-exception-form");
  const exceptionStatus = $("#group-exception-status");
  const clearExceptionButton = $("#clear-group-exception");
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

  if (exceptionForm) {
    const baseGroup = groupBaseById(group.id) || group;
    const basePractitioner = byId(practitioners, baseGroup.practitionerId);
    const currentPractitioner = byId(practitioners, group.practitionerId);
    const exceptionError = $("#group-exception-error");
    fillSelect(exceptionForm.elements.practitioner, practitioners);
    exceptionForm.elements.practitioner.value = group.practitionerId;
    exceptionForm.elements.start.value = group.start;
    if (exceptionError) {
      exceptionError.classList.remove("visible");
      exceptionError.textContent = "";
    }
    if (exceptionStatus) {
      exceptionStatus.textContent = group.sessionOverride
        ? `Cambio guardado solo para ${formatShortDate(dateValue)}: ${currentPractitioner?.name || "Profesional"} a las ${group.start}. La serie sigue con ${basePractitioner?.name || "el trabajador original"} a las ${baseGroup.start}.`
        : `Sin cambio puntual. Esta sesion usa la serie: ${basePractitioner?.name || "Profesional"} a las ${baseGroup.start}.`;
    }
    if (clearExceptionButton) {
      clearExceptionButton.disabled = !group.sessionOverride;
    }
  }

  const free = groupHasFreeSpot(group, dateValue);
  const completed = isGroupCompleted(group, dateValue);
  const completion = groupCompletionFor(group, dateValue);
  const completedButton = $("#complete-group-session");
  const workerInvoiceButton = $("#invoice-group-worker");
  if (completedButton) {
    completedButton.disabled = completed;
    completedButton.textContent = completed ? "Sesion completada" : "Marcar sesion completada";
  }
  if (workerInvoiceButton) {
    workerInvoiceButton.disabled = !completed;
    workerInvoiceButton.textContent = completion?.workerInvoiceGenerated ? "Reimprimir liquidacion trabajador" : "Generar liquidacion trabajador";
  }
  const completedLabel = $("#group-session-completed-label");
  if (completedLabel) {
    const production = groupSessionProduction(group, dateValue);
    completedLabel.textContent = completed
      ? `Sesion completada. Base trabajador: ${production.revenue} EUR (${production.fixedSessionRevenue} EUR cuota prorrateada + ${production.dropinRevenue} EUR sueltos). Liquidacion: ${production.payout} EUR.`
      : `Pendiente. Al completar se calculara la liquidacion del trabajador con cuota fija prorrateada y sueltos del dia (${production.payout} EUR estimados).`;
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
      const baseGroup = groupBaseById(group.id) || group;
      const updatedGroup = groupInstanceForDate(baseGroup, dateValue);
      syncGroupCompletionForSession(updatedGroup, dateValue);
      updateGroupSessionHeader(updatedGroup, dateValue);
      renderGroupSessionPanel(updatedGroup, dateValue);
      renderAll();
    });
  });

  $$('[data-dropin-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      groupDropIns = groupDropIns.filter((entry) => entry.id !== button.dataset.dropinRemove);
      saveClinicState("group-dropins", groupDropIns);
      const baseGroup = groupBaseById(group.id) || group;
      const updatedGroup = groupInstanceForDate(baseGroup, dateValue);
      syncGroupCompletionForSession(updatedGroup, dateValue);
      updateGroupSessionHeader(updatedGroup, dateValue);
      renderGroupSessionPanel(updatedGroup, dateValue);
      renderAll();
    });
  });
}

function renderNextList() {
  const list = $("#next-list");
  list.innerHTML = "";
  updateTopbarChrome();
  $(".day-panel h2").textContent = calendarMode === "day" ? "Citas del dia" : (calendarMode === "week" ? "Citas de la semana" : "Planificador");
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
        <p>${group.date} - ${byId(practitioners, group.practitionerId)?.name || "Profesional"} - ${byId(rooms, group.roomId)?.name || "Sala"} - ${groupEnrollmentLabel(group, group.date)}${group.sessionOverride ? " - Cambio puntual" : ""}</p>
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

function updateTopbarChrome() {
  const dateLabel = $("#current-date-label");
  if (dateLabel) {
    const showDate = activeSection === "agenda";
    dateLabel.textContent = showDate ? formatDateLabel() : "";
    dateLabel.classList.toggle("hidden", !showDate);
  }
  $("#new-appointment")?.classList.toggle("hidden", activeSection !== "agenda");
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
  const range = calendarRange();
  return `Planificador: ${formatMonthName(range.start)} y ${formatMonthYear(addMonthsIso(range.start, 1))}`;
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
  return form.elements.name?.value.trim() || [firstName, lastName].filter(Boolean).join(" ");
}

function patientLocationLine(patient = {}) {
  return [patient.municipality, patient.city, patient.postalCode].filter(Boolean).join(", ") || patient.address || "";
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
  setPatientProfileTab("info");
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

function renderPatientDniFilePanel(patient) {
  const panel = $("#patient-dni-file-current");
  const removeRow = $("#patient-dni-remove-file-row");
  const removeInput = removeRow?.querySelector('input[name="removeDniFile"]');
  if (!panel || !removeRow) return;

  if (removeInput) {
    removeInput.checked = false;
  }

  if (!patient?.dniFileData) {
    panel.innerHTML = "";
    panel.classList.add("hidden");
    removeRow.classList.add("hidden");
    return;
  }

  const filename = patient.dniFileName || "DNI digitalizado";
  panel.classList.remove("hidden");
  removeRow.classList.remove("hidden");
  panel.innerHTML = `
    <strong>Archivo DNI actual</strong>
    <span>${escapeHtml(filename)}</span>
    <div class="compact-actions patient-file-actions">
      <button class="secondary-button compact-inline-button" type="button" id="open-current-patient-dni-file">Abrir</button>
      <button class="secondary-button compact-inline-button" type="button" id="download-current-patient-dni-file">Descargar</button>
    </div>
  `;
  $("#open-current-patient-dni-file")?.addEventListener("click", () => openDataUrlDocument(patient.dniFileData, filename));
  $("#download-current-patient-dni-file")?.addEventListener("click", () => downloadDataUrlFile(patient.dniFileData, filename));
}

function patientConsentStatusText(consent) {
  if (consent?.revoked) {
    return `Revocado ${consent.revokedAt ? new Date(consent.revokedAt).toLocaleString("es-ES") : ""}`;
  }
  return consent?.signed
    ? `Firmado ${consent.signedAt ? new Date(consent.signedAt).toLocaleString("es-ES") : ""}`
    : "Pendiente de firma";
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
    <dd>${patient.dniFileData ? `
      <div class="compact-actions patient-file-actions">
        <span class="file-name-inline">${escapeHtml(patient.dniFileName || "DNI digitalizado")}</span>
        <button class="secondary-button compact-inline-button" type="button" data-open-patient-file="${patient.id}:dni">Abrir</button>
        <button class="secondary-button compact-inline-button" type="button" data-download-patient-file="${patient.id}:dni">Descargar</button>
      </div>
    ` : "No adjuntado"}</dd>
    <dt>Sexo</dt>
    <dd>${patient.sex || "No indicado"}</dd>
    <dt>Email</dt>
    <dd>${patient.email || "No indicado"}</dd>
    <dt>Fecha nacimiento</dt>
    <dd>${patient.birthDate || "No indicada"}</dd>
    <dt>Ocupacion</dt>
    <dd>${patient.occupation || "No indicada"}</dd>
    <dt>Municipio</dt>
    <dd>${patient.municipality || "No indicado"}</dd>
    <dt>Ciudad</dt>
    <dd>${patient.city || "No indicada"}</dd>
    <dt>Codigo postal</dt>
    <dd>${patient.postalCode || "No indicado"}</dd>
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
  $$("[data-download-patient-file]").forEach((button) => {
    button.addEventListener("click", () => {
      const patientFile = byId(patients, button.dataset.downloadPatientFile.split(":")[0]);
      if (patientFile?.dniFileData) {
        downloadDataUrlFile(patientFile.dniFileData, patientFile.dniFileName || "DNI");
      }
    });
  });

  const consents = patientConsents.filter((item) => item.patientId === patient.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  $("#patient-consents").innerHTML = consents.length
    ? consents.map((item) => `
      <article class="compact-item consent-card action-card">
        <div>
          <strong>${escapeHtml(item.templateName || "Consentimiento")}</strong>
          <span>${escapeHtml(item.createdAt)} - ${escapeHtml(patientConsentStatusText(item))}${item.city ? ` - ${escapeHtml(item.city)}` : ""}${item.signatureDate ? ` - ${escapeHtml(formatConsentDate(item.signatureDate))}` : ""}</span>
          <p>${escapeHtml(excerptText(item.body || "Consentimiento asignado al paciente."))}</p>
          ${item.signatureData ? `<img class="signature-preview" src="${item.signatureData}" alt="Firma guardada">` : ""}
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-review-patient-consent="${item.id}">${item.revoked ? "Revisar" : "Editar"}</button>
          <button class="secondary-button compact-inline-button" type="button" data-email-patient-consent="${item.id}">Enviar email</button>
          <button class="secondary-button compact-inline-button" type="button" data-revoke-patient-consent="${item.id}" ${item.revoked ? "disabled" : ""}>Revocar</button>
          <button class="danger-button compact-inline-button" type="button" data-delete-patient-consent="${item.id}">Eliminar</button>
        </div>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin consentimientos asignados.</span></article>`;
  $$("[data-review-patient-consent]").forEach((button) => {
    button.addEventListener("click", () => openPatientConsentDialog(button.dataset.reviewPatientConsent));
  });
  $$("[data-revoke-patient-consent]").forEach((button) => {
    button.addEventListener("click", () => revokePatientConsent(button.dataset.revokePatientConsent));
  });
  $$("[data-delete-patient-consent]").forEach((button) => {
    button.addEventListener("click", () => deletePatientConsent(button.dataset.deletePatientConsent));
  });
  $$("[data-email-patient-consent]").forEach((button) => {
    button.addEventListener("click", () => emailPatientConsent(button.dataset.emailPatientConsent));
  });

  const packSelect = $("#patient-pack-template");
  if (packSelect) {
    packSelect.innerHTML = "";
    sessionPacks.forEach((pack) => packSelect.append(new Option(`${pack.name} - ${pack.sessions} sesiones - ${pack.price} EUR - ${packServiceLabel(pack)} - ${pack.expiryMonths ? `${pack.expiryMonths} meses` : "sin caducidad"}`, pack.id)));
    packSelect.disabled = !sessionPacks.length;
  }

  const packs = patientPacks.filter((item) => item.patientId === patient.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  $("#patient-packs").innerHTML = packs.length
    ? packs.map((item) => {
      const remaining = patientPackRemaining(item);
      const expired = isPatientPackExpired(item);
      return `
      <article class="compact-item action-card patient-pack-card">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${remaining} disponibles de ${item.sessions} - ${expired ? "Caducado - " : remaining <= 0 ? "Agotado - " : ""}${item.price} EUR - ${packServiceLabel(item)} - ${patientPackExpiryLabel(item)} ${item.invoice ? "- Facturable" : ""}${item.invoiceGenerated ? ` - ${item.invoiceNumber || "Factura generada"}` : ""}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-edit-patient-pack="${item.id}">Editar</button>
          <button class="secondary-button compact-inline-button" type="button" data-invoice-patient-pack="${item.id}">${item.invoiceGenerated ? "Reimprimir" : "Facturar"}</button>
        </div>
      </article>
    `;
    }).join("")
    : `<article class="compact-item"><span>Sin bonos asignados.</span></article>`;

  const invoiceAppointments = appointments
    .filter((appointment) => (
      appointment.patientId === patient.id
        && byId(services, appointment.serviceId)?.type !== "group"
        && normalizeAppointmentStatus(appointment.status) === "confirmed"
    ))
    .sort((a, b) => `${b.invoiceGeneratedAt || b.date || ""}`.localeCompare(`${a.invoiceGeneratedAt || a.date || ""}`));
  const invoicePacks = patientPacks
    .filter((pack) => pack.patientId === patient.id && pack.invoice)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const invoicesList = $("#patient-invoices");
  if (invoicesList) {
    invoicesList.innerHTML = [...invoiceAppointments.map((appointment) => `
      <article class="compact-item action-card">
        <div>
          <strong>${appointment.invoiceGenerated ? (appointment.invoiceNumber || "Factura generada") : "Cita pendiente de factura"} - ${appointment.date || selectedDate}</strong>
          <span>${appointment.start} - ${byId(services, appointment.serviceId)?.name || "Servicio"} - ${servicePrice(appointment)} EUR${appointment.patientPackId ? ` (bono: ${appointmentRevenueAmount(appointment)} EUR internos)` : ""} - ${paymentStatusLabel(appointmentPaymentStatus(appointment))} - ${statusLabel(appointment.status)}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-open-patient-invoice-appointment="${appointment.id}">Abrir cita</button>
          <button class="secondary-button compact-inline-button" type="button" data-reprint-invoice="${appointment.id}">${appointment.invoiceGenerated ? "Reimprimir" : "Generar factura"}</button>
        </div>
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
  $$("[data-open-patient-invoice-appointment]").forEach((button) => {
    button.addEventListener("click", () => openAppointmentDetail(button.dataset.openPatientInvoiceAppointment));
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

function generateGroupWorkerInvoiceForSession(groupId, dateValue) {
  const baseGroup = groupBaseById(groupId);
  const group = baseGroup ? groupInstanceForDate(baseGroup, dateValue) : null;
  const completion = group ? groupCompletionFor(group, dateValue) : null;
  if (!group || !completion) {
    showNotice("Sesion no completada", "Marca primero la sesion grupal como completada para generar la liquidacion del trabajador.", { variant: "warning" });
    return;
  }

  const lockKey = `${group.id}:${dateValue}`;
  if (groupWorkerInvoiceLocks.has(lockKey)) {
    showToast("La liquidacion ya se esta preparando.", "warning");
    return;
  }

  groupWorkerInvoiceLocks.add(lockKey);
  try {
    const practitioner = byId(practitioners, completion.practitionerId);
    const service = byId(services, completion.serviceId);
    const room = byId(rooms, completion.roomId);
    const invoiceNumber = completion.workerInvoiceNumber || `LT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Liquidacion ${invoiceNumber}</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#202621}header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #ddd;padding-bottom:18px}h1{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:28px}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:22px;font-weight:700;margin-top:24px}</style></head>
<body>
<header><div><h1>${clinic.name || "Klinia"}</h1><p>${clinic.email || ""}<br>${clinic.phone || ""}</p></div><div><strong>Liquidacion trabajador ${invoiceNumber}</strong><p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p></div></header>
<section><h2>Trabajador</h2><p>${practitioner?.name || "Profesional"}<br>${practitioner?.specialty || ""}</p></section>
<table><thead><tr><th>Fecha</th><th>Grupo</th><th>Servicio</th><th>Sala</th><th>Asistentes</th><th>Base</th><th>Liquidacion</th></tr></thead><tbody><tr><td>${dateValue} ${completion.start || group.start}</td><td>${group.name}</td><td>${service?.name || "Servicio grupal"}</td><td>${room?.name || "Sala"}</td><td>${completion.attendees || 0}</td><td>${completion.revenue || 0} EUR</td><td>${completion.payout || 0} EUR</td></tr></tbody></table>
<p>Detalle: ${completion.fixedCount || 0} fijos (${completion.fixedSessionRevenue || 0} EUR de cuota mensual prorrateada en ${completion.expectedSessionsInMonth || 1} sesiones) + ${completion.dropinCount || 0} sueltos (${completion.dropinRevenue || 0} EUR).</p>
<p class="total">Total trabajador: ${completion.payout || 0} EUR</p>
</body></html>`;
    downloadTextFile(`liquidacion-trabajador-${invoiceNumber}.html`, html, "text/html");
    groupCompletions = groupCompletions.map((entry) => (
      entry.id === completion.id
        ? { ...entry, workerInvoiceGenerated: true, workerInvoiceNumber: invoiceNumber, workerInvoiceGeneratedAt: new Date().toISOString() }
        : entry
    ));
    saveClinicState("group-completions", groupCompletions);
    renderGroupSessionPanel(group, dateValue);
    renderPerformance();
  } finally {
    groupWorkerInvoiceLocks.delete(lockKey);
  }
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
  const workingDays = new Set(clinicWorkingDays());
  $$("input[name='workingDays']", clinicForm).forEach((input) => {
    input.checked = workingDays.has(input.value);
  });
  const staffForm = $("#staff-access-form");
  if (staffForm && !staffForm.contains(document.activeElement)) {
    const account = currentClinicAccount();
    staffForm.elements.staffEmail.value = account.staffEmail || "";
    staffForm.elements.staffPassword.value = account.staffPassword || "";
  }
  renderAccessRecoveryRequests();

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
          <span>${practitioner.email || "Sin email de acceso"} - ${practitioner.password ? "Clave configurada" : "Sin clave configurada"}</span>
        </div>
        <details class="item-menu">
          <summary aria-label="Opciones de ${practitioner.name}">...</summary>
          <div class="item-menu-popover">
            <button type="button" data-edit-practitioner="${practitioner.id}">Editar</button>
            <button type="button" data-reset-practitioner-key="${practitioner.id}">Generar clave</button>
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
  $$("[data-reset-practitioner-key]").forEach((button) => button.addEventListener("click", () => resetPractitionerAccessKey(button.dataset.resetPractitionerKey)));
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
          showNotice("Grupo completo", "El grupo ya esta completo para esta fecha.", { variant: "warning" });
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
    .filter((appointment) => normalizeAppointmentStatus(appointment.status) === "confirmed")
    .map((appointment) => ({
      id: appointment.id,
      sortKey: `${appointment.date || selectedDate} ${appointment.start}`,
      concept: `${appointment.start} - ${byId(services, appointment.serviceId)?.name || "Servicio no encontrado"}`,
      patient: byId(patients, appointment.patientId)?.name || "Paciente no encontrado",
      practitioner: byId(practitioners, appointment.practitionerId)?.name || "Profesional",
      status: normalizeAppointmentStatus(appointment.status),
      statusText: statusLabel(appointment.status),
      amount: appointmentRevenueAmount(appointment),
      patientAmount: servicePrice(appointment),
      paymentStatus: appointmentPaymentStatus(appointment),
      paymentText: paymentStatusLabel(appointmentPaymentStatus(appointment)),
      appointmentId: appointment.id,
      invoiceGenerated: Boolean(appointment.invoiceGenerated)
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
      status: pack.invoiceGenerated ? "confirmed" : "pending",
      statusText: pack.invoiceGenerated ? "Facturado" : "Pendiente",
      amount: Number(pack.price || 0)
    }));
  const visible = [...appointmentRows, ...groupRows, ...packRows];
  const paidAppointments = appointmentRows.filter((appointment) => appointment.status === "confirmed" && ["cash", "card"].includes(appointment.paymentStatus));
  const paid = paidAppointments
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "completed").reduce((total, row) => total + row.amount, 0)
    + packRows.filter((row) => row.status === "confirmed").reduce((total, row) => total + row.amount, 0);
  const pending = appointmentRows
    .filter((appointment) => appointment.status === "confirmed" && appointment.paymentStatus === "unpaid")
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "pending").reduce((total, row) => total + row.amount, 0)
    + packRows.filter((row) => row.status === "pending").reduce((total, row) => total + row.amount, 0);
  const lost = 0;
  const cash = paidAppointments
    .filter((appointment) => appointment.paymentStatus === "cash")
    .reduce((total, appointment) => total + appointment.amount, 0);
  const card = paidAppointments
    .filter((appointment) => appointment.paymentStatus === "card")
    .reduce((total, appointment) => total + appointment.amount, 0);

  $("#billing-paid").textContent = `${paid} EUR`;
  $("#billing-pending").textContent = `${pending} EUR`;
  $("#billing-lost").textContent = `${lost} EUR`;
  $("#billing-cash").textContent = `${cash} EUR`;
  $("#billing-card").textContent = `${card} EUR`;
  $("#billing-table").innerHTML = visible
    .slice()
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((row) => `
      <tr>
        <td>${row.concept}</td>
        <td>${row.patient}</td>
        <td>${row.practitioner}</td>
        <td><span class="status-pill ${row.status}">${row.statusText}</span></td>
        <td>${row.paymentText || (row.invoiceGenerated ? "Facturado" : "Pendiente")}</td>
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
  return appointments.filter((appointment) => normalizeAppointmentStatus(appointment.status) === "confirmed");
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

function practitionerOccupancyReport(practitioner, range = calendarRange()) {
  const days = datesInRange(range.start, range.end);
  const availableMinutes = days.reduce((total, dateValue) => (
    total + availableMinutesForPractitionerDay(practitioner, dateValue)
  ), 0);
  const appointmentMinutes = appointments
    .filter((appointment) => normalizeAppointmentStatus(appointment.status) === "confirmed")
    .filter((appointment) => appointment.practitionerId === practitioner.id)
    .filter((appointment) => (appointment.date || selectedDate) >= range.start && (appointment.date || selectedDate) <= range.end)
    .reduce((total, appointment) => total + (byId(services, appointment.serviceId)?.duration || 60), 0);
  const groupMinutes = days.reduce((total, dateValue) => (
    total + groupsForDate(dateValue)
      .filter((group) => group.practitionerId === practitioner.id)
      .reduce((dayTotal, group) => dayTotal + (groupService(group)?.duration || 60), 0)
  ), 0);
  const bookedMinutes = appointmentMinutes + groupMinutes;
  return {
    bookedMinutes,
    availableMinutes,
    percent: availableMinutes ? Math.min(100, Math.round((bookedMinutes / availableMinutes) * 100)) : 0
  };
}

function practitionerReport(practitioner) {
  const ownAppointments = billableAppointments().filter((appointment) => appointment.practitionerId === practitioner.id);
  const ownGroupSessions = groupCompletedSessionsForPractitioner(practitioner);
  const appointmentRevenue = ownAppointments.reduce((total, appointment) => total + appointmentRevenueAmount(appointment), 0);
  const groupRevenue = ownGroupSessions.reduce((total, session) => total + Number(session.revenue || 0), 0);
  const revenue = appointmentRevenue + groupRevenue;
  const minutesBooked = ownAppointments.reduce((total, appointment) => total + (byId(services, appointment.serviceId)?.duration || 60), 0)
    + ownGroupSessions.reduce((total, session) => total + (session.duration || 60), 0);
  const billableItems = ownAppointments.length + ownGroupSessions.length;
  const averageTicket = billableItems ? Math.round(revenue / billableItems) : 0;
  const appointmentPayout = ownAppointments.reduce((total, appointment) => total + serviceCommissionAmount(appointment, practitioner), 0);
  const groupPayout = ownGroupSessions.reduce((total, session) => total + Number(session.payout || 0), 0);
  const payout = appointmentPayout + groupPayout;
  const occupancy = practitionerOccupancyReport(practitioner).percent;

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
    $$("#worker-performance .permission-note").forEach((note) => note.remove());
    $("#worker-summary").innerHTML = `
      <div>
        <span>Rendimiento</span>
        <strong>Sin trabajadores</strong>
        <p>Crea trabajadores en esta clinica para calcular rendimiento propio.</p>
      </div>
    `;
    $("#worker-billing").innerHTML = `<article><span>Sin datos de rendimiento para esta clinica.</span></article>`;
    $("#worker-activity").innerHTML = `<article class="compact-item"><span>No hay sesiones facturables asociadas a trabajadores de esta clinica.</span></article>`;
    $("#owner-summary").innerHTML = `
      <div><span>Facturacion equipo</span><strong>0 EUR</strong></div>
      <div><span>Citas facturables</span><strong>0</strong></div>
      <div><span>Mayor facturacion</span><strong>-</strong></div>
      <div><span>Ocupacion media</span><strong>0%</strong></div>
    `;
    $("#owner-report-table").innerHTML = `<tr><td colspan="5">Sin trabajadores en esta clinica.</td></tr>`;
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
    <article><span>Ocupacion</span><strong>${workerReport.occupancy}%</strong></article>
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

  $("#owner-report-table").innerHTML = allReports.length
    ? allReports.map((report) => `
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
    .join("")
    : `<tr><td colspan="5">Sin trabajadores en esta clinica.</td></tr>`;
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
  if (normalizeAppointmentStatus(appointment.status) !== "confirmed") {
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
    showNotice("WhatsApp no disponible", "Este paciente no tiene telefono valido para WhatsApp.", { variant: "warning" });
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
  const revenueAppointments = visible.filter((item) => normalizeAppointmentStatus(item.status) === "confirmed");
  const revenue = revenueAppointments.reduce((total, item) => total + appointmentRevenueAmount(item), 0);
  const occupancy = occupancyReportForRange(calendarRange());
  $("#metric-appointments").textContent = visible.length;
  $("#metric-occupancy").textContent = `${occupancy.percent}%`;
  if ($("#metric-occupancy-detail")) {
    $("#metric-occupancy-detail").textContent = `${Math.round(occupancy.bookedMinutes / 60)}h ocupadas / ${Math.round(occupancy.availableMinutes / 60)}h disponibles`;
  }
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
  const professionalPlan = saasPlanById("kliniaplan");
  const statusCard = $("#saas-status-card");
  const billingForm = $("#saas-billing-form");
  if (!statusCard || !billingForm) {
    return;
  }
  const trialEndDate = account.trialEndsAt ? dateOnly(account.trialEndsAt) : null;
  const remainingDays = trialEndDate && !Number.isNaN(trialEndDate.getTime())
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - dateOnly(todayIso()).getTime()) / 86400000))
    : 0;
  const isTrial = ["trialing", "trial"].includes(status) || account.paymentPlan === "trial";
  const nextChargeDate = account.currentPeriodEnd
    ? formatShortDate(account.currentPeriodEnd)
    : account.trialEndsAt
      ? formatShortDate(account.trialEndsAt)
      : "Pendiente";
  const displayPlanName = account.paymentPlan === "trial" ? "Demo gratuita" : "Plan Profesional";
  const displayedPaidPlan = account.paymentPlan === "kliniaplan_annual" ? saasPlanById("kliniaplan_annual") : professionalPlan;

  $("#subscription-trial-badge").textContent = isTrial
    ? `Quedan ${remainingDays} dias de prueba`
    : subscriptionStatusLabel(status);
  $("#subscription-plan-title").textContent = displayPlanName;
  $("#subscription-plan-state").textContent = subscriptionStatusLabel(status);
  $("#subscription-plan-copy").textContent = isTrial
    ? "Estas en periodo de prueba gratuita con acceso completo a Klinia."
    : "Tu clinica usa el plan profesional conectado al estado comercial guardado.";
  $("#subscription-days-left").textContent = isTrial ? `${remainingDays} dias` : "-";
  $("#subscription-renewal-date").textContent = isTrial ? `Renovacion ${nextChargeDate}` : `Proximo cobro ${nextChargeDate}`;
  $("#subscription-after-price").textContent = `${displayedPaidPlan.price} EUR / ${displayedPaidPlan.interval}`;
  $("#start-subscription").textContent = account.stripeCustomerId
    ? "Ver mi plan"
    : account.paymentPlan === "trial"
      ? "Activar plan"
      : "Preparar pago";

  statusCard.innerHTML = isTrial
    ? `<strong>Al finalizar tu prueba gratuita</strong><span>Tu plan pasara a Profesional y se cobrara ${professionalPlan.price} EUR cada mes cuando Stripe este conectado.</span>`
    : `<strong>${subscriptionStatusLabel(status)}</strong><span>${account.stripeCustomerId ? "Cliente Stripe conectado." : "Pago pendiente de conectar con Stripe."}</span>`;

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

  const billingSummary = $("#subscription-billing-summary");
  if (billingSummary) {
    const amount = account.paymentPlan === "trial" ? "0,00 EUR durante la prueba" : `${plan.price},00 EUR + IVA`;
    billingSummary.innerHTML = `
      <div class="subscription-billing-row">
        <span>Metodo de pago</span>
        <strong>${account.stripeCustomerId ? "Stripe conectado" : "Pendiente de Stripe"}</strong>
      </div>
      <div class="subscription-billing-row">
        <span>Proximo cobro</span>
        <strong>${nextChargeDate}</strong>
      </div>
      <div class="subscription-billing-row">
        <span>Importe</span>
        <strong>${amount}</strong>
      </div>
      <div class="subscription-billing-row">
        <span>Frecuencia</span>
        <strong>${plan.interval}</strong>
      </div>
    `;
  }

  const historyTable = $("#subscription-history-table");
  if (historyTable) {
    const history = Array.isArray(account.billingHistory) ? account.billingHistory : [];
    historyTable.innerHTML = history.length
      ? history.map((item) => `
        <tr>
          <td>${escapeHtml(item.date || "-")}</td>
          <td>${escapeHtml(item.description || "Factura SaaS")}</td>
          <td>${escapeHtml(item.amount || "-")}</td>
          <td><span class="status-pill ${escapeHtml(item.status || "pending")}">${escapeHtml(item.statusLabel || item.status || "Pendiente")}</span></td>
        </tr>
      `).join("")
      : `<tr><td colspan="4">Todavia no hay facturas SaaS reales asociadas a esta clinica.</td></tr>`;
  }

  billingForm.elements.billingName.value = account.billingProfile?.billingName || clinic.name || "";
  billingForm.elements.taxId.value = account.billingProfile?.taxId || "";
  billingForm.elements.billingEmail.value = account.billingProfile?.billingEmail || clinic.email || "";
  billingForm.elements.billingAddress.value = account.billingProfile?.billingAddress || "";
}


function setupSaasSettings() {
  $("#saas-billing-form")?.addEventListener("submit", async (event) => {
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
    const account = currentClinicAccount();
    if (backendTokenForAccount(account)) {
      try {
        const status = await backendRequest("/billing/profile", {
          method: "PATCH",
          account,
          body: JSON.stringify({
            billing_name: billingProfile.billingName || null,
            billing_email: billingProfile.billingEmail || null,
            tax_id: billingProfile.taxId || null,
            billing_address: billingProfile.billingAddress || null
          })
        });
        applyBackendBillingStatus(status);
        $("#saas-save-status").textContent = "Datos fiscales guardados y sincronizados con el backend.";
      } catch (error) {
        $("#saas-save-status").textContent = `Datos guardados localmente. No se pudo sincronizar backend: ${error.message}`;
      }
    } else {
      $("#saas-save-status").textContent = "Datos fiscales guardados localmente. Vincula esta clinica al backend para activar Stripe real.";
    }
    renderSaasSettings();
  });

  $("#start-subscription")?.addEventListener("click", async () => {
    const account = currentClinicAccount();
    const selectedPlan = account.paymentPlan === "trial" ? "kliniaplan" : account.paymentPlan;
    const button = $("#start-subscription");
    if (button) {
      button.disabled = true;
      button.textContent = "Abriendo Stripe...";
    }
    try {
      if (!backendTokenForAccount(account)) {
        throw new Error("Esta clinica no tiene sesion backend. Inicia sesion con el usuario de Direccion o vuelve a crear/vincular la clinica.");
      }
      const session = await backendRequest("/billing/checkout-session", {
        method: "POST",
        account,
        body: JSON.stringify({ plan: selectedPlan })
      });
if (session?.url) {
    window.location.href = session.url;
    return;
}

throw new Error("Stripe no devolvio URL de checkout");
    } catch (error) {
      $("#saas-save-status").textContent = `No se pudo abrir Checkout: ${error.message}`;
    } finally {
      if (button?.isConnected) {
        button.disabled = false;
      }
    }
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
      item.key === activeClinicKey
        ? {
            ...item,
            paymentPlan: selectedPlan,
            subscriptionStatus: "pending_stripe",
            billingStatus: "pending_stripe",
            checkoutUrl: item.checkoutUrl || ""
          }
        : item
    )));
    saveClinicAccounts();
    renderSaasSettings();
  });

  $("#open-billing-portal")?.addEventListener("click", async () => {
    const account = currentClinicAccount();
    try {
      if (!backendTokenForAccount(account)) {
        throw new Error("Esta clinica no tiene sesion backend activa.");
      }
      const session = await backendRequest("/billing/portal-session", {
        method: "POST",
        account,
        body: JSON.stringify({})
      });
      if (session?.url && session.demo_mode === false) {
        window.location.href = session.url;
        return;
      }
      $("#saas-save-status").textContent = "El portal estara disponible cuando exista cliente Stripe real.";
    } catch (error) {
      $("#saas-save-status").textContent = `No se pudo abrir el portal: ${error.message}`;
    }
  });

  $("#subscription-change-plan")?.addEventListener("click", () => {
    $(".subscription-plan-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#cancel-subscription")?.addEventListener("click", async () => {
    const confirmed = await showConfirm({
      title: "Cancelar suscripcion",
      message: "Quieres marcar esta suscripcion como cancelada en Klinia local?",
      detail: "Si la clinica tiene Stripe conectado, tambien debera cancelarse desde el portal de pagos.",
      confirmLabel: "Cancelar suscripcion"
    });
    if (!confirmed) return;
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
      item.key === activeClinicKey
        ? { ...item, subscriptionStatus: "canceled", billingStatus: "canceled" }
        : item
    )));
    saveClinicAccounts();
    $("#saas-save-status").textContent = "Suscripcion marcada como cancelada en esta instalacion local.";
    renderSaasSettings();
  });

  $("#subscription-contact-support")?.addEventListener("click", () => {
    showNotice(
      "Soporte Klinia",
      "Puedes contactar por email o WhatsApp desde la pantalla publica de Ayuda.",
      { variant: "info" }
    );
  });
}

function handleBillingReturnFromStripe() {
  const params = new URLSearchParams(window.location.search || "");
  const billing = params.get("billing");
  if (!billing) {
    return;
  }
  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState(null, "", cleanUrl);
  if (billing === "success") {
    showToast("Pago recibido en Stripe. Sincronizando suscripcion...");
    syncCurrentSubscriptionFromBackend({ silent: true }).then(() => {
      renderSaasSettings();
      applyRolePermissions();
    });
    return;
  }
  if (billing === "cancelled") {
    showToast("Checkout cancelado. La suscripcion sigue pendiente.", "warning");
    return;
  }
  if (billing === "stripe-demo" || billing === "portal-demo") {
    showToast("Stripe no esta configurado todavia con claves reales.", "warning");
  }
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
            <span>${item.sessions} sesiones - ${item.price} EUR - ${packServiceLabel(item)} - ${item.expiryMonths ? `${item.expiryMonths} meses` : "Sin caducidad"} ${item.invoice ? "- Facturable" : ""}</span>
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
  form.elements.expiryMonths.value = String(existing?.expiryMonths ?? 12);
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
      expiryMonths: Math.max(0, Number(form.elements.expiryMonths?.value || 0)),
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
  appendAuditLog("export-backup", { file: `klinia-backup-${safeClinic}-${date}.json`, keys: Object.keys(snapshot.data || {}).length });
  const status = $("#backup-status");
  if (status) {
    status.textContent = "Copia exportada. Guarda el archivo fuera del navegador.";
  }
}

function storageEntriesFromImportSnapshot(snapshot) {
  if (snapshot.product !== "Klinia" || !snapshot.data || typeof snapshot.data !== "object") {
    throw new Error("Archivo de copia no valido.");
  }
  const entries = Object.entries(snapshot.data)
    .filter(([key, value]) => (key.startsWith("klinia:") || key.startsWith("clinicaflow:")) && typeof value === "string");
  if (!entries.length) {
    throw new Error("La copia no contiene datos de Klinia.");
  }
  entries.forEach(([key, value]) => {
    try {
      JSON.parse(value);
    } catch (error) {
      throw new Error(`La clave ${key} no contiene JSON valido.`);
    }
  });
  return entries;
}

function analyzeImportSnapshot(snapshot) {
  const entries = storageEntriesFromImportSnapshot(snapshot);
  const importedClinicKeys = new Set();
  entries.forEach(([key]) => {
    const match = key.match(/^klinia:clinic:([^:]+):/);
    if (match?.[1]) importedClinicKeys.add(match[1]);
  });

  let importedAccounts = [];
  try {
    importedAccounts = JSON.parse(snapshot.data["klinia:clinic-accounts"] || "[]");
  } catch {
    importedAccounts = [];
  }

  const currentAccounts = loadState("clinic-accounts", []);
  const conflicts = [];
  importedAccounts.forEach((account) => {
    const sameKey = currentAccounts.find((item) => item.key === account.key);
    const sameName = currentAccounts.find((item) => item.key !== account.key && String(item.name || "").trim().toLowerCase() === String(account.name || "").trim().toLowerCase());
    const sameTaxId = currentAccounts.find((item) => item.key !== account.key && account.billingProfile?.taxId && String(item.billingProfile?.taxId || "").trim().toLowerCase() === String(account.billingProfile.taxId).trim().toLowerCase());
    if (sameKey) conflicts.push(`La clinica ${account.name || account.key} ya existe y se actualizara solo si confirmas.`);
    if (sameName) conflicts.push(`Nombre duplicado: ${account.name}.`);
    if (sameTaxId) conflicts.push(`CIF/NIF duplicado: ${account.billingProfile.taxId}.`);
  });

  const overwrittenKeys = entries.filter(([key]) => localStorage.getItem(key) !== null).length;
  if (overwrittenKeys) {
    conflicts.push(`${overwrittenKeys} claves locales coinciden con la copia y se restauraran con confirmacion.`);
  }

  return {
    entries,
    totalKeys: entries.length,
    clinicCount: importedClinicKeys.size || importedAccounts.length || 1,
    importedClinicNames: importedAccounts.map((account) => account.name).filter(Boolean),
    conflicts,
    exportedAt: snapshot.exportedAt || "",
    origin: snapshot.origin || ""
  };
}

function renderImportPreview(analysis) {
  setRegisterText("#import-preview-summary", `Copia detectada con ${analysis.totalKeys} claves y ${analysis.clinicCount} clinica(s).`);
  const detected = $("#import-preview-detected");
  if (detected) {
    detected.innerHTML = [
      analysis.exportedAt ? `Exportada: ${new Date(analysis.exportedAt).toLocaleString("es-ES")}` : "Fecha de exportacion no informada",
      analysis.origin ? `Origen: ${analysis.origin}` : "Origen no informado",
      analysis.importedClinicNames.length ? `Clinicas: ${analysis.importedClinicNames.join(", ")}` : "Clinicas detectadas por claves internas"
    ].map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }
  const conflicts = $("#import-preview-conflicts");
  if (conflicts) {
    conflicts.innerHTML = analysis.conflicts.length
      ? analysis.conflicts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "<li>No se han detectado conflictos directos.</li>";
  }
}

async function commitImportSnapshot() {
  if (!pendingImportSnapshot || !pendingImportAnalysis) return;
  const entries = pendingImportAnalysis.entries;
  const previousValues = new Map(entries.map(([key]) => [key, localStorage.getItem(key)]));

  try {
    entries.forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    appendAuditLog("import-backup", {
      keys: pendingImportAnalysis.totalKeys,
      clinicCount: pendingImportAnalysis.clinicCount,
      conflicts: pendingImportAnalysis.conflicts
    });
    $("#import-preview-dialog")?.close();
    await showNotice("Copia importada", "La importacion se ha completado con trazabilidad. La aplicacion se recargara ahora.", { variant: "success" });
    window.location.reload();
  } catch (error) {
    previousValues.forEach((value, key) => {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    });
    await showNotice("Importacion revertida", "No se ha importado nada porque fallo una parte critica del proceso.", { variant: "danger" });
  } finally {
    pendingImportSnapshot = null;
    pendingImportAnalysis = null;
  }
}

function importClinicBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    try {
      const snapshot = JSON.parse(String(reader.result || "{}"));
      const analysis = analyzeImportSnapshot(snapshot);
      pendingImportSnapshot = snapshot;
      pendingImportAnalysis = analysis;
      renderImportPreview(analysis);
      $("#import-preview-dialog")?.showModal();
    } catch (error) {
      showNotice("No se pudo importar la copia", error.message, { variant: "danger" });
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
  $("#import-preview-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    commitImportSnapshot();
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

function generateAccessKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(10);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 255);
    });
  }
  const raw = [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
}

function saveAccessRecoveryRequests() {
  saveState("access-recovery-requests", accessRecoveryRequests);
}

function accessRecoveryLabel(request) {
  return {
    owner: "Direccion",
    staff: "Recepcion"
  }[request.profile] || request.label || "Trabajador";
}

function accessRecoveryRequestsForActiveClinic() {
  return accessRecoveryRequests
    .filter((request) => request.clinicKey === activeClinicKey && request.status !== "resolved")
    .sort((a, b) => String(b.requestedAt || "").localeCompare(String(a.requestedAt || "")));
}

function renderAccessRecoveryRequests() {
  const list = $("#access-recovery-requests");
  if (!list) {
    return;
  }
  const requests = accessRecoveryRequestsForActiveClinic();
  list.innerHTML = requests.length
    ? requests.map((request) => `
      <article class="compact-item action-card access-recovery-card">
        <div>
          <strong>${escapeHtml(accessRecoveryLabel(request))}</strong>
          <span>${escapeHtml(request.email)} - solicitado ${new Date(request.requestedAt).toLocaleString("es-ES")}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-resolve-access-request="${request.id}">Generar nueva clave</button>
          <button class="secondary-button compact-inline-button" type="button" data-dismiss-access-request="${request.id}">Cerrar</button>
        </div>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin solicitudes de recuperacion de clave pendientes.</span></article>`;

  $$("[data-resolve-access-request]").forEach((button) => {
    button.addEventListener("click", () => resolveAccessRecoveryRequest(button.dataset.resolveAccessRequest));
  });
  $$("[data-dismiss-access-request]").forEach((button) => {
    button.addEventListener("click", () => {
      accessRecoveryRequests = accessRecoveryRequests.map((request) => (
        request.id === button.dataset.dismissAccessRequest ? { ...request, status: "resolved", resolvedAt: new Date().toISOString() } : request
      ));
      saveAccessRecoveryRequests();
      renderAccessRecoveryRequests();
    });
  });
}

async function resolveAccessRecoveryRequest(requestId) {
  const request = accessRecoveryRequests.find((item) => item.id === requestId && item.clinicKey === activeClinicKey);
  if (!request) {
    return;
  }
  const nextKey = generateAccessKey();
  if (request.profile === "owner") {
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey ? { ...account, password: nextKey, ownerPassword: nextKey } : account
    )));
    saveClinicAccounts();
  } else if (request.profile === "staff") {
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey ? { ...account, staffEmail: request.email, staffPassword: nextKey } : account
    )));
    saveClinicAccounts();
  } else {
    practitioners = practitioners.map((practitioner) => (
      practitioner.id === request.profile ? { ...practitioner, password: nextKey, email: request.email || practitioner.email } : practitioner
    ));
    saveClinicState("practitioners", practitioners);
  }
  accessRecoveryRequests = accessRecoveryRequests.map((item) => (
    item.id === request.id ? { ...item, status: "resolved", resolvedAt: new Date().toISOString() } : item
  ));
  saveAccessRecoveryRequests();
  renderLoginProfiles();
  renderSettings();
  renderPermissions();
  await showNotice(
    "Clave generada",
    `Nueva clave para ${accessRecoveryLabel(request)}: ${nextKey}. Entrégala de forma segura y pide que la cambien cuando sea posible.`,
    { variant: "success" }
  );
}

async function resetPractitionerAccessKey(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  if (!practitioner || !canManageClinic()) {
    return;
  }
  const nextKey = generateAccessKey();
  practitioners = practitioners.map((item) => (
    item.id === practitioner.id ? { ...item, password: nextKey } : item
  ));
  saveClinicState("practitioners", practitioners);
  renderLoginProfiles();
  renderSettings();
  await showNotice(
    "Clave generada",
    `Nueva clave para ${practitioner.name}: ${nextKey}.${practitioner.email ? "" : " Añade un email de acceso para que pueda iniciar sesion."}`,
    { variant: practitioner.email ? "success" : "warning" }
  );
}

function createAccessRecoveryRequest(email) {
  const principal = loginPrincipalByIdentifier(email);
  if (!principal) {
    return false;
  }
  const existingOpen = accessRecoveryRequests.find((request) => (
    request.email.toLowerCase() === email.toLowerCase()
      && request.clinicKey === principal.account.key
      && request.status !== "resolved"
  ));
  if (existingOpen) {
    return true;
  }
  accessRecoveryRequests = [
    {
      id: `recovery-${Date.now()}`,
      email,
      clinicKey: principal.account.key,
      clinicName: principal.account.name,
      profile: principal.profile,
      label: principal.label,
      requestedAt: new Date().toISOString(),
      status: "pending"
    },
    ...accessRecoveryRequests
  ];
  saveAccessRecoveryRequests();
  return true;
}

function renderPermissions() {
  const list = $("#permissions-list");
  if (!list) {
    return;
  }
  const staffForm = $("#staff-access-form");
  if (staffForm && !staffForm.contains(document.activeElement)) {
    const account = currentClinicAccount();
    staffForm.elements.staffEmail.value = account.staffEmail || "";
    staffForm.elements.staffPassword.value = account.staffPassword || "";
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

function setupAccessManagement() {
  $("#generate-staff-key")?.addEventListener("click", () => {
    const form = $("#staff-access-form");
    if (!form) {
      return;
    }
    const nextKey = generateAccessKey();
    form.elements.staffPassword.value = nextKey;
    $("#staff-access-status").textContent = `Clave generada: ${nextKey}. Pulsa Guardar recepcion para activarla.`;
  });

  $("#staff-access-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const staffEmail = form.elements.staffEmail.value.trim();
    const staffPassword = form.elements.staffPassword.value;
    if (staffEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffEmail)) {
      form.elements.staffEmail.setCustomValidity("Escribe un email valido.");
      form.reportValidity();
      form.elements.staffEmail.setCustomValidity("");
      return;
    }
    if (staffEmail && staffPassword.length < 4) {
      form.elements.staffPassword.setCustomValidity("La contrasena debe tener al menos 4 caracteres.");
      form.reportValidity();
      form.elements.staffPassword.setCustomValidity("");
      return;
    }
    if (!staffEmail && staffPassword) {
      form.elements.staffEmail.setCustomValidity("Indica el email del usuario de recepcion.");
      form.reportValidity();
      form.elements.staffEmail.setCustomValidity("");
      return;
    }
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey ? { ...account, staffEmail, staffPassword: staffEmail ? staffPassword : "" } : account
    )));
    saveClinicAccounts();
    let backendText = "";
    if (staffEmail) {
      try {
        await createBackendUserIfAvailable({
          name: "Recepcion",
          email: staffEmail,
          password: staffPassword,
          role: "staff",
          active: true
        });
        backendText = " Usuario backend creado.";
      } catch (error) {
        backendText = backendTokenForAccount(currentClinicAccount())
          ? ` No se pudo crear/actualizar el usuario backend: ${error.message}.`
          : " Sin sesion backend: acceso guardado localmente.";
      }
    }
    renderLoginProfiles();
    $("#staff-access-status").textContent = staffEmail
      ? `Acceso de recepcion guardado para esta clinica.${backendText}`
      : "Acceso de recepcion desactivado.";
    renderPermissions();
    renderSettings();
  });

  $("#generate-practitioner-key")?.addEventListener("click", () => {
    const form = $("#practitioner-form");
    if (!form) {
      return;
    }
    const nextKey = generateAccessKey();
    form.elements.password.value = nextKey;
    $("#practitioner-key-status").textContent = `Clave generada: ${nextKey}. Guarda el trabajador para activarla.`;
  });
}

async function hydrateFromApi() {
  if (!backendDataEnabled()) {
    return;
  }

  try {
    let [apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments] = await Promise.all([
      backendRequest("/patients"),
      backendRequest("/practitioners"),
      backendRequest("/rooms"),
      backendRequest("/services"),
      backendRequest("/appointments")
    ]);
    ({ apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments } = await bootstrapBackendDataIfNeeded({
      apiPatients,
      apiPractitioners,
      apiRooms,
      apiServices,
      apiAppointments
    }));
    patients = apiPatients.map((patient) => apiPatientToUi(patient, byId(patients, patient.id)));
    practitioners = normalizePractitioners(apiPractitioners.map((practitioner) => apiPractitionerToUi(practitioner, byId(practitioners, practitioner.id))));
    rooms = apiRooms.map((room) => apiRoomToUi(room));
    services = normalizeServices(apiServices.map((service) => apiServiceToUi(service)));
    appointments = normalizeAppointments(apiAppointments.map((appointment) => apiAppointmentToUi(appointment, byId(appointments, appointment.id))));
    selectedPatientId = patients[0]?.id || null;
    saveClinicState("patients", patients);
    saveClinicState("practitioners", practitioners);
    saveClinicState("rooms", rooms);
    saveClinicState("services", services);
    saveClinicState("appointments", appointments);
    renderAppointmentFormOptions();
    renderLoginProfiles();
    renderAll();
  } catch (error) {
    console.warn("Klinia backend data unavailable, keeping local cache.", error);
    showToast(`No se pudo sincronizar datos con backend: ${error.message}`, "warning");
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
  updateTopbarChrome();
  if (persist) {
    saveState("active-section", activeSection);
  }
  return true;
}

function entrySectionForCurrentSession() {
  if (subscriptionUseBlocked()) {
    return isOwner() ? "suscripcion" : "agenda";
  }
  if (canAccessSection("agenda")) {
    return "agenda";
  }
  const allowedSections = permissionsForCurrentSession();
  if (allowedSections.includes("disponibilidad") && canAccessSection("configuracion")) {
    return "configuracion";
  }
  return allowedSections.find((section) => visibleSectionIds.includes(section) && canAccessSection(section)) || "agenda";
}

function setEntrySection(persist = true) {
  const targetSection = entrySectionForCurrentSession();
  if (!setActiveSection(targetSection, persist) && targetSection !== "agenda") {
    setActiveSection("agenda", persist);
  }
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
    const fallback = subscriptionUseBlocked()
      ? "suscripcion"
      : canAccessSection(activeSection)
        ? activeSection
        : allowedSections.includes("disponibilidad")
          ? "configuracion"
          : allowedSections.find((section) => canAccessSection(section)) || "agenda";
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
  const account = currentClinicAccount();
  const blocked = subscriptionUseBlocked(account);
  activeSection = blocked && isOwner() ? "suscripcion" : "agenda";
  saveState("active-section", activeSection);
  isAuthenticated = true;
  saveState("authenticated", true);
  saveState("authenticated-at", Date.now());
  applyLoginState();
  renderFilters();
  renderAppointmentFormOptions();
  renderSession();
  setEntrySection(true);
  renderAll();
  if (blocked) {
    showToast(subscriptionBlockMessage(account), "warning");
  }
  syncCurrentSubscriptionFromBackend({ silent: true }).then((status) => {
    if (!status) return;
    applyRolePermissions();
    renderSaasSettings();
    if (subscriptionUseBlocked() && isOwner()) {
      activeSection = "suscripcion";
      saveState("active-section", activeSection);
      setActiveSection("suscripcion", false);
    }
  });
  hydrateFromApi();
}

const registerSteps = ["account", "clinic", "operations", "confirm", "success"];
let registerCreatedAccount = null;
let registerDraftState = {};
let registerLogoPreview = "";

function registerStepIndex(step) {
  const index = registerSteps.indexOf(step);
  return index >= 0 ? index : 0;
}

function registerFieldValue(name, fallback = "-") {
  const form = $("#register-form");
  const field = form?.elements?.[name];
  const value = typeof field?.value === "string" ? field.value.trim() : "";
  return value || fallback;
}

function setRegisterText(selector, value) {
  const item = $(selector);
  if (item) {
    item.textContent = value || "-";
  }
}

function registerFieldLabel(field) {
  const label = field?.closest?.("label");
  if (!label) {
    return field?.name || "Campo";
  }
  const ownText = [...label.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .join(" ");
  return ownText || field.name || "Campo";
}

function clearRegisterError() {
  const error = $("#register-error");
  if (error) {
    error.classList.remove("visible");
    error.textContent = "";
  }
  $$("#register-form [aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
}

function showRegisterError(message, field = null) {
  const error = $("#register-error");
  if (error) {
    error.textContent = message || "Completa los campos obligatorios antes de continuar.";
    error.classList.add("visible");
  }
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    field.focus({ preventScroll: true });
  }
}

function syncRegisterDraftFromForm() {
  const form = $("#register-form");
  if (!form) return;
  const draft = { flow: form.dataset.registerFlow || "trial", currentStep: registerCurrentStep(), fields: {}, checks: {} };
  $$("[data-register-step] input, [data-register-step] select, [data-register-step] textarea").forEach((field) => {
    if (!field.name || field.type === "file") return;
    if (field.type === "checkbox") {
      draft.checks[field.name] = draft.checks[field.name] || [];
      if (field.checked) {
        draft.checks[field.name].push(field.value);
      }
      return;
    }
    if (field.type === "radio") {
      if (field.checked) {
        draft.fields[field.name] = field.value;
      }
      return;
    }
    draft.fields[field.name] = field.value;
  });
  registerDraftState = draft;
}

function restoreRegisterDraftToForm() {
  const form = $("#register-form");
  if (!form || !registerDraftState.fields) return;
  Object.entries(registerDraftState.fields).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    if (field instanceof RadioNodeList) {
      field.value = value;
      return;
    }
    field.value = value;
  });
  Object.entries(registerDraftState.checks || {}).forEach(([name, values]) => {
    $$(`#register-form input[name='${name}']`).forEach((field) => {
      field.checked = values.includes(field.value);
    });
  });
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
  updateRegisterConfirmation();
}

function updateRegisterPreview() {
  const name = registerFieldValue("name", "Clinica Fisio Salud");
  const address = registerFieldValue("billingAddress", "Calle Mayor, 10");
  const postalCode = registerFieldValue("postalCode", "28001");
  const city = registerFieldValue("city", "Madrid");
  const logo = $("#register-preview-logo");
  if (logo) {
    logo.classList.toggle("hidden", !registerLogoPreview);
    logo.style.backgroundImage = registerLogoPreview ? `url("${registerLogoPreview}")` : "";
  }
  setRegisterText("[data-register-preview='clinicName']", name);
  setRegisterText("[data-register-preview='clinicAddress']", `${address}, ${postalCode} ${city}`.trim());
  setRegisterText("[data-register-preview='clinicPhone']", registerFieldValue("clinicPhone", "+34 600 123 456"));
  setRegisterText("[data-register-preview='clinicEmail']", registerFieldValue("clinicEmail", "info@clinica.com"));
}

function updateRegisterConfirmation() {
  const form = $("#register-form");
  if (!form) return;
  updateRegisterPreview();
  const address = registerFieldValue("billingAddress");
  const postalCode = registerFieldValue("postalCode", "");
  const city = registerFieldValue("city", "");
  const country = registerFieldValue("country", "");
  const start = registerFieldValue("openingStart", "09:00");
  const end = registerFieldValue("openingEnd", "20:00");
  setRegisterText("[data-register-summary='ownerName']", registerFieldValue("ownerName"));
  setRegisterText("[data-register-summary='email']", registerFieldValue("email"));
  setRegisterText("[data-register-summary='phone']", registerFieldValue("phone"));
  setRegisterText("[data-register-summary='ownerRole']", registerFieldValue("ownerRole"));
  setRegisterText("[data-register-summary='name']", registerFieldValue("name"));
  setRegisterText("[data-register-summary='taxId']", registerFieldValue("taxId"));
  setRegisterText("[data-register-summary='clinicEmail']", registerFieldValue("clinicEmail"));
  setRegisterText("[data-register-summary='fullAddress']", [address, postalCode, city, country].filter(Boolean).join(", ") || "-");
  setRegisterText("[data-register-summary='specialty']", registerFieldValue("specialty"));
  setRegisterText("[data-register-summary='clinicType']", registerFieldValue("clinicType"));
  setRegisterText("[data-register-summary='professionalsCount']", registerFieldValue("professionalsCount"));
  setRegisterText("[data-register-summary='schedule']", `${start} - ${end}`);
}

function setRegisterStep(step) {
  const form = $("#register-form");
  if (!form) return;
  syncRegisterDraftFromForm();
  const nextStep = registerSteps.includes(step) ? step : "account";
  form.dataset.currentRegisterStep = nextStep;
  const nextIndex = registerStepIndex(nextStep);
  $$("[data-register-step]").forEach((section) => {
    const active = section.dataset.registerStep === nextStep;
    section.hidden = !active;
    section.classList.toggle("active", active);
  });
  $$("[data-register-progress]").forEach((button) => {
    const buttonIndex = registerStepIndex(button.dataset.registerProgress);
    button.classList.toggle("active", buttonIndex === nextIndex);
    button.classList.toggle("completed", buttonIndex < nextIndex || nextStep === "success");
    button.disabled = nextStep === "success";
  });
  $(".register-body")?.scrollTo({ top: 0, behavior: "auto" });
  $("#register-back-button")?.classList.toggle("hidden", nextStep === "account" || nextStep === "success");
  $("#register-next-button")?.classList.toggle("hidden", !["account", "clinic", "operations"].includes(nextStep));
  $("#register-submit-button")?.classList.toggle("hidden", nextStep !== "confirm");
  $("#register-login-button")?.classList.toggle("hidden", nextStep !== "success");
  updateRegisterConfirmation();
}

function resetRegisterFlow(planId = "trial") {
  const form = $("#register-form");
  if (!form) return;
  form.reset();
  registerCreatedAccount = null;
  registerDraftState = {};
  registerLogoPreview = "";
  form.dataset.registerFlow = normalizeSaasPlanId(planId);
  form.elements.ownerName.value = "";
  form.elements.ownerRole.value = "Direccion";
  form.elements.password.value = "";
  form.elements.confirmPassword.value = "";
  form.elements.paymentPlan.value = form.dataset.registerFlow;
  updateRegisterPreview();
  clearRegisterError();
  updateRegisterPlanChoice();
  setRegisterStep("account");
}

function registerCurrentStep() {
  return $("#register-form")?.dataset.currentRegisterStep || "account";
}

function validateRegisterStep(step = registerCurrentStep()) {
  const form = $("#register-form");
  if (!form) return false;
  const fields = $$(`[data-register-step='${step}'] input, [data-register-step='${step}'] select, [data-register-step='${step}'] textarea`)
    .filter((field) => field.name !== "paymentPlan" && field.type !== "file" && !field.disabled);
  clearRegisterError();
  for (const field of fields) {
    field.setCustomValidity("");
    if (!field.checkValidity()) {
      const label = registerFieldLabel(field);
      const message = field.validity.valueMissing
        ? `Completa "${label}" antes de continuar.`
        : `Revisa "${label}" antes de continuar.`;
      showRegisterError(message, field);
      return false;
    }
    if (["email", "clinicEmail"].includes(field.name) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      showRegisterError(`Escribe un email valido en "${registerFieldLabel(field)}".`, field);
      return false;
    }
  }
  if (step === "account" && form.elements.password.value !== form.elements.confirmPassword.value) {
    showRegisterError("Las contrasenas no coinciden.", form.elements.confirmPassword);
    return false;
  }
  if (step === "operations" && !$$("#register-form input[name='days']:checked").length) {
    showRegisterError("Selecciona al menos un dia de atencion.");
    return false;
  }
  syncRegisterDraftFromForm();
  clearRegisterError();
  return true;
}

function moveRegisterStep(amount) {
  syncRegisterDraftFromForm();
  const current = registerCurrentStep();
  const currentIndex = registerStepIndex(current);
  if (amount > 0 && !validateRegisterStep(current)) {
    return;
  }
  const nextStep = registerSteps[Math.max(0, Math.min(3, currentIndex + amount))];
  restoreRegisterDraftToForm();
  setRegisterStep(nextStep);
}

function goToRegisterLogin() {
  const account = registerCreatedAccount;
  $("#register-dialog")?.close();
  showPublicView("login", { updateHash: true, resetLogin: false });
  showClinicLoginStep({ skipPublicView: true });
  if (account) {
    $("#login-clinic-select").value = account.name;
    $("#login-form").elements.password.value = "";
    $("#profile-form").elements.password.value = "";
    renderLoginProfiles();
  }
}

function publicViewFromHash() {
  const hash = String(window.location.hash || "").replace("#", "");
  if (hash === "login") return "login";
  if (hash === "ayuda") return "help";
  if (hash === "demo") return "demo";
  if (hash === "admin") return "superadmin";
  return "landing";
}

function publicHashForView(view) {
  return {
    landing: "planes",
    login: "login",
    help: "ayuda",
    demo: "demo",
    superadmin: "admin"
  }[view] || "planes";
}

function showPublicView(view = "landing", options = {}) {
  const nextView = ["landing", "login", "help", "demo", "superadmin"].includes(view) ? view : "landing";
  document.body.classList.toggle("superadmin-mode", nextView === "superadmin");
  $$(".public-view").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.publicScreen === nextView);
  });
  if (nextView === "login" && options.resetLogin !== false) {
    showClinicLoginStep({ skipPublicView: true, allowSavedCredentials: options.allowSavedCredentials !== false });
  }
  if (options.updateHash !== false && !isAuthenticated) {
    const nextHash = `#${publicHashForView(nextView)}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }
}

function updatePublicBillingCycle(cycle = "monthly") {
  const annual = cycle === "annual";
  $$("[data-billing-cycle]").forEach((button) => button.classList.toggle("selected", button.dataset.billingCycle === cycle));
  $("#professional-price-main").textContent = annual ? "500 EUR" : "50 EUR";
  $("#professional-price-period").textContent = annual ? "/año" : "/mes";
  $("#professional-price-note").textContent = annual
    ? "1 mes gratis, luego 500 EUR/año"
    : "1 mes gratis, luego 50 EUR/mes";
  $("#billing-cycle-note").textContent = annual ? "Ahorra 2 meses al año" : "Puedes cambiar a anual cuando quieras";
}

function openDemoAccess() {
  showPublicView("demo", { updateHash: true });
}

function enterDemoClinic() {
  activeSection = "agenda";
  saveState("active-section", activeSection);
  enterPlatform("owner", demoClinicKey);
}

function openRegisterDialogForPlan(planId = "trial") {
  const dialog = $("#register-dialog");
  const form = $("#register-form");
  if (!dialog || !form) return;
  const normalizedPlanId = normalizeSaasPlanId(planId);
  resetRegisterFlow(normalizedPlanId);
  const isProfessional = normalizedPlanId === "kliniaplan";
  $("#register-flow-eyebrow").textContent = isProfessional ? "Plan seleccionado" : "Prueba gratuita";
  $("#register-dialog-title").textContent = isProfessional ? "Empieza con el plan Profesional" : "Crea tu cuenta";
  $("#register-dialog-subtitle").textContent = isProfessional
    ? "Completa los pasos para activar tu primer mes gratis y preparar el plan Profesional."
    : "Empieza tu prueba gratuita durante 1 mes.";
  $("#register-error").classList.remove("visible");
  $("#register-error").textContent = "";
  dialog.showModal();
}

function setupPublicAccessNavigation() {
  $$("[data-public-view-target]").forEach((button) => {
    button.addEventListener("click", () => showPublicView(button.dataset.publicViewTarget));
  });
  $$("[data-open-register-plan]").forEach((button) => {
    button.addEventListener("click", () => openRegisterDialogForPlan(button.dataset.openRegisterPlan || "trial"));
  });
  $$("[data-open-demo]").forEach((button) => {
    button.addEventListener("click", openDemoAccess);
  });
  $("#demo-login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    enterDemoClinic();
  });
  $$("[data-billing-cycle]").forEach((button) => {
    button.addEventListener("click", () => updatePublicBillingCycle(button.dataset.billingCycle));
  });
  $$("[data-help-scroll-faq]").forEach((button) => {
    button.addEventListener("click", () => $("#help-faq")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  });
  $$("[data-help-expand-faq]").forEach((button) => {
    button.addEventListener("click", () => $$("#help-faq details").forEach((item) => item.open = true));
  });
  $("#forgot-password")?.addEventListener("click", () => {
    const dialog = $("#access-recovery-dialog");
    const form = $("#access-recovery-form");
    if (!dialog || !form) {
      return;
    }
    form.reset();
    form.elements.email.value = $("#login-form")?.elements.center.value.includes("@")
      ? $("#login-form").elements.center.value.trim()
      : "";
    $("#access-recovery-error").classList.remove("visible");
    $("#access-recovery-error").textContent = "";
    dialog.showModal();
  });
  $("#access-recovery-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $("#access-recovery-error").textContent = "Escribe el email de usuario.";
      $("#access-recovery-error").classList.add("visible");
      return;
    }
    createAccessRecoveryRequest(email);
    $("#access-recovery-dialog")?.close();
    await showNotice(
      "Solicitud enviada",
      "Si el email existe en una clinica, direccion vera la solicitud en Configuracion > Trabajadores y podra generar una clave nueva.",
      { variant: "success" }
    );
  });
  window.addEventListener("hashchange", () => {
    if (!isAuthenticated) {
      const nextPublicView = publicViewFromHash();
      if (nextPublicView === "superadmin") {
        restoreSuperadminSessionIfAvailable().then((restored) => {
          if (!restored) {
            showPublicView("login", { updateHash: true, resetLogin: true });
          }
        });
        return;
      }
      showPublicView(nextPublicView, { updateHash: false });
    }
  });
  updatePublicBillingCycle("monthly");
}

function setupLogin() {
  renderLoginClinics();
  showClinicLoginStep({ skipPublicView: true });
  setupPublicAccessNavigation();
  showPublicView(publicViewFromHash(), { updateHash: false });
  restoreSuperadminSessionIfAvailable().then((restored) => {
    if (!restored && publicViewFromHash() === "superadmin") {
      showPublicView("login", { updateHash: true, resetLogin: true });
    }
  });

  $("#login-clinic-select").addEventListener("change", renderLoginProfiles);
  $("#login-clinic-select").addEventListener("input", renderLoginProfiles);

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    clearLoginErrors();
    form.elements.center.removeAttribute("aria-invalid");
    form.elements.password.removeAttribute("aria-invalid");
    const identifier = form.elements.center.value.trim();
    const password = form.elements.password.value;
    if (!identifier || !password) {
      showLoginError("Escribe usuario y contraseña para entrar.", !identifier ? form.elements.center : form.elements.password);
      return;
    }
    const backendFirst = await tryBackendLogin(identifier, password);
    if (backendFirst.handled) {
      persistLoginCredentials(form, identifier, password);
      return;
    }
    if (backendFirst.error && backendRequiredForProduction()) {
      showLoginError(backendLoginMessage(backendFirst.error), backendFirst.error.status === 401 ? form.elements.password : form.elements.center);
      return;
    }

    const principal = loginPrincipalByIdentifier(form.elements.center.value);
    if (principal) {
      if (!principal.password) {
        showLoginError("Este usuario todavía no tiene una contraseña configurada.", form.elements.password);
        return;
      }
      if (password !== principal.password) {
        showLoginError("Contraseña incorrecta para este usuario.", form.elements.password);
        return;
      }
      persistLoginCredentials(form, identifier, password);
      await ensureBackendLoginForAccount(principal.account, password);
      enterPlatform(principal.profile, principal.account.key);
      return;
    }

    const account = clinicAccountByClinicIdentifier(form.elements.center.value) || clinicAccountByLogin(form.elements.center.value);
    if (!account) {
      const message = backendFirst.error
        ? backendLoginMessage(backendFirst.error)
        : "No encuentro esa clinica. Escribe el nombre o el email registrado.";
      showLoginError(message, backendFirst.error?.status === 401 ? form.elements.password : form.elements.center);
      return;
    }
    if (account.key === demoClinicKey) {
      showLoginError("La clínica demo se abre desde Demo visual, no desde el acceso real.", form.elements.center);
      return;
    }
    if (password !== clinicAccessPasswordForAccount(account)) {
      showLoginError("Contraseña incorrecta para esta clínica.", form.elements.password);
      return;
    }
    persistLoginCredentials(form, identifier, password);
    await ensureBackendLoginForAccount(account, password);
    showProfileLoginStep(account.key);
  });

  $("#profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setInlineError("#profile-login-error");
    form.elements.password.removeAttribute("aria-invalid");
    const account = clinicAccountByKey(pendingClinicKey || demoClinicKey);
    const profile = form.elements.profile.value;
    const loginPractitioners = normalizePractitioners(loadClinicStateFor(account.key, "practitioners", account.key === demoClinicKey ? defaultPractitioners : []));
    const practitioner = byId(loginPractitioners, profile);
    const expectedPassword = profile === "owner"
      ? ownerPasswordForAccount(account)
      : profile === "staff"
        ? account.staffPassword
        : practitioner?.password || "";
    if (!expectedPassword) {
      showProfileLoginError("Este perfil no tiene una contraseña propia configurada.", form.elements.password);
      return;
    }
    if (form.elements.password.value !== expectedPassword) {
      showProfileLoginError("Contraseña incorrecta para este perfil.", form.elements.password);
      return;
    }
    enterPlatform(profile, account.key);
  });

  $("#back-to-clinic-login").addEventListener("click", () => {
    showClinicLoginStep();
  });

  $$('input[name="paymentPlan"]').forEach((input) => {
    input.addEventListener("change", updateRegisterPlanChoice);
  });

  $("#register-next-button")?.addEventListener("click", () => moveRegisterStep(1));
  $("#register-back-button")?.addEventListener("click", () => moveRegisterStep(-1));
  $("#register-login-button")?.addEventListener("click", goToRegisterLogin);
  $("#register-form").addEventListener("input", () => {
    syncRegisterDraftFromForm();
    updateRegisterConfirmation();
  });
  $("#register-form").addEventListener("change", () => {
    syncRegisterDraftFromForm();
    updateRegisterConfirmation();
  });
  $("#register-form").elements.clinicLogoFile?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0] || null;
    registerLogoPreview = file ? await readFileAsDataUrl(file).catch(() => "") : "";
    updateRegisterPreview();
  });
  $$("#register-form [data-register-edit-step]").forEach((button) => {
    button.addEventListener("click", () => setRegisterStep(button.dataset.registerEditStep));
  });
  $$("#register-form [data-register-progress]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.registerProgress;
      const currentIndex = registerStepIndex(registerCurrentStep());
      const targetIndex = registerStepIndex(target);
      if (targetIndex <= currentIndex) {
        setRegisterStep(target);
      }
    });
  });

  $("#register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const currentRegisterStep = registerCurrentStep();
    if (currentRegisterStep !== "confirm") {
      moveRegisterStep(1);
      return;
    }
    if (!validateRegisterStep("confirm")) {
      return;
    }
    const name = form.elements.name.value.trim();
    const key = slugifyClinicName(name);
    const clinicEmail = form.elements.clinicEmail?.value.trim() || form.elements.email?.value.trim() || "";
    const taxId = form.elements.taxId?.value.trim() || "";
    const duplicateAccount = clinicAccounts.find((account) => {
      const sameKey = account.key === key;
      const sameName = String(account.name || "").trim().toLowerCase() === name.toLowerCase();
      const sameTaxId = taxId && String(account.billingProfile?.taxId || account.taxId || "").trim().toLowerCase() === taxId.toLowerCase();
      return sameKey || sameName || sameTaxId;
    });
    if (duplicateAccount) {
      const sameTaxId = taxId && String(duplicateAccount.billingProfile?.taxId || duplicateAccount.taxId || "").trim().toLowerCase() === taxId.toLowerCase();
      $("#register-error").textContent = sameTaxId
        ? "Ya existe una clinica con ese NIF/CIF. Revisa el dato o entra desde el selector de clinicas."
        : "Ya existe una clinica con ese nombre. Entra desde el selector de clinicas.";
      $("#register-error").classList.add("visible");
      return;
    }

    const paymentPlan = form.elements.paymentPlan?.value || "trial";
    const clinicPhone = form.elements.clinicPhone?.value.trim() || form.elements.phone?.value.trim() || "";
    const logoFile = form.elements.clinicLogoFile?.files?.[0] || null;
    const nextClinicLogo = logoFile ? await readFileAsDataUrl(logoFile).catch(() => "") : "";
    const billingProfile = {
      billingName: form.elements.billingName?.value.trim() || name,
      billingEmail: form.elements.billingEmail?.value.trim() || clinicEmail,
      taxId,
      billingAddress: form.elements.billingAddress?.value.trim() || ""
    };
    const account = {
      key,
      name,
      ownerName: form.elements.ownerName?.value.trim(),
      email: form.elements.email?.value.trim() || "",
      phone: clinicPhone || "No indicado",
      ownerPhone: form.elements.phone?.value.trim() || "",
      ownerRole: form.elements.ownerRole?.value || "Direccion",
      password: form.elements.password.value,
      ownerEmail: form.elements.email?.value.trim() || "",
      ownerPassword: form.elements.password.value,
      staffPassword: "",
      staffEmail: "",
      paymentPlan,
      billingStatus: "trial",
      subscriptionStatus: "trialing",
      trialEndsAt: addDaysIso(todayIso(), 30),
      checkoutUrl: paymentPlan === "trial" ? "" : `https://checkout.stripe.com/demo/${key}?plan=${paymentPlan}`,
      billingHistory: [],
      billingProfile
    };
    let backendSession = null;
    try {
      backendSession = await backendRequest("/auth/register-clinic", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          clinic_name: name,
          email: form.elements.email?.value.trim() || clinicEmail,
          password: form.elements.password.value,
          phone: clinicPhone,
          owner_name: account.ownerName,
          plan: paymentPlan,
          billing_name: billingProfile.billingName,
          billing_email: billingProfile.billingEmail || clinicEmail,
          tax_id: taxId || undefined,
          billing_address: billingProfile.billingAddress
        })
      });
      account.backendToken = backendSession.access_token || "";
      account.backendClinicId = backendSession.clinic_id || "";
      account.subscriptionStatus = backendSession.subscription_status || account.subscriptionStatus;
      account.billingStatus = backendSession.subscription_status || account.billingStatus;
      account.checkoutUrl = backendSession.checkout_url || account.checkoutUrl;
    } catch (error) {
      if (error.status === 409 || backendRequiredForProduction()) {
        $("#register-error").textContent = error.status === 409
          ? "Ya existe una clinica, email o NIF/CIF en el backend. Revisa los datos o entra desde Login."
          : `No se ha podido crear la clinica en el backend: ${error.message}`;
        $("#register-error").classList.add("visible");
        return;
      }
    }
    clinicAccounts = normalizeClinicAccounts([...clinicAccounts, account]);
    saveClinicAccounts();
    const createdAccount = clinicAccountByKey(key);

    activeClinicKey = key;
    saveClinicState("clinic", {
      name: account.name,
      email: clinicEmail,
      phone: clinicPhone,
      billingName: billingProfile.billingName,
      billingEmail: billingProfile.billingEmail,
      taxId: billingProfile.taxId,
      billingAddress: billingProfile.billingAddress,
      postalCode: form.elements.postalCode?.value.trim() || "",
      city: form.elements.city?.value.trim() || "",
      country: form.elements.country?.value || "Espana",
      specialty: form.elements.specialty?.value || "",
      clinicType: form.elements.clinicType?.value || "",
      professionalsCount: form.elements.professionalsCount?.value || "",
      website: form.elements.website?.value.trim() || "",
      instagram: form.elements.instagram?.value.trim() || "",
      facebook: form.elements.facebook?.value.trim() || "",
      openingStart: form.elements.openingStart?.value || "09:00",
      openingEnd: form.elements.openingEnd?.value || "20:00",
      timezone: form.elements.timezone?.value || "(GMT+01:00) Madrid",
      workingDays: $$("#register-form input[name='days']:checked").map((item) => normalizeWorkingDayKey(item.value)).filter(Boolean)
    });
    clinicLogo = nextClinicLogo;
    saveClinicState("clinic-logo", clinicLogo);
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
    saveClinicState("group-session-overrides", []);
    saveClinicState("reminder-actions", []);
    saveClinicState("reminder-settings", { autoWhatsapp: false });
    loadActiveClinicData(key);

    renderLoginClinics();
    $("#login-clinic-select").value = account.name;
    renderLoginProfiles();
    $("#login-form").elements.password.value = "";
    $("#profile-form").elements.password.value = "";
    registerCreatedAccount = createdAccount;
    updateRegisterPlanChoice();
    setRegisterStep("success");
    showToast("Clinica creada. Ya puedes iniciar sesion.");
  });

  $("#logout-button").addEventListener("click", () => {
    isAuthenticated = false;
    saveState("authenticated", false);
    saveState("authenticated-at", 0);
    applyLoginState();
    showPublicView("landing", { updateHash: true });
    showClinicLoginStep({ skipPublicView: true });
  });

  $("#superadmin-filter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    loadSuperadminPanel();
  });
  $("#superadmin-refresh-button")?.addEventListener("click", () => loadSuperadminPanel());
  $$(".superadmin-nav [data-superadmin-module]").forEach((button) => {
    button.addEventListener("click", () => setSuperadminModule(button.dataset.superadminModule));
  });
  $("#superadmin-global-search")?.addEventListener("input", renderSuperadminViews);
  $("#superadmin-clinic-status-filter")?.addEventListener("change", renderSuperadminClinicsTable);
  $("#superadmin-user-role-filter")?.addEventListener("change", renderSuperadminUsersTable);
  $("#superadmin-user-status-filter")?.addEventListener("change", renderSuperadminUsersTable);
  $("#superadmin-export-button")?.addEventListener("click", exportSuperadminCsv);
  $("#superadmin-detail-open-audit")?.addEventListener("click", () => {
    const clinic = clinicBySuperadminId();
    const filter = $("#superadmin-clinic-filter");
    if (clinic?.source === "backend" && filter) {
      filter.value = clinic.id;
      loadSuperadminPanel();
    }
    setSuperadminModule("audit");
  });
  $("#superadmin-detail-impersonate")?.addEventListener("click", () => {
    showToast("Impersonacion preparada: falta endpoint backend con auditoria y token temporal.", "warning");
  });
  $("#superadmin-notifications-button")?.addEventListener("click", () => {
    showToast("Notificaciones preparadas para conectar con alertas de soporte y sistema.", "info");
  });
  $(".superadmin-console")?.addEventListener("click", (event) => {
    const openClinicButton = event.target.closest("[data-superadmin-open-clinic]");
    if (openClinicButton) {
      selectedSuperadminClinicId = openClinicButton.dataset.superadminOpenClinic;
      setSuperadminModule("clinic-detail");
      return;
    }
    const impersonateButton = event.target.closest("[data-superadmin-impersonate]");
    if (impersonateButton) {
      selectedSuperadminClinicId = impersonateButton.dataset.superadminImpersonate;
      setSuperadminModule("clinic-detail");
      showToast("Impersonacion preparada: requiere endpoint seguro antes de activarla.", "warning");
      return;
    }
    const userAction = event.target.closest("[data-superadmin-user-action]");
    if (userAction) {
      showToast("Accion de usuario preparada: falta endpoint backend especifico y auditoria de ejecucion.", "warning");
    }
  });
  $("#superadmin-logout-button")?.addEventListener("click", async () => {
    const token = superadminToken();
    if (token) {
      await backendRequest("/auth/logout", { method: "POST", token, auth: false }).catch(() => null);
    }
    clearSuperadminSession();
    showPublicView("login", { updateHash: true, resetLogin: true });
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

function openAutoCloseMenus() {
  return $$("details.item-menu[open], details.worker-filter[open]");
}

function closeAutoCloseMenus(exceptMenu = null) {
  openAutoCloseMenus().forEach((menu) => {
    if (menu !== exceptMenu) {
      menu.removeAttribute("open");
    }
  });
}

function setupAutoCloseOptionMenus() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const currentMenu = target?.closest("details.item-menu, details.worker-filter") || null;
    closeAutoCloseMenus(currentMenu);

    if (target?.closest(".item-menu-popover button")) {
      currentMenu?.removeAttribute("open");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAutoCloseMenus();
    }
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
  $("#create-available-recurring")?.addEventListener("click", async () => {
    const dialog = $("#appointment-dialog");
    const form = $("#appointment-form");
    if (!pendingRecurringReview?.available?.length) return;
    await finishAppointmentCreation(pendingRecurringReview.available, dialog, form);
    resetRecurrenceReview();
  });
}

async function finishAppointmentCreation(newAppointments, dialog = $("#appointment-dialog"), form = $("#appointment-form")) {
  let items = Array.isArray(newAppointments) ? newAppointments : [newAppointments];
  if (backendDataEnabled()) {
    try {
      items = await Promise.all(items.map((item) => saveAppointmentToBackend(item, item.id)));
    } catch (error) {
      const errorBox = $("#form-error");
      if (errorBox) {
        errorBox.textContent = `No se pudo guardar la cita en backend: ${error.message}`;
        errorBox.classList.add("visible");
      } else {
        showToast(`No se pudo guardar la cita en backend: ${error.message}`, "error");
      }
      return;
    }
  }
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

  form.addEventListener("submit", async (event) => {
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
      paymentStatus: "unpaid",
      paymentMethod: "",
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
    const outsideHours = isOutsidePractitionerHours(practitioner, candidate.start, candidateEnd, candidate.date || selectedDate);
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

    await finishAppointmentCreation(candidates, dialog, form);
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
    <dd>${servicePrice(appointment)} EUR${appointment.patientPackId || appointment.plannedPatientPackId ? ` (valor interno ${appointmentRevenueAmount(appointment)} EUR)` : ""}</dd>
    <dt>Cobro</dt>
    <dd>${paymentStatusLabel(appointmentPaymentStatus(appointment))}</dd>
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
  form.elements.status.value = normalizeAppointmentStatus(appointment.status);
  if (form.elements.paymentStatus) {
    form.elements.paymentStatus.value = appointmentPaymentStatus(appointment);
  }
  if (form.elements.cancelledBy) {
    form.elements.cancelledBy.value = appointment.cancelledBy || "";
  }
  form.querySelector(".cancelled-by-field")?.classList.toggle("hidden", normalizeAppointmentStatus(appointment.status) !== "cancelled");
  const packField = form.querySelector(".appointment-pack-field");
  const packSelect = form.elements.patientPack;
  if (packField && packSelect) {
    const selectedPackId = appointment.patientPackId || appointment.plannedPatientPackId || "";
    const availablePacks = patientPacksForAppointment(appointment);
    packSelect.innerHTML = "";
    packSelect.append(new Option("No usar bono", ""));
    availablePacks.forEach((pack) => packSelect.append(new Option(`${pack.name} - ${patientPackRemaining(pack)} disponibles - ${patientPackExpiryLabel(pack)}`, pack.id)));
    if (selectedPackId && !availablePacks.some((pack) => pack.id === selectedPackId)) {
      const usedPack = byId(patientPacks, selectedPackId);
      if (usedPack) packSelect.append(new Option(`${usedPack.name} - ${appointment.patientPackId ? "aplicado" : "previsto"}`, usedPack.id));
    }
    packSelect.value = selectedPackId;
    packField.classList.toggle("hidden", packSelect.options.length <= 1 && !selectedPackId);
  }
  form.elements.internalNotes.value = appointment.internalNotes || "";
  const invoiceButton = $("#appointment-invoice-button");
  if (invoiceButton) {
    invoiceButton.textContent = appointment.invoiceGenerated ? "Reimprimir factura" : "Generar factura";
    invoiceButton.disabled = normalizeAppointmentStatus(appointment.status) === "cancelled";
  }
  const attendanceButton = $("#appointment-attendance-button");
  if (attendanceButton) {
    attendanceButton.disabled = normalizeAppointmentStatus(appointment.status) === "cancelled";
  }
  $("#appointment-detail-dialog").showModal();
}


function generateAttendanceCertificate(appointment) {
  if (!appointment) {
    return;
  }
  if (normalizeAppointmentStatus(appointment.status) === "cancelled") {
    showNotice("Cita cancelada", "No se puede generar justificante de asistencia para una cita cancelada.", { variant: "warning" });
    return;
  }

  const patient = byId(patients, appointment.patientId);
  const practitioner = byId(practitioners, appointment.practitionerId);
  const service = byId(services, appointment.serviceId);
  const certificateNumber = `JA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const clinicAddress = clinic.address || clinic.billingAddress || "";
  const endTime = appointment.end || appointmentEnd(appointment);
  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Justificante ${certificateNumber}</title>
<style>
body{font-family:Arial,sans-serif;margin:36px;color:#202621;line-height:1.5}
header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #d9e7e2;padding-bottom:18px;margin-bottom:34px}
img{max-width:90px;max-height:90px;object-fit:contain}
h1{margin:0 0 8px;font-size:26px}
.meta{color:#5d6a63;font-size:14px}
.box{border:1px solid #d9e7e2;border-radius:12px;padding:22px;margin:22px 0;background:#f8fbfa}
.signature{margin-top:54px;display:flex;justify-content:space-between;gap:42px}
.signature div{width:45%;border-top:1px solid #8aa39a;padding-top:10px;color:#5d6a63}
</style></head>
<body>
<header>
  <div>${clinicLogo ? `<img src="${clinicLogo}" alt="Logo de la clinica">` : ""}<h1>${clinic.name || "Klinia"}</h1><p class="meta">${clinic.email || ""}<br>${clinic.phone || ""}<br>${clinicAddress}</p></div>
  <div><strong>Justificante ${certificateNumber}</strong><p class="meta">Emitido: ${new Date().toLocaleDateString("es-ES")}</p></div>
</header>
<main>
  <p>Por la presente se hace constar que <strong>${patient?.name || "el/la paciente"}</strong>${patient?.dni ? `, con DNI/NIE ${patient.dni}` : ""}, ha asistido a una cita en ${clinic.name || "la clinica"}.</p>
  <section class="box">
    <p><strong>Fecha:</strong> ${new Date(`${appointment.date || selectedDate}T00:00:00`).toLocaleDateString("es-ES")}</p>
    <p><strong>Horario:</strong> ${appointment.start} - ${endTime}</p>
    <p><strong>Servicio:</strong> ${service?.name || "Servicio"}</p>
    <p><strong>Profesional:</strong> ${practitioner?.name || "Profesional"}</p>
  </section>
  <p>Este justificante se expide a peticion de la persona interesada para los efectos oportunos.</p>
  <section class="signature">
    <div>Firma / sello de la clinica</div>
    <div>Firma del profesional</div>
  </section>
</main>
</body></html>`;
  downloadTextFile(`justificante-${certificateNumber}.html`, html, "text/html");
}


async function generateInvoiceForAppointment(appointment) {
  const invoiceLockKey = String(appointment?.id || "");
  if (!appointment || appointmentInvoiceLocks.has(invoiceLockKey)) {
    showToast("La factura ya se esta procesando.", "warning");
    return;
  }
  if (normalizeAppointmentStatus(appointment.status) === "cancelled") {
    await showNotice("Cita cancelada", "Las citas canceladas se eliminan del flujo de facturacion.", { variant: "warning" });
    return;
  }

  appointmentInvoiceLocks.add(invoiceLockKey);
  const invoiceButton = String(selectedAppointmentId) === String(appointment.id) ? $("#appointment-invoice-button") : null;
  const previousButtonText = invoiceButton?.textContent || "";
  if (invoiceButton) {
    invoiceButton.disabled = true;
    invoiceButton.textContent = appointment.invoiceGenerated ? "Preparando..." : "Esperando confirmacion...";
  }

  try {
    const hasPack = Boolean(appointment.patientPackId || appointment.plannedPatientPackId);
    let invoiceAppointment = { ...appointment };
    if (hasPack && !appointment.invoiceGenerated) {
      const pack = byId(patientPacks, appointment.patientPackId || appointment.plannedPatientPackId);
      if (!appointment.patientPackId) {
        const validationMessage = validatePatientPackConsumption(pack, {
          patientId: appointment.patientId,
          serviceId: appointment.serviceId
        });
        if (validationMessage) {
          await showNotice("Bono no disponible", `No se puede facturar esta cita como cubierta por bono. ${validationMessage}`, { variant: "warning" });
          return;
        }
      }
      const confirmed = await showConfirm({
        title: "Confirmar facturacion con bono",
        message: `Esta cita usa el bono ${pack?.name || "del paciente"}.`,
        detail: "Solo se generara la factura si confirmas. El importe sera 0 EUR porque la sesion queda cubierta por el bono.",
        confirmLabel: "Generar factura",
        variant: "primary"
      });
      if (!confirmed) return;
      if (!appointment.patientPackId && appointment.plannedPatientPackId) {
        const consumeResult = usePatientPackForAppointment(appointment, appointment.plannedPatientPackId);
        if (!consumeResult.ok) {
          await showNotice("Bono no disponible", consumeResult.message || "No quedan sesiones disponibles en el bono seleccionado.", { variant: "warning" });
          return;
        }
        invoiceAppointment = {
          ...appointment,
          patientPackId: appointment.plannedPatientPackId,
          plannedPatientPackId: "",
          patientPackUsedAt: consumeResult.consumedAt || new Date().toISOString()
        };
      }
    }

    const patient = byId(patients, invoiceAppointment.patientId);
    const practitioner = byId(practitioners, invoiceAppointment.practitionerId);
    const service = byId(services, invoiceAppointment.serviceId);
    const amount = servicePrice(invoiceAppointment);
    const invoiceNumber = appointment.invoiceNumber || `KL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Factura ${invoiceNumber}</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#202621}header{display:flex;justify-content:space-between;gap:24px;border-bottom:1px solid #ddd;padding-bottom:18px}img{max-width:90px;max-height:90px}h1{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:28px}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:22px;font-weight:700;margin-top:24px}</style></head>
<body>
<header><div>${clinicLogo ? `<img src="${clinicLogo}" alt="Logo">` : ""}<h1>${clinic.name || "Klinia"}</h1><p>${clinic.email || ""}<br>${clinic.phone || ""}</p></div><div><strong>Factura ${invoiceNumber}</strong><p>Fecha: ${new Date().toLocaleDateString("es-ES")}</p></div></header>
<section><h2>Paciente</h2><p>${patient?.name || "Paciente"}<br>${patient?.dni || ""}<br>${patientLocationLine(patient)}</p></section>
<table><thead><tr><th>Fecha cita</th><th>Servicio</th><th>Profesional</th><th>Importe</th></tr></thead><tbody><tr><td>${invoiceAppointment.date || selectedDate} ${invoiceAppointment.start}</td><td>${service?.name || "Servicio"}</td><td>${practitioner?.name || "Profesional"}</td><td>${amount} EUR</td></tr></tbody></table>
<p class="total">Total: ${amount} EUR</p>
</body></html>`;
    downloadTextFile(`factura-${invoiceNumber}.html`, html, "text/html");
    appointments = appointments.map((item) => item.id === appointment.id ? { ...item, ...invoiceAppointment, invoiceGenerated: true, invoiceGeneratedAt: new Date().toISOString(), invoiceNumber } : item);
    saveClinicState("appointments", appointments);
    syncPatientPackUsageFromAppointments({ persist: true });
    openAppointmentDetail(appointment.id);
  } finally {
    appointmentInvoiceLocks.delete(invoiceLockKey);
    if (invoiceButton?.isConnected) {
      invoiceButton.disabled = false;
      invoiceButton.textContent = previousButtonText;
    }
  }
}

function setupAppointmentDetail() {
  $("#appointment-detail-form")?.elements.status?.addEventListener("change", (event) => {
    $("#appointment-detail-form")?.querySelector(".cancelled-by-field")?.classList.toggle("hidden", event.target.value !== "cancelled");
    if (event.target.value === "cancelled" && $("#appointment-detail-form")?.elements.cancelledBy && !$("#appointment-detail-form").elements.cancelledBy.value.trim()) {
      $("#appointment-detail-form").elements.cancelledBy.value = currentSessionName();
    }
  });
  $("#appointment-invoice-button")?.addEventListener("click", async () => {
    const appointment = byId(appointments, selectedAppointmentId);
    if (!appointment) return;
    await generateInvoiceForAppointment(appointment);
  });
  $("#appointment-attendance-button")?.addEventListener("click", () => {
    const appointment = byId(appointments, selectedAppointmentId);
    generateAttendanceCertificate(appointment);
  });
  $("#appointment-detail-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const detailError = $("#appointment-detail-error");
    detailError?.classList.remove("visible");
    if (detailError) detailError.textContent = "";
    const nextStatus = normalizeAppointmentStatus(form.elements.status.value);
    const finalStatusIsCancelled = nextStatus === "cancelled";
    const existingAppointment = byId(appointments, selectedAppointmentId);
    const selectedPackId = form.elements.patientPack?.value || "";
    let nextPatientPackId = existingAppointment?.patientPackId || "";
    let nextPlannedPatientPackId = existingAppointment?.plannedPatientPackId || "";
    let nextPatientPackUsedAt = existingAppointment?.patientPackUsedAt || "";
    let restoredExistingPack = false;
    let consumedPatientPackAt = "";
    if (existingAppointment?.patientPackId && (finalStatusIsCancelled || existingAppointment.patientPackId !== selectedPackId)) {
      restorePatientPackUse(existingAppointment.patientPackId);
      nextPatientPackId = "";
      nextPatientPackUsedAt = "";
      restoredExistingPack = true;
    }
    if (!finalStatusIsCancelled && selectedPackId && existingAppointment?.patientPackId !== selectedPackId) {
      const consumeResult = usePatientPackForAppointment(existingAppointment, selectedPackId);
      if (!consumeResult.ok) {
        if (restoredExistingPack && existingAppointment?.patientPackId) {
          usePatientPackForAppointment(existingAppointment, existingAppointment.patientPackId);
          nextPatientPackId = existingAppointment.patientPackId;
          nextPatientPackUsedAt = existingAppointment.patientPackUsedAt || new Date().toISOString();
        }
        const message = consumeResult.message || "El bono seleccionado no tiene sesiones disponibles. No se puede confirmar esta cita consumiendo ese bono.";
        if (detailError) {
          detailError.textContent = message;
          detailError.classList.add("visible");
        } else {
          await showNotice("Bono agotado", message, { variant: "warning" });
        }
        return;
      }
      nextPatientPackId = selectedPackId;
      nextPlannedPatientPackId = "";
      consumedPatientPackAt = consumeResult.consumedAt || new Date().toISOString();
      nextPatientPackUsedAt = consumedPatientPackAt;
    }
    if (!finalStatusIsCancelled && selectedPackId && existingAppointment?.patientPackId === selectedPackId) {
      nextPatientPackId = selectedPackId;
      nextPlannedPatientPackId = "";
      nextPatientPackUsedAt = existingAppointment.patientPackUsedAt || new Date().toISOString();
    }
    if (!finalStatusIsCancelled && !selectedPackId) {
      nextPlannedPatientPackId = "";
      nextPatientPackId = "";
      nextPatientPackUsedAt = "";
    }
    if (finalStatusIsCancelled) {
      nextPlannedPatientPackId = "";
    }
    const cancelledBy = finalStatusIsCancelled
      ? (form.elements.cancelledBy?.value.trim() || currentSessionName())
      : "";
    const payload = {
      status: nextStatus,
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
      syncPatientPackUsageFromAppointments({ persist: true });
      $("#appointment-detail-dialog").close();
      renderAll();
    };

    const localUpdate = {
      ...existingAppointment,
      status: nextStatus,
      internalNotes: form.elements.internalNotes.value.trim(),
      paymentStatus: form.elements.paymentStatus?.value || appointmentPaymentStatus(existingAppointment),
      paymentMethod: form.elements.paymentStatus?.value || appointmentPaymentStatus(existingAppointment),
      patientPackId: nextPatientPackId,
      plannedPatientPackId: nextPlannedPatientPackId,
      patientPackUsedAt: nextPatientPackId ? (nextPatientPackUsedAt || consumedPatientPackAt || new Date().toISOString()) : "",
      cancelledBy,
      cancelledAt: finalStatusIsCancelled ? (existingAppointment?.cancelledAt || new Date().toISOString()) : ""
    };

    if (backendDataEnabled()) {
      try {
        const savedAppointment = await saveAppointmentToBackend(localUpdate, selectedAppointmentId);
        finish(savedAppointment);
      } catch (error) {
        if (detailError) {
          detailError.textContent = `No se pudo actualizar la cita en backend: ${error.message}`;
          detailError.classList.add("visible");
        }
      }
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
  renderPatientDniFilePanel(null);
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
  form.elements.dni.value = patient.dni || "";
  form.elements.sex.value = patient.sex || "";
  form.elements.birthDate.value = patient.birthDate || "";
  form.elements.occupation.value = patient.occupation || "";
  form.elements.phone.value = patient.phone || "";
  form.elements.email.value = patient.email || "";
  form.elements.municipality.value = patient.municipality || "";
  form.elements.city.value = patient.city || "";
  form.elements.postalCode.value = patient.postalCode || "";
  form.elements.alert.value = patient.alert || "";
  renderPatientDniFilePanel(patient);
  form.querySelector(".modal-header h2").textContent = "Editar paciente";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  $("#patient-dialog").showModal();
}

async function deletePatientById(patientId) {
  const patient = byId(patients, patientId);
  if (!patient || !canManageOperations()) return;
  const inUse = appointments.some((appointment) => appointment.patientId === patientId)
    || groups.some((group) => (group.patientIds || []).includes(patientId))
    || groupDropIns.some((entry) => entry.patientId === patientId);
  if (inUse) {
    await showNotice("No se puede eliminar", "No se puede eliminar una persona con citas o grupos asociados.", { variant: "warning" });
    return;
  }
  const confirmed = await showConfirm({
    title: "Eliminar paciente",
    message: `Eliminar a ${patient.name}?`,
    detail: "Esta accion no se puede deshacer.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  try {
    await deletePatientFromBackend(patientId);
  } catch (error) {
    showToast(`No se pudo eliminar en backend: ${error.message}`, "error");
    return;
  }
  patients = patients.filter((item) => item.id !== patientId);
  if (selectedPatientId === patientId) {
    selectedPatientId = patients[0]?.id || null;
  }
  saveClinicState("patients", patients);
  renderAppointmentFormOptions();
  renderAll();
  showToast("Paciente eliminado.");
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
    const removeDniFile = Boolean(form.elements.removeDniFile?.checked);
    let dniFileData = removeDniFile ? "" : (existingPatient?.dniFileData || "");
    let dniFileName = removeDniFile ? "" : (existingPatient?.dniFileName || "");
    if (dniFile) {
      dniFileData = await readFileAsDataUrl(dniFile).catch(() => "");
      if (!dniFileData) {
        const error = $("#patient-form-error");
        if (error) {
          error.textContent = "No se ha podido leer el archivo de DNI. Intenta adjuntarlo de nuevo.";
          error.classList.add("visible");
        }
        form.elements.dniFile?.focus();
        return;
      }
      dniFileName = dniFile.name;
    }
    const localPatient = {
      id: form.dataset.editingPatientId || `p${Date.now()}`,
      firstName: form.elements.firstName?.value.trim() || "",
      lastName: form.elements.lastName?.value.trim() || "",
      name: patientName,
      dni: form.elements.dni?.value.trim() || "",
      dniFileName,
      dniFileData,
      sex: form.elements.sex?.value || "",
      birthDate: form.elements.birthDate?.value || "",
      occupation: form.elements.occupation?.value.trim() || "",
      phone: form.elements.phone?.value.trim() || "No indicado",
      email: form.elements.email?.value.trim() || "",
      municipality: form.elements.municipality?.value.trim() || "",
      city: form.elements.city?.value.trim() || "",
      postalCode: form.elements.postalCode?.value.trim() || "",
      address: [form.elements.municipality?.value.trim(), form.elements.city?.value.trim(), form.elements.postalCode?.value.trim()].filter(Boolean).join(", "),
      alert: form.elements.alert?.value.trim() || "Sin alertas relevantes",
      last: byId(patients, form.dataset.editingPatientId)?.last || "Sin citas",
      status: byId(patients, form.dataset.editingPatientId)?.status || "Activo"
    };

    const finish = (patient) => {
      const editingPatientId = form.dataset.editingPatientId || "";
      patients = editingPatientId
        ? patients.map((item) => item.id === editingPatientId ? patient : item)
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
        window.setTimeout(() => {
          if (status.textContent.includes("Paciente")) {
            status.textContent = "";
          }
        }, 3200);
      }
    };

    if (backendDataEnabled()) {
      try {
        const savedPatient = await savePatientToBackend(localPatient, form.dataset.editingPatientId || "");
        finish(savedPatient);
      } catch (error) {
        const errorBox = $("#patient-form-error");
        if (errorBox) {
          errorBox.textContent = `No se pudo guardar en backend: ${error.message}`;
          errorBox.classList.add("visible");
        }
      }
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

async function deleteServiceById(serviceId) {
  const service = byId(services, serviceId);
  if (!service || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.serviceId === serviceId) || groups.some((group) => group.serviceId === serviceId);
  if (inUse) {
    await showNotice("No se puede eliminar", "No se puede eliminar un servicio con citas o grupos asociados. Puedes editarlo y marcarlo como inactivo.", { variant: "warning" });
    return;
  }
  const confirmed = await showConfirm({
    title: "Eliminar servicio",
    message: `Eliminar el servicio ${service.name}?`,
    detail: "Esta accion no se puede deshacer.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  try {
    await deleteServiceFromBackend(serviceId);
  } catch (error) {
    showToast(`No se pudo eliminar en backend: ${error.message}`, "error");
    return;
  }
  services = services.filter((item) => item.id !== serviceId);
  saveClinicState("services", services);
  renderAppointmentFormOptions();
  renderAll();
  showToast("Servicio eliminado.");
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const serviceType = form.elements.groupSession?.checked ? "group" : "individual";
    const editingServiceId = form.dataset.editingServiceId || "";
    const localService = {
      id: editingServiceId || `svc${Date.now()}`,
      name: form.elements.name.value.trim(),
      description: form.elements.description.value.trim(),
      duration: Number(form.elements.duration.value),
      price: serviceType === "group"
        ? Number(form.elements.dropInPrice?.value || form.elements.monthlyPrice?.value || 0)
        : Number(form.elements.price.value),
      type: serviceType,
      capacity: serviceType === "group" ? Number(form.elements.capacity?.value || 1) : 1,
      monthlyPrice: serviceType === "group" ? Number(form.elements.monthlyPrice?.value || 0) : 0,
      dropInPrice: serviceType === "group" ? Number(form.elements.dropInPrice?.value || form.elements.price.value || 0) : 0,
      commissionPerPatient: serviceType === "group" ? parseDecimal(form.elements.commissionPerPatient?.value, 0) : 0,
      active: form.elements.active.checked
    };

    const finish = (service) => {
      services = editingServiceId
        ? services.map((item) => item.id === editingServiceId ? service : item)
        : [...services, service];
      saveClinicState("services", services);
      renderAppointmentFormOptions();
      resetServiceForm(form);
      dialog.close();
      renderAll();
    };

    if (backendDataEnabled()) {
      try {
        const savedService = await saveServiceToBackend(localService, editingServiceId);
        finish(savedService);
      } catch (error) {
        showToast(`No se pudo guardar el servicio en backend: ${error.message}`, "error");
      }
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
  renderGroupFormPatientSelection(form);
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
  renderGroupFormPatientSelection(form);
  form.querySelector(".modal-header h2").textContent = "Editar sesion grupal";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
}

function selectedGroupFormPatientIds(form = $("#group-form")) {
  return form?.elements.patients ? [...form.elements.patients.selectedOptions].map((option) => option.value) : [];
}

function setGroupFormPatientIds(ids, form = $("#group-form")) {
  const selected = new Set(ids);
  [...(form?.elements.patients?.options || [])].forEach((option) => {
    option.selected = selected.has(option.value);
  });
  renderGroupFormPatientSelection(form);
}

function renderGroupFormPatientSelection(form = $("#group-form")) {
  const list = $("#group-form-patient-list");
  const addSelect = $("#group-form-patient-add");
  if (!form || !list || !addSelect || !form.elements.patients) return;
  const selectedIds = selectedGroupFormPatientIds(form);
  const selected = selectedIds.map((id) => byId(patients, id)).filter(Boolean);
  list.innerHTML = selected.length
    ? selected.map((patient) => `
      <span class="group-fixed-chip">
        ${escapeHtml(patient.name)}
        <button type="button" data-group-form-remove-patient="${patient.id}" aria-label="Quitar ${escapeHtml(patient.name)}">x</button>
      </span>
    `).join("")
    : `<span class="muted-text">Sin pacientes inscritos.</span>`;

  addSelect.innerHTML = "";
  patients
    .filter((patient) => !selectedIds.includes(patient.id))
    .forEach((patient) => addSelect.append(new Option(`${patient.name} - ${patient.phone || "sin telefono"}`, patient.id)));
  addSelect.disabled = !addSelect.options.length;
  $("#group-form-add-patient").disabled = addSelect.disabled;

  $$("[data-group-form-remove-patient]").forEach((button) => {
    button.addEventListener("click", () => {
      setGroupFormPatientIds(selectedIds.filter((id) => id !== button.dataset.groupFormRemovePatient), form);
    });
  });
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

async function deleteGroupById(groupId) {
  const group = groups.find((item) => item.id === groupId);
  if (!group) return;
  const confirmed = await showConfirm({
    title: "Eliminar sesion grupal",
    message: `Eliminar el grupo ${group.name}?`,
    detail: "Tambien se retiraran sus sesiones sueltas, cambios puntuales y registros de produccion asociados.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  groups = groups.filter((item) => item.id !== groupId);
  groupDropIns = groupDropIns.filter((entry) => entry.groupId !== groupId);
  groupCompletions = groupCompletions.filter((entry) => entry.groupId !== groupId);
  groupSessionOverrides = groupSessionOverrides.filter((entry) => entry.groupId !== groupId);
  saveClinicState("groups", groups);
  saveClinicState("group-dropins", groupDropIns);
  saveClinicState("group-completions", groupCompletions);
  saveClinicState("group-session-overrides", groupSessionOverrides);
  renderAll();
  showToast("Sesion grupal eliminada.");
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
  renderGroupFormPatientSelection(form);
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

  $("#group-form-add-patient")?.addEventListener("click", () => {
    const patientId = $("#group-form-patient-add")?.value;
    if (!patientId) return;
    const selected = selectedGroupFormPatientIds(form);
    const capacity = Math.max(1, Number(form.elements.capacity.value || 1));
    if (selected.length >= capacity) {
      $("#group-form-error").textContent = "No quedan plazas disponibles en esta sesion.";
      $("#group-form-error").classList.add("visible");
      return;
    }
    $("#group-form-error").classList.remove("visible");
    $("#group-form-error").textContent = "";
    setGroupFormPatientIds([...selected, patientId], form);
  });

  form.elements.capacity?.addEventListener("change", () => renderGroupFormPatientSelection(form));

  form.addEventListener("submit", async (event) => {
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

    const practitioner = byId(practitioners, group.practitionerId);
    const service = byId(services, group.serviceId);
    const groupEndTime = addMinutes(group.start, service?.duration || 60);
    const weekStart = weekStartIso(selectedDate);
    const outsideDays = selectedDays.filter((dayKey) => {
      let dateForDay = weekStart;
      for (let index = 0; index < 7; index += 1) {
        const candidateDate = addDaysIso(weekStart, index);
        if (dayKeyFor(candidateDate) === dayKey) {
          dateForDay = candidateDate;
          break;
        }
      }
      return isOutsidePractitionerHours(practitioner, group.start, groupEndTime, dateForDay);
    });
    if (outsideDays.length) {
      const confirmedOutside = await showConfirm({
        title: "Sesion fuera de horario",
        message: `${practitioner?.name || "El trabajador"} no tiene jornada configurada para ${outsideDays.map((day) => weekDayLabels[day] || day).join(", ")} a las ${group.start}.`,
        detail: "Puedes guardar la sesion igualmente, pero revisa la disponibilidad del trabajador.",
        confirmLabel: "Guardar igualmente",
        variant: "primary"
      });
      if (!confirmedOutside) {
        return;
      }
    }

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
  $("#group-exception-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const baseGroup = groupBaseById(dialog.dataset.groupId);
    const dateValue = dialog.dataset.date || selectedDate;
    const form = event.currentTarget;
    const error = $("#group-exception-error");
    if (!baseGroup) return;
    const candidate = {
      practitionerId: form.elements.practitioner.value,
      start: form.elements.start.value || baseGroup.start
    };
    if (!candidate.practitionerId || !candidate.start) {
      error.textContent = "Selecciona trabajador y hora para esta sesion.";
      error.classList.add("visible");
      return;
    }
    const conflict = groupSessionExceptionConflict(baseGroup, dateValue, candidate);
    if (conflict) {
      error.textContent = conflict;
      error.classList.add("visible");
      return;
    }
    saveGroupSessionOverride(baseGroup.id, dateValue, candidate);
    const updatedGroup = groupsForDate(dateValue).find((item) => item.id === baseGroup.id) || groupInstanceForDate(baseGroup, dateValue);
    syncGroupCompletionForSession(updatedGroup, dateValue);
    updateGroupSessionHeader(updatedGroup, dateValue);
    renderGroupSessionPanel(updatedGroup, dateValue);
    renderAll();
    showToast(updatedGroup.sessionOverride ? "Sesion puntual actualizada." : "Sesion restaurada a la serie.");
  });
  $("#clear-group-exception")?.addEventListener("click", () => {
    const baseGroup = groupBaseById(dialog.dataset.groupId);
    const dateValue = dialog.dataset.date || selectedDate;
    if (!baseGroup) return;
    clearGroupSessionOverride(baseGroup.id, dateValue);
    const updatedGroup = groupInstanceForDate(baseGroup, dateValue);
    syncGroupCompletionForSession(updatedGroup, dateValue);
    updateGroupSessionHeader(updatedGroup, dateValue);
    renderGroupSessionPanel(updatedGroup, dateValue);
    renderAll();
    showToast("Sesion restaurada.");
  });
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
    const updatedGroup = groupInstanceForDate(groups.find((item) => item.id === group.id) || group, dateValue);
    syncGroupCompletionForSession(updatedGroup, dateValue);
    updateGroupSessionHeader(updatedGroup, dateValue);
    renderGroupSessionPanel(updatedGroup, dateValue);
    renderAll();
  });
  $("#complete-group-session")?.addEventListener("click", () => {
    const dateValue = dialog.dataset.date || selectedDate;
    const baseGroup = groupBaseById(dialog.dataset.groupId);
    const group = baseGroup ? groupInstanceForDate(baseGroup, dateValue) : null;
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
        fixedSessionRevenue: production.fixedSessionRevenue,
        expectedSessionsInMonth: production.expectedSessionsInMonth,
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
  $("#invoice-group-worker")?.addEventListener("click", () => {
    const dateValue = dialog.dataset.date || selectedDate;
    generateGroupWorkerInvoiceForSession(dialog.dataset.groupId, dateValue);
  });
  $("#add-dropin")?.addEventListener("click", () => {
    const dateValue = dialog.dataset.date || selectedDate;
    const baseGroup = groupBaseById(dialog.dataset.groupId);
    const group = baseGroup ? groupInstanceForDate(baseGroup, dateValue) : null;
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
    syncGroupCompletionForSession(group, dateValue);
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
  form.elements.password.value = "";
  form.elements.commissionRate.value = "40";
  form.elements.target.value = 2500;
  form.elements.availabilityStart.value = "08:00";
  form.elements.availabilityEnd.value = "14:00";
  form.elements.availabilityStart2.value = "15:00";
  form.elements.availabilityEnd2.value = "20:00";
  $("#practitioner-key-status").textContent = "";
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
  form.elements.password.value = practitioner.password || "";
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

async function deletePractitionerById(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  if (!practitioner || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.practitionerId === practitionerId)
    || groups.some((group) => group.practitionerId === practitionerId)
    || groupSessionOverrides.some((override) => override.practitionerId === practitionerId);
  if (inUse) {
    await showNotice("No se puede eliminar", "No se puede eliminar un trabajador con citas o grupos asociados.", { variant: "warning" });
    return;
  }
  const confirmed = await showConfirm({
    title: "Eliminar trabajador",
    message: `Eliminar a ${practitioner.name}?`,
    detail: "Esta accion no se puede deshacer.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  try {
    await deletePractitionerFromBackend(practitionerId);
  } catch (error) {
    showToast(`No se pudo eliminar en backend: ${error.message}`, "error");
    return;
  }
  practitioners = practitioners.filter((item) => item.id !== practitionerId);
  saveClinicState("practitioners", practitioners);
  renderFilters();
  renderLoginProfiles();
  renderAppointmentFormOptions();
  renderAll();
  showToast("Trabajador eliminado.");
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

async function deleteRoomById(roomId) {
  const room = byId(rooms, roomId);
  if (!room || !canManageClinic()) return;
  const inUse = appointments.some((appointment) => appointment.roomId === roomId)
    || groups.some((group) => group.roomId === roomId);
  if (inUse) {
    await showNotice("No se puede eliminar", "No se puede eliminar una sala con citas o grupos asociados.", { variant: "warning" });
    return;
  }
  const confirmed = await showConfirm({
    title: "Eliminar sala",
    message: `Eliminar la sala ${room.name}?`,
    detail: "Esta accion no se puede deshacer.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  try {
    await deleteRoomFromBackend(roomId);
  } catch (error) {
    showToast(`No se pudo eliminar en backend: ${error.message}`, "error");
    return;
  }
  rooms = rooms.filter((item) => item.id !== roomId);
  saveClinicState("rooms", rooms);
  renderFilters();
  renderAppointmentFormOptions();
  renderAll();
  showToast("Sala eliminada.");
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

async function deleteAvailabilityBlockById(blockId) {
  const block = availabilityBlocks.find((item) => item.id === blockId);
  if (!block) return;
  if (!canManageAvailability()) return;
  if (isPractitionerSession() && block.practitionerId !== currentSession.practitionerId) return;
  const confirmed = await showConfirm({
    title: "Eliminar ausencia",
    message: `Eliminar ${availabilityBlockLabel(block)}?`,
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  availabilityBlocks = availabilityBlocks.filter((item) => item.id !== blockId);
  saveClinicState("availability-blocks", availabilityBlocks);
  renderAll();
  showToast("Ausencia eliminada.");
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

function setupConfiguration() {
  $("#clinic-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const workingDays = $$("input[name='workingDays']:checked", form).map((input) => input.value);
    if (!workingDays.length) {
      $("#clinic-save-status").textContent = "Selecciona al menos un dia de atencion.";
      return;
    }
    clinic = {
      ...clinic,
      name: form.elements.name.value.trim() || defaultClinic.name,
      email: form.elements.email?.value.trim() || "",
      phone: form.elements.phone.value.trim(),
      workingDays
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

  $("#delete-clinic").addEventListener("click", async () => {
    if (isDemoClinic()) {
      const confirmed = await confirmClinicReset("Esto limpiara la demo local y la dejara con datos de ejemplo.");
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
      const confirmed = await confirmClinicReset(`Vas a resetear pacientes, citas, trabajadores, salas y servicios de ${clinic.name}. La clinica seguira existiendo para poder entrar de nuevo.`);
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
      saveClinicState("group-session-overrides", []);
      saveClinicState("reminder-actions", []);
      reminderActions = [];
      loadActiveClinicData(account.key);
    }
    renderLoginClinics();
    renderFilters();
    renderAppointmentFormOptions();
    renderSession();
    renderAll();
    appendAuditLog("reset-clinic", { clinicKey: activeClinicKey, demo: isDemoClinic() });
    $("#clinic-save-status").textContent = "Clinica reseteada. La cuenta sigue disponible para entrar.";
  });

  $("#new-practitioner").addEventListener("click", () => {
    if (!canManageClinic()) {
      return;
    }
    resetPractitionerForm($("#practitioner-form"));
    $("#practitioner-dialog").showModal();
  });

  $("#practitioner-form").addEventListener("submit", async (event) => {
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
    let savedPractitioner = practitioner;
    if (backendDataEnabled()) {
      try {
        savedPractitioner = await savePractitionerToBackend(practitioner, form.dataset.editingPractitionerId || "");
      } catch (error) {
        $("#practitioner-key-status").textContent = `No se pudo guardar el trabajador en backend: ${error.message}`;
        return;
      }
    }
    practitioners = form.dataset.editingPractitionerId
      ? practitioners.map((item) => item.id === form.dataset.editingPractitionerId ? savedPractitioner : item)
      : [...practitioners, savedPractitioner];
    if (savedPractitioner.email && practitioner.password) {
      try {
        const backendUser = await createBackendUserIfAvailable({
          name: savedPractitioner.name,
          email: savedPractitioner.email,
          password: practitioner.password,
          role: "practitioner",
          active: true,
          practitioner_id: savedPractitioner.id
        });
        if (backendUser?.id) {
          practitioners = practitioners.map((item) => item.id === savedPractitioner.id ? { ...item, backendUserId: backendUser.id } : item);
        }
      } catch (error) {
        $("#practitioner-key-status").textContent = backendTokenForAccount(currentClinicAccount())
          ? `Trabajador guardado localmente. No se pudo sincronizar usuario backend: ${error.message}`
          : "Trabajador guardado localmente. Inicia sesion backend para crear el usuario real.";
      }
    } else if (savedPractitioner.email && backendDataEnabled()) {
      $("#practitioner-key-status").textContent = "Trabajador guardado. Genera o introduce una clave para activar su acceso backend.";
    }
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

  $("#room-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const editingRoomId = form.dataset.editingRoomId || "";
    const room = {
      id: editingRoomId || `room-${Date.now()}`,
      name: form.elements.name.value.trim(),
      type: form.elements.type.value.trim()
    };
    let savedRoom = room;
    if (backendDataEnabled()) {
      try {
        savedRoom = await saveRoomToBackend(room, editingRoomId);
      } catch (error) {
        showToast(`No se pudo guardar la sala en backend: ${error.message}`, "error");
        return;
      }
    }
    rooms = editingRoomId
      ? rooms.map((item) => item.id === editingRoomId ? savedRoom : item)
      : [...rooms, savedRoom];
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
      setPatientProfileTab(button.dataset.patientTab);
    });
  });
}

function setPatientProfileTab(tabId = "info") {
  const nextTab = tabId || "info";
  $$(".patient-tab").forEach((item) => item.classList.toggle("selected", item.dataset.patientTab === nextTab));
  $$(".patient-tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.patientPanel === nextTab));
}

function consentBodyForPatient(template, patient, city = "", signatureDate = todayIso()) {
  const base = template?.body || "Autorizo el tratamiento fisioterapeutico y el uso de mis datos segun la politica del centro.";
  return base
    .replaceAll("{{nombre}}", patient?.name || "")
    .replaceAll("{{dni}}", patient?.dni || "")
    .replaceAll("{{email}}", patient?.email || "")
    .replaceAll("{{telefono}}", patient?.phone || "")
    .replaceAll("{{direccion}}", patientLocationLine(patient))
    .replaceAll("{{ciudad}}", city || "")
    .replaceAll("{{fecha}}", formatConsentDate(signatureDate));
}

function patientConsentById(id) {
  return patientConsents.find((item) => item.id === id);
}

async function revokePatientConsent(consentId) {
  const consent = patientConsentById(consentId);
  if (!consent || consent.revoked) return;
  const confirmed = await showConfirm({
    title: "Revocar consentimiento",
    message: `Revocar el consentimiento "${consent.templateName || "Consentimiento"}"?`,
    detail: "Se conserva el documento firmado y la firma para auditoria, pero quedara marcado como revocado.",
    confirmLabel: "Revocar",
    variant: "danger"
  });
  if (!confirmed) return;
  patientConsents = patientConsents.map((item) => item.id === consent.id
    ? { ...item, revoked: true, revokedAt: new Date().toISOString(), revokedBy: currentSessionName(), updatedAt: new Date().toISOString() }
    : item
  );
  saveClinicState("patient-consents", patientConsents);
  renderPatientDetail();
  showToast("Consentimiento revocado.");
}

async function deletePatientConsent(consentId) {
  const consent = patientConsentById(consentId);
  if (!consent) return;
  const confirmed = await showConfirm({
    title: "Eliminar consentimiento",
    message: `Eliminar el consentimiento "${consent.templateName || "Consentimiento"}" de la ficha?`,
    detail: "Esta accion borra el registro firmado de este navegador. Para anulaciones legales, usa Revocar.",
    confirmLabel: "Eliminar",
    variant: "danger"
  });
  if (!confirmed) return;
  patientConsents = patientConsents.filter((item) => item.id !== consent.id);
  saveClinicState("patient-consents", patientConsents);
  renderPatientDetail();
  showToast("Consentimiento eliminado.");
}

async function emailPatientConsent(consentId) {
  const consent = patientConsentById(consentId);
  const patient = byId(patients, consent?.patientId);
  if (!consent || !patient) {
    return;
  }
  if (!patient.email) {
    await showNotice("Email no disponible", "Este paciente no tiene email en su ficha. Añadelo antes de enviar el consentimiento.", { variant: "warning" });
    return;
  }
  const subject = `Consentimiento informado - ${consent.templateName || "Klinia"}`;
  const body = [
    `Hola ${patient.name || ""},`,
    "",
    `Te enviamos el consentimiento informado firmado en ${clinic.name || "la clinica"}.`,
    "",
    "Resumen del documento:",
    consent.body || "",
    "",
    `Fecha: ${consent.signatureDateLabel || formatConsentDate(consent.signatureDate) || ""}`,
    `Ciudad: ${consent.city || ""}`,
    "",
    "Un saludo."
  ].join("\n");
  const mailto = `mailto:${encodeURIComponent(patient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  showToast("Se ha preparado el email del consentimiento.");
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
    <dd>${escapeHtml(patientLocationLine(patient) || "No indicada")}</dd>
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
  $("#patient-consent-dialog-title").textContent = existing?.revoked ? "Consentimiento revocado" : (existing ? "Editar consentimiento" : "Preparar consentimiento");
  $("#save-patient-consent").textContent = existing?.signed ? "Guardar cambios" : "Guardar consentimiento firmado";
  $("#patient-consent-error").classList.remove("visible");
  $("#patient-consent-error").textContent = existing?.revoked
    ? `Revocado ${existing.revokedAt ? new Date(existing.revokedAt).toLocaleString("es-ES") : ""}. Este registro queda solo para revision.`
    : (consentTemplates.length ? "" : "Crea primero una plantilla de consentimiento en Configuracion.");
  $("#patient-consent-error").classList.toggle("visible", Boolean(existing?.revoked));
  $("#save-patient-consent").disabled = Boolean(existing?.revoked) || (!consentTemplates.length && !existing);
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
    if (existing?.revoked) {
      error.textContent = "Este consentimiento esta revocado y no se puede modificar.";
      error.classList.add("visible");
      return;
    }
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
        address: patientLocationLine(patient)
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
      expiresAt: sessionPackExpiryDate(pack),
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
    const used = Math.max(0, Math.min(sessions, patientPackActualUsedCount(pack)));
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
          expiresAt: form.elements.expiresAt?.value || "",
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

async function consumePatientPack(packId) {
  const result = consumePatientPackTransaction(packId, { source: "patient-profile" });
  if (!result.ok) {
    await showNotice(
      result.code === "busy" ? "Consumo en curso" : "Bono no consumido",
      result.message || "No se pudo descontar la sesion del bono.",
      { variant: "warning" }
    );
    renderPatientDetail();
    renderBilling();
    return;
  }
  showToast(`Sesion descontada. Quedan ${result.remaining} sesiones.`);
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
  if (form.elements.expiresAt) {
    form.elements.expiresAt.value = pack.expiresAt || "";
  }
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
<section><h2>Paciente</h2><p>${patient?.name || "Paciente"}<br>${patient?.dni || ""}<br>${patientLocationLine(patient)}</p></section>
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
    date.setMonth(date.getMonth() + (amount * 2));
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
if (isAuthenticated) {
  setEntrySection(true);
} else {
  setActiveSection("agenda", false);
}
setupLogin();
setupDialogCloseButtons();
setupAutoCloseOptionMenus();
setupFormErrorClearing("#appointment-form", "#form-error");
setupFormErrorClearing("#patient-form", "#patient-form-error");
setupFormErrorClearing("#group-form", "#group-form-error");
setupFormErrorClearing("#unavailability-form", "#unavailability-form-error");
setupFormErrorClearing("#consent-template-form", "#consent-template-error");
setupFormErrorClearing("#access-recovery-form", "#access-recovery-error");
setupFormErrorClearing("#patient-consent-form", "#patient-consent-error");
setupFormErrorClearing("#clinical-note-dialog-form", "#clinical-note-dialog-error");
setupFormErrorClearing("#session-pack-form", "#session-pack-error");
setupFormErrorClearing("#patient-pack-form", "#patient-pack-error");
setupFormErrorClearing("#appointment-detail-form", "#appointment-detail-error");
setupFormErrorClearing("#group-exception-form", "#group-exception-error");
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
handleBillingReturnFromStripe();
setupAccessManagement();
setupCommercialSettings();
setupPatientDetail();
setupPatientTabs();
setupPatientConsentsAndPacks();
setupFilters();
setupCalendarControls();
setupPerformance();
renderAll();


