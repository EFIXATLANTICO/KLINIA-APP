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
  name: "Clínica Demo Klinia",
  email: "demo@klinia.local",
  phone: "600 000 000",
  openingStart: "09:00",
  openingEnd: "20:00",
  workingDays: ["mon", "tue", "wed", "thu", "fri"]
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
  "manual-billing-movements",
  "attendance-records",
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

const backendSyncedClinicDataKeys = new Set([
  "clinical-notes",
  "groups",
  "group-dropins",
  "group-completions",
  "group-session-overrides",
  "session-packs",
  "patient-packs",
  "consent-templates",
  "patient-consents",
  "reminder-actions",
  "reminder-settings",
  "availability-blocks",
  "permissions",
  "clinic-logo"
]);

function saveSyncedClinicState(key, value) {
  saveClinicState(key, value);
  if (!backendSyncedClinicDataKeys.has(key) || !backendDataEnabled()) {
    return;
  }
  saveClinicDataToBackend(key, value).catch((error) => {
    console.warn(`Klinia backend sync failed for ${key}`, error);
    showToast(`No se pudo sincronizar ${key} con backend: ${error.message}`, "warning");
  });
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
    dateFrom: "",
    dateTo: "",
    ...group,
    days: Array.isArray(group.days) ? group.days : [],
    dateFrom: /^\d{4}-\d{2}-\d{2}$/.test(String(group.dateFrom || "")) ? group.dateFrom : "",
    dateTo: /^\d{4}-\d{2}-\d{2}$/.test(String(group.dateTo || "")) ? group.dateTo : ""
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
      workerType: "autonomo",
      accessRole: "practitioner",
      serviceCommissions: {},
      attendanceRecords: [],
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
      return {
        ...practitioner,
        color: nextColor,
        accessRole: practitioner.accessRole || "practitioner",
        serviceCommissions: practitioner.serviceCommissions && typeof practitioner.serviceCommissions === "object" ? practitioner.serviceCommissions : {},
        attendanceRecords: Array.isArray(practitioner.attendanceRecords) ? practitioner.attendanceRecords : []
      };
    });
}

function defaultReminderSettings() {
  return {
    reminderMessageTemplate: "Hola {{paciente}}, te recordamos tu cita en {{clinica}} el {{fecha}} a las {{hora}} con {{profesional}}. Si necesitas cambiarla, contacta con la clínica."
  };
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
let reminderSettings = { ...defaultReminderSettings(), ...loadClinicState("reminder-settings", defaultReminderSettings()) };
let groupDropIns = loadClinicState("group-dropins", []);
let groupCompletions = loadClinicState("group-completions", []);
let groupSessionOverrides = normalizeGroupSessionOverrides(loadClinicState("group-session-overrides", []));
let consentTemplates = loadClinicState("consent-templates", []);
let sessionPacks = normalizeSessionPacks(loadClinicState("session-packs", []));
let clinicLogo = loadClinicState("clinic-logo", "");
let patientConsents = loadClinicState("patient-consents", []);
let patientPacks = normalizePatientPacks(loadClinicState("patient-packs", []));
let manualBillingMovements = loadClinicState("manual-billing-movements", []);
let attendanceRecords = loadClinicState("attendance-records", []);
let auditLog = loadClinicState("audit-log", []);
let accessRecoveryRequests = loadState("access-recovery-requests", []);
let backendAccessRecoveryRequests = [];
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
let backendAutoSyncTimer = null;
let backendAutoSyncInProgress = false;
let backendLastSyncAt = 0;
const backendAutoSyncIntervalMs = 30000;
const backendAutoSyncMinIntervalMs = 8000;
let billingFilterState = loadState("billing-filter-state", {
  mode: "current-month",
  day: todayIso(),
  month: todayIso().slice(0, 7),
  from: monthStartIso(todayIso()),
  to: monthEndIso(todayIso()),
  sort: "desc",
  page: 1
});
let lastBillingReport = null;
let pendingImportSnapshot = null;
let pendingImportAnalysis = null;

const defaultAgendaHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

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
const apiEnabled = true;
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

  const customClinic = {
    name: account.name,
    email: account.email || "",
    phone: account.phone || "",
    openingStart: account.openingStart || "09:00",
    openingEnd: account.openingEnd || "20:00",
    workingDays: normalizeWorkingDays(account.workingDays || defaultWorkingDays)
  };
  const storedClinic = loadClinicState("clinic", isDemoClinic() ? defaultClinic : customClinic);
  clinic = {
    ...storedClinic,
    openingStart: storedClinic.openingStart || customClinic.openingStart,
    openingEnd: storedClinic.openingEnd || customClinic.openingEnd,
    workingDays: normalizeWorkingDays(storedClinic.workingDays || customClinic.workingDays)
  };
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
  manualBillingMovements = loadClinicState("manual-billing-movements", []);
  attendanceRecords = loadClinicState("attendance-records", []);
  syncPatientPackUsageFromAppointments({ persist: false });
  saveClinicState("patient-packs", patientPacks);
  clinicLogo = loadClinicState("clinic-logo", "");
  reminderActions = loadClinicState("reminder-actions", []);
  reminderSettings = { ...defaultReminderSettings(), ...loadClinicState("reminder-settings", defaultReminderSettings()) };
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
  saveClinicState("manual-billing-movements", manualBillingMovements);
  saveClinicState("attendance-records", attendanceRecords);
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
  const account = clinicAccountByKey(selectedKey);
  const loginPractitioners = normalizePractitioners(loadClinicStateFor(selectedKey, "practitioners", selectedKey === demoClinicKey ? defaultPractitioners : []));
  profileSelect.innerHTML = "";
  profileSelect.append(new Option("Direccion", "owner"));
  if (account?.staffEmail) {
    profileSelect.append(new Option("Recepcion / empleado", "staff"));
  }
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
  ["clinic", "patients", "appointments", "clinical-notes", "services", "practitioners", "rooms", "groups", "availability-blocks", "group-dropins", "group-completions", "group-session-overrides", "permissions", "reminder-actions", "reminder-settings", "patient-consents", "patient-packs", "manual-billing-movements", "attendance-records", "consent-templates", "session-packs", "clinic-logo"].forEach((key) => {
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
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs || 25000);
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const fetchOptions = { ...options };
  delete fetchOptions.timeoutMs;
  let response;
  try {
    response = await fetch(`${backendApiBaseUrl()}${path}`, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal
    });
  } catch (fetchError) {
    const aborted = fetchError?.name === "AbortError";
    const error = new Error(aborted
      ? "La API de Klinia ha tardado demasiado en responder. Si estabas creando una clínica, intentaremos recuperar el alta automáticamente."
      : "No se puede conectar con la API de Klinia. Revisa la conexion, actualiza la pagina y confirma que el backend esta desplegado.");
    error.status = 0;
    error.network = true;
    error.timeout = aborted;
    error.cause = fetchError;
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
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

function applyBackendClinicSnapshot(apiClinic) {
  if (!apiClinic) {
    return false;
  }
  const nextClinic = {
    ...clinic,
    name: apiClinic.name || clinic.name || defaultClinic.name,
    email: apiClinic.email || clinic.email || "",
    phone: apiClinic.phone || clinic.phone || "",
    billingName: apiClinic.billing_name || clinic.billingName || apiClinic.name || clinic.name || "",
    billingEmail: apiClinic.billing_email || clinic.billingEmail || apiClinic.email || clinic.email || "",
    taxId: apiClinic.tax_id || clinic.taxId || "",
    billingAddress: apiClinic.billing_address || clinic.billingAddress || "",
    openingStart: apiClinic.opening_start || clinic.openingStart || "09:00",
    openingEnd: apiClinic.opening_end || clinic.openingEnd || "20:00",
    workingDays: normalizeWorkingDays(apiClinic.working_days || clinic.workingDays)
  };
  const before = JSON.stringify({
    name: clinic.name || "",
    email: clinic.email || "",
    phone: clinic.phone || "",
    openingStart: clinic.openingStart || "",
    openingEnd: clinic.openingEnd || "",
    workingDays: normalizeWorkingDays(clinic.workingDays)
  });
  const after = JSON.stringify({
    name: nextClinic.name || "",
    email: nextClinic.email || "",
    phone: nextClinic.phone || "",
    openingStart: nextClinic.openingStart || "",
    openingEnd: nextClinic.openingEnd || "",
    workingDays: normalizeWorkingDays(nextClinic.workingDays)
  });
  clinic = nextClinic;
  saveClinicState("clinic", clinic);
  clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
    account.key === activeClinicKey
      ? {
          ...account,
          name: nextClinic.name,
          email: nextClinic.email,
          phone: nextClinic.phone,
          backendClinicId: apiClinic.id || account.backendClinicId || "",
          paymentPlan: normalizeSaasPlanId(apiClinic.subscription_plan || account.paymentPlan),
          subscriptionStatus: apiClinic.subscription_status || account.subscriptionStatus,
          billingStatus: apiClinic.subscription_status || account.billingStatus,
          currentPeriodEnd: (apiClinic.current_period_end || account.currentPeriodEnd || "").slice(0, 10),
          trialEndsAt: (apiClinic.trial_ends_at || account.trialEndsAt || "").slice(0, 10),
          openingStart: nextClinic.openingStart,
          openingEnd: nextClinic.openingEnd,
          workingDays: nextClinic.workingDays,
          billingProfile: {
            ...(account.billingProfile || {}),
            billingName: nextClinic.billingName,
            billingEmail: nextClinic.billingEmail,
            taxId: nextClinic.taxId,
            billingAddress: nextClinic.billingAddress
          }
        }
      : account
  )));
  saveClinicAccounts();
  return before !== after;
}

function backendDataEnabled(account = currentClinicAccount()) {
  return Boolean(backendTokenForAccount(account)) && account?.key !== demoClinicKey;
}

function backendAuthoritativeMode(account = currentClinicAccount()) {
  return backendRequiredForProduction() && account?.key !== demoClinicKey;
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
const superadminActionLabels = {
  "login-success": "Login correcto",
  "login-failed": "Login fallido",
  "login-throttled": "Login bloqueado",
  "register-clinic": "Registro de clinica",
  "create-patient": "Paciente creado",
  "update-patient": "Paciente actualizado",
  "delete-patient": "Paciente eliminado",
  "create-appointment": "Cita creada",
  "update-appointment": "Cita actualizada",
  "delete-appointment": "Cita eliminada",
  "create-practitioner": "Trabajador creado",
  "update-practitioner": "Trabajador actualizado",
  "delete-practitioner": "Trabajador eliminado",
  "update-clinic-settings": "Configuracion actualizada",
  "superadmin-reset-password": "Clave reseteada",
  "superadmin-repair-access": "Acceso reparado",
  "superadmin-impersonate-clinic": "Impersonacion",
  "stripe-event": "Evento Stripe"
};
let superadminActiveModule = "dashboard";
let selectedSuperadminClinicId = "";
let superadminData = {
  overview: {},
  clinics: [],
  backendClinics: [],
  users: [],
  audit: [],
  accessIssues: [],
  supportTickets: [],
  plans: [],
  health: null,
  loadErrors: []
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
  if (localStorage.getItem("klinia:superadmin-show-local-clinics") !== "true") {
    return [];
  }
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

function removeLocalClinicReferencesForSuperadmin(clinic = {}) {
  const matchers = new Set([
    String(clinic.id || "").trim().toLowerCase(),
    String(clinic.backendClinicId || "").trim().toLowerCase(),
    String(clinic.email || "").trim().toLowerCase(),
    String(clinic.name || "").trim().toLowerCase(),
    String(clinic.key || "").trim().toLowerCase()
  ].filter(Boolean));
  if (!matchers.size) return;
  const before = clinicAccounts.length;
  clinicAccounts = normalizeClinicAccounts(clinicAccounts.filter((account) => {
    if (account.key === demoClinicKey) return true;
    return ![
      account.key,
      account.backendClinicId,
      account.email,
      account.ownerEmail,
      account.name
    ].some((value) => matchers.has(String(value || "").trim().toLowerCase()));
  }));
  if (clinicAccounts.length !== before) {
    saveClinicAccounts();
  }
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

function supportTicketForIssue(issue) {
  return (superadminData.supportTickets || []).find((ticket) => (
    ticket.issue_key && issue?.id && String(ticket.issue_key) === String(issue.id)
  ));
}

function visibleSuperadminAccessIssues() {
  return (superadminData.accessIssues || []).filter((issue) => {
    const ticket = supportTicketForIssue(issue);
    return !ticket || !["resolved", "closed"].includes(ticket.status);
  });
}

function superadminStatusLabel(value) {
  return {
    active: "Activa",
    trial: "En prueba",
    trialing: "En prueba",
    past_due: "Impagada",
    incomplete: "Incompleta",
    canceled: "Cancelada",
    archived: "Archivada",
    local_pending_backend: "Pendiente backend"
  }[value] || value || "-";
}

function supportTicketStatusLabel(value) {
  return {
    open: "Abierta",
    resolved: "Resuelta",
    closed: "Cerrada"
  }[value] || value || "-";
}

function superadminActionLabel(value) {
  return superadminActionLabels[value] || value || "-";
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
  $(".superadmin-main")?.scrollTo({ top: 0, behavior: "auto" });
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
        <td><strong>${escapeHtml(superadminActionLabel(item.action))}</strong><span>${escapeHtml(item.resource_type || item.action || "")}</span></td>
        <td><span class="superadmin-status ${superadminStatusClass(item.result)}">${escapeHtml(item.result || "success")}</span></td>
      </tr>
    `).join("");
  }

  const alerts = [];
  const criticalAccessIssues = visibleSuperadminAccessIssues().filter((issue) => issue.severity === "critical");
  if (criticalAccessIssues.length) alerts.push(["Accesos rotos", `${criticalAccessIssues.length} incidencia${criticalAccessIssues.length === 1 ? "" : "s"} critica${criticalAccessIssues.length === 1 ? "" : "s"} en clinicas o usuarios`, "danger", "support"]);
  if (Number(overview.failed_logins_24h || 0) > 0) alerts.push(["Fallos de login", `${overview.failed_logins_24h} intentos fallidos en las ultimas 24h`, "warning", "audit", "login-failed"]);
  const pastDue = Number(overview.past_due_clinics || 0);
  if (pastDue > 0) alerts.push(["Suscripciones a revisar", `${pastDue} clinicas con estado impagado, incompleto o cancelado`, "danger", "clinics"]);
  if (localClinics.length) alerts.push(["Clinicas pendientes de sincronizar", `${localClinics.length} clinica${localClinics.length === 1 ? "" : "s"} registrada${localClinics.length === 1 ? "" : "s"} en este navegador sin trazabilidad completa de backend`, "warning", "clinics"]);
  if (!alerts.length) alerts.push(["Sin alertas criticas", "No hay incidencias operativas detectadas con los datos actuales.", "ok", "dashboard"]);
  $("#superadmin-alerts-count").textContent = `${alerts.length} alertas`;
  $("#superadmin-alert-list").innerHTML = alerts.map(([title, text, kind, module, action]) => `
    <article class="superadmin-alert ${kind}" data-superadmin-alert-module="${escapeHtml(module || "dashboard")}" ${action ? `data-superadmin-alert-action="${escapeHtml(action)}"` : ""} tabindex="0" role="button">
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
      <td><div class="superadmin-row-actions"><button type="button" data-superadmin-open-clinic="${escapeHtml(clinic.id)}">Detalle</button><button type="button" data-superadmin-impersonate="${escapeHtml(clinic.id)}" ${clinic.source === "backend" && clinic.subscription_status !== "archived" ? "" : "disabled title=\"Disponible solo para clinicas backend no archivadas\""}>Impersonar</button>${clinic.subscription_status === "archived" ? `<button type="button" data-superadmin-restore-clinic="${escapeHtml(clinic.id)}" ${clinic.source === "backend" ? "" : "disabled"}>Restaurar</button>` : `<button type="button" data-superadmin-archive-test-clinic="${escapeHtml(clinic.id)}" ${clinic.source === "backend" ? "" : "disabled title=\"Solo disponible para clinicas backend\""}>Archivar prueba</button>`}<button type="button" data-superadmin-delete-clinic="${escapeHtml(clinic.id)}" ${clinic.source === "backend" ? "" : "disabled title=\"Solo disponible para clinicas backend\""}>Eliminar</button></div></td>
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
      <td>
        <select class="superadmin-table-select" data-superadmin-role-user="${escapeHtml(item.id)}" aria-label="Cambiar rol de ${escapeHtml(item.name)}">
          ${["owner", "staff", "practitioner"].map((role) => `<option value="${role}" ${item.role === role ? "selected" : ""}>${role}</option>`).join("")}
        </select>
      </td>
      <td><span class="superadmin-status ${item.active ? "active" : "inactive"}">${item.active ? "Activo" : "Inactivo"}</span><span>${escapeHtml(item.access_status === "temporary_password" ? "Clave temporal" : item.access_status === "recent_failed_login" ? "Fallos recientes" : item.access_status || "ok")}</span></td>
      <td>${escapeHtml(formatSuperadminDate(item.last_access_at))}<span>${item.last_failed_login_at ? `Ultimo fallo: ${escapeHtml(formatSuperadminDate(item.last_failed_login_at))}` : ""}</span></td>
      <td><div class="superadmin-row-actions"><button type="button" data-superadmin-reset-user="${escapeHtml(item.id)}">Reset clave</button><button type="button" data-superadmin-toggle-user="${escapeHtml(item.id)}" data-active="${item.active ? "true" : "false"}">${item.active ? "Bloquear" : "Activar"}</button></div></td>
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
      <td><strong>${escapeHtml(superadminActionLabel(item.action))}</strong><span>${escapeHtml(item.resource_type || item.action || "")}</span></td>
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
    <dt>Precio Stripe</dt><dd>${escapeHtml(clinic.stripe_price_id || "Sin precio asignado")}</dd>
    <dt>Fin de prueba</dt><dd>${escapeHtml(formatSuperadminDate(clinic.trial_ends_at))}</dd>
    <dt>Periodo actual</dt><dd>${escapeHtml(formatSuperadminDate(clinic.current_period_end))}</dd>
  `;
  $("#superadmin-detail-users-count").textContent = `${clinicUsers.length} usuarios`;
  $("#superadmin-detail-users").innerHTML = clinicUsers.length
    ? clinicUsers.map((user) => `<article><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)} - ${escapeHtml(user.role || "-")} - ${escapeHtml(user.access_status || "ok")}</span></article>`).join("")
    : `<article><strong>Sin usuarios activos en backend</strong><span>Revisa Soporte para crear o reparar el acceso principal de la clinica.</span></article>`;
  $("#superadmin-detail-activity").innerHTML = clinicAudit.length
    ? clinicAudit.map((item) => `<article><strong>${escapeHtml(superadminActionLabel(item.action))}</strong><span>${escapeHtml(formatSuperadminDate(item.created_at))} - ${escapeHtml(item.result || "success")}</span></article>`).join("")
    : `<article><strong>Sin actividad</strong><span>No hay eventos auditados para esta clinica.</span></article>`;
  const backendActionDisabled = clinic.source === "backend" ? "" : "disabled title=\"Disponible cuando la clinica este sincronizada en backend\"";
  const detailActions = [
    ["Impersonar clinica", "Genera un token temporal de 30 minutos y registra la accion.", `data-superadmin-action="impersonate-clinic" ${clinic.subscription_status !== "archived" ? backendActionDisabled : "disabled title=\"Restaura la clinica antes de impersonar\""}`],
    [clinic.subscription_status === "canceled" ? "Reactivar clinica" : "Bloquear clinica", "Cambia el estado de suscripcion para permitir o bloquear uso.", `data-superadmin-action="toggle-clinic-status" ${backendActionDisabled}`],
    ["Ampliar prueba 30 dias", "Suma un mes gratis a la fecha de fin de prueba interna y audita el cambio.", `data-superadmin-action="extend-trial" ${backendActionDisabled}`],
    ["Aplicar plan mensual", "Actualiza plan/precio interno a mensual sin modificar Stripe directamente.", `data-superadmin-action="apply-monthly-plan" ${backendActionDisabled}`],
    ["Aplicar plan anual", "Actualiza plan/precio interno a anual sin modificar Stripe directamente.", `data-superadmin-action="apply-annual-plan" ${backendActionDisabled}`],
    ["Resetear acceso direccion", "Genera una clave temporal para el usuario direccion activo.", `data-superadmin-action="reset-owner" ${backendActionDisabled}`],
    [clinic.subscription_status === "archived" ? "Restaurar clinica" : "Archivar prueba", clinic.subscription_status === "archived" ? "Reactiva la clinica archivada y sus accesos de direccion." : "Desactiva una clinica de simulacion sin borrar fisicamente sus datos.", `data-superadmin-action="${clinic.subscription_status === "archived" ? "restore-clinic" : "archive-test-clinic"}" ${backendActionDisabled}`],
    ["Eliminar permanentemente", "Borra la clinica y todos sus datos asociados tras doble confirmacion.", `data-superadmin-action="delete-clinic-permanent" ${backendActionDisabled}`],
    ["Exportar auditoria", "Descarga eventos filtrados en CSV.", `data-superadmin-action="export-audit"`]
  ];
  $("#superadmin-detail-actions").innerHTML = detailActions.map(([title, text, action]) => `<article><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span><button class="secondary-button compact-inline-button" type="button" ${action}>Ejecutar</button></article>`).join("");
}

function renderSuperadminPreparedPanels() {
  const backendClinics = superadminData.backendClinics || [];
  const activeClinics = backendClinics.filter((clinic) => clinic.subscription_status === "active");
  const trialClinics = backendClinics.filter((clinic) => ["trial", "trialing"].includes(String(clinic.subscription_status || "")));
  const archivedClinics = backendClinics.filter((clinic) => clinic.subscription_status === "archived");
  const canceledClinics = backendClinics.filter((clinic) => clinic.subscription_status === "canceled");
  const pastDueClinics = backendClinics.filter((clinic) => ["past_due", "incomplete", "blocked"].includes(String(clinic.subscription_status || "")));
  const payingPool = activeClinics.length + trialClinics.length + canceledClinics.length + pastDueClinics.length;
  const conversionRate = payingPool ? Math.round((activeClinics.length / payingPool) * 100) : 0;
  const nextRenewals = backendClinics
    .map((clinic) => ({
      clinic,
      date: clinic.current_period_end || clinic.trial_ends_at || ""
    }))
    .filter((item) => item.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 8);
  const planCards = (superadminData.plans || []).map((plan) => `
    <section class="superadmin-card"><div class="superadmin-card-head"><h2>${escapeHtml(plan.name)}</h2><span>${plan.checkout_enabled ? "Operativo" : "No conectado"}</span></div><dl class="superadmin-definition-list"><dt>Precio</dt><dd>${Number(plan.price_eur || 0)} EUR / ${escapeHtml(plan.interval || "-")}</dd><dt>Stripe price</dt><dd>${escapeHtml(plan.price_id || "No configurado")}</dd><dt>Uso</dt><dd>${plan.recommended ? "Plan principal" : "Alternativa disponible"}</dd></dl></section>
  `).join("");
  $("#superadmin-subscriptions-grid").innerHTML = planCards || `<section class="superadmin-card superadmin-card-wide"><h2>Catalogo no disponible</h2><p>No se han recibido planes desde backend. Revisa la API o la configuracion de Stripe antes de operar cambios comerciales.</p></section>`;
  $("#superadmin-billing-grid").innerHTML = `
    <section class="superadmin-card">
      <div class="superadmin-card-head"><h2>Estado de suscripciones</h2><span>Datos backend</span></div>
      <dl class="superadmin-definition-list">
        <dt>Activas</dt><dd>${activeClinics.length}</dd>
        <dt>En prueba</dt><dd>${trialClinics.length}</dd>
        <dt>A revisar</dt><dd>${pastDueClinics.length}</dd>
        <dt>Canceladas</dt><dd>${canceledClinics.length}</dd>
        <dt>Archivadas</dt><dd>${archivedClinics.length}</dd>
      </dl>
    </section>
    <section class="superadmin-card">
      <div class="superadmin-card-head"><h2>Renovaciones proximas</h2><span>${nextRenewals.length}</span></div>
      <div class="superadmin-mini-list">
        ${nextRenewals.length ? nextRenewals.map(({ clinic, date }) => `<article><strong>${escapeHtml(clinic.name)}</strong><span>${escapeHtml(superadminStatusLabel(clinic.subscription_status))} - ${escapeHtml(formatSuperadminDate(date))}</span></article>`).join("") : `<article><strong>Sin renovaciones fechadas</strong><span>No hay periodos o pruebas con fecha cargada.</span></article>`}
      </div>
    </section>
    <section class="superadmin-card">
      <div class="superadmin-card-head"><h2>Cancelaciones y riesgo</h2><span>${canceledClinics.length + pastDueClinics.length}</span></div>
      <div class="superadmin-mini-list">
        ${[...pastDueClinics, ...canceledClinics].slice(0, 8).map((clinic) => `<article><strong>${escapeHtml(clinic.name)}</strong><span>${escapeHtml(superadminStatusLabel(clinic.subscription_status))}${clinic.cancel_at_period_end ? " - cancela al fin del periodo" : ""}</span></article>`).join("") || `<article><strong>Sin incidencias de cobro</strong><span>No hay clinicas en estado impagado o cancelado.</span></article>`}
      </div>
    </section>
  `;
  const accessIssues = visibleSuperadminAccessIssues().filter((issue) => textMatchesSearch([
    issue.clinic_name,
    issue.user_email,
    issue.issue_type,
    issue.message,
    issue.recommended_action,
    issue.severity
  ]));
  const accessIssueList = accessIssues.length
    ? accessIssues.slice(0, 18).map((issue) => `
      <article class="superadmin-support-issue ${escapeHtml(issue.severity)}">
        <div>
          <strong>${escapeHtml(issue.clinic_name || "Plataforma")}</strong>
          <span>${escapeHtml(issue.message)}</span>
          <small>${escapeHtml(issue.user_email || issue.issue_type)} - ${escapeHtml(issue.recommended_action)}</small>
        </div>
        <div class="superadmin-row-actions">
          ${issue.clinic_id ? `<button type="button" data-superadmin-open-clinic="${escapeHtml(issue.clinic_id)}">Detalle</button>` : ""}
          ${issue.clinic_id && ["no-users", "no-owner", "owner-inactive"].includes(issue.issue_type) ? `<button type="button" data-superadmin-repair-access="${escapeHtml(issue.clinic_id)}">Reparar acceso</button>` : ""}
          ${issue.user_id ? `<button type="button" data-superadmin-reset-user="${escapeHtml(issue.user_id)}">Reset clave</button>` : ""}
          ${issue.practitioner_id ? `<button type="button" data-superadmin-create-practitioner-access="${escapeHtml(issue.practitioner_id)}">Crear acceso</button>` : ""}
          <button type="button" data-superadmin-resolve-access-issue="${escapeHtml(issue.id)}">Resolver</button>
          <button type="button" data-superadmin-close-access-issue="${escapeHtml(issue.id)}">Cerrar</button>
        </div>
      </article>
    `).join("")
    : `<article class="superadmin-support-issue ok"><div><strong>Sin incidencias de acceso</strong><span>No hay clinicas sin direccion, usuarios bloqueados criticos ni fallos repetidos con los datos actuales.</span></div></article>`;
  const failedLogins = (superadminData.audit || []).filter((item) => item.action === "login-failed").slice(0, 8);
  const supportTickets = (superadminData.supportTickets || []).filter((ticket) => textMatchesSearch([
    ticket.clinic_name,
    ticket.user_email,
    ticket.title,
    ticket.description,
    ticket.status,
    ticket.priority
  ]));
  const ticketList = supportTickets.length
    ? supportTickets.slice(0, 12).map((ticket) => `
      <article>
        <strong>${escapeHtml(ticket.title)}</strong>
        <span>${escapeHtml(ticket.clinic_name || "Plataforma")} - ${escapeHtml(supportTicketStatusLabel(ticket.status))} - ${escapeHtml(ticket.priority || "medium")}</span>
        <div class="superadmin-row-actions">
          <button type="button" data-superadmin-ticket-history="${escapeHtml(ticket.id)}">Historial</button>
          ${ticket.status !== "resolved" ? `<button type="button" data-superadmin-ticket-status="${escapeHtml(ticket.id)}" data-status="resolved">Resolver</button>` : ""}
          ${ticket.status !== "closed" ? `<button type="button" data-superadmin-ticket-status="${escapeHtml(ticket.id)}" data-status="closed">Cerrar</button>` : ""}
        </div>
      </article>
    `).join("")
    : `<article><strong>Sin tickets abiertos</strong><span>Las incidencias resueltas o cerradas se guardaran aqui con trazabilidad.</span></article>`;
  $("#superadmin-support-grid").innerHTML = `
    <section class="superadmin-card superadmin-card-wide">
      <div class="superadmin-card-head"><h2>Centro de soporte de accesos</h2><span>${accessIssues.length} incidencia${accessIssues.length === 1 ? "" : "s"}</span></div>
      <div class="superadmin-support-list">${accessIssueList}</div>
    </section>
    <section class="superadmin-card">
      <div class="superadmin-card-head"><h2>Ultimos fallos de login</h2><span>Auditoria</span></div>
      <div class="superadmin-mini-list">
        ${failedLogins.length ? failedLogins.map((item) => `<article><strong>${escapeHtml(item.user_email || item.metadata_json || "Intento fallido")}</strong><span>${escapeHtml(item.clinic_name || item.clinic_id || "Sin clinica")} - ${escapeHtml(formatSuperadminDate(item.created_at))}</span></article>`).join("") : `<article><strong>Sin fallos recientes</strong><span>No hay login-failed en la auditoria cargada.</span></article>`}
      </div>
    </section>
    <section class="superadmin-card">
      <div class="superadmin-card-head"><h2>Tickets</h2><span>${supportTickets.length}</span></div>
      <div class="superadmin-mini-list">${ticketList}</div>
    </section>
  `;
  $("#superadmin-communications-grid").innerHTML = `<section class="superadmin-card superadmin-card-wide"><div class="superadmin-card-head"><h2>Comunicaciones</h2><span>Vista informativa</span></div><p>Aun no hay proveedor de email conectado desde superadmin. No se muestran botones de envio para evitar acciones aparentes. Cuando se conecte email transaccional, aqui se centralizaran altas, recuperaciones, avisos de pago y campanas.</p></section>`;
  $("#superadmin-reports-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Informe operativo</h2><span>Datos backend</span></div><dl class="superadmin-definition-list"><dt>Clinicas activas</dt><dd>${activeClinics.length}</dd><dt>Clinicas de prueba</dt><dd>${trialClinics.length}</dd><dt>Conversion prueba a pago</dt><dd>${conversionRate}%</dd><dt>Usuarios activos</dt><dd>${(superadminData.users || []).filter((user) => user.active).length}</dd><dt>Facturacion estimada mensual</dt><dd>${activeClinics.length * 50} EUR</dd></dl></section><section class="superadmin-card"><div class="superadmin-card-head"><h2>Alcance actual</h2><span>Operativo</span></div><p>Los informes actuales usan clinicas, usuarios, estados de suscripcion y auditoria de backend. La facturacion real cobrada por Stripe se ampliara cuando se persista el libro de invoices en backend.</p></section>`;
  $("#superadmin-settings-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Seguridad</h2><span>Activo</span></div><p>Superadmin protegido por rol backend, claves hasheadas, claves temporales con cambio obligatorio y freno de intentos de login activo. MFA queda como siguiente mejora de seguridad.</p></section><section class="superadmin-card"><div class="superadmin-card-head"><h2>API y webhooks</h2><span>Supervisado</span></div><p>Stripe webhook y API publica se consultan desde backend. No se exponen secretos en UI y los estados se verifican desde Sistema.</p></section>`;
  const loadErrors = superadminData.loadErrors || [];
  $("#superadmin-system-grid").innerHTML = `<section class="superadmin-card"><div class="superadmin-card-head"><h2>Estado del sistema</h2><span>${escapeHtml(superadminData.health?.backend_setup_status || "-")}</span></div><dl class="superadmin-definition-list"><dt>App</dt><dd>${escapeHtml(superadminData.health?.app || "Klinia")}</dd><dt>Entorno</dt><dd>${escapeHtml(superadminData.health?.env || "-")}</dd><dt>Stripe</dt><dd>${superadminData.health?.stripe_configured ? "Configurado" : "No configurado"}</dd><dt>Setup</dt><dd>${escapeHtml(superadminData.health?.backend_setup_status || "-")}</dd><dt>Carga del panel</dt><dd>${loadErrors.length ? escapeHtml(`${loadErrors.length} aviso(s)`) : "Completa"}</dd></dl>${loadErrors.length ? `<p class="superadmin-sync-note">${escapeHtml(loadErrors.join(" | "))}</p>` : ""}</section>`;
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
  if (superadminActiveModule === "dashboard") {
    const overview = superadminData.overview || {};
    return [
      { metrica: "Clinicas totales", valor: overview.total_clinics ?? 0 },
      { metrica: "Usuarios", valor: overview.total_users ?? 0 },
      { metrica: "Activas", valor: overview.active_clinics ?? 0 },
      { metrica: "En prueba", valor: overview.trialing_clinics ?? 0 },
      { metrica: "Fallos login 24h", valor: overview.failed_logins_24h ?? 0 },
      { metrica: "Actividad 24h", valor: overview.activity_24h ?? 0 },
      { metrica: "Incidencias acceso", valor: (superadminData.accessIssues || []).length }
    ];
  }
  if (superadminActiveModule === "users") {
    return filteredSuperadminUsers().map((user) => ({ nombre: user.name, email: user.email, clinica: user.clinic_name || "", rol: user.role || "", activo: user.active ? "si" : "no", ultimo_acceso: formatSuperadminDate(user.last_access_at) }));
  }
  if (superadminActiveModule === "audit") {
    return filteredSuperadminAudit().map((item) => ({ fecha: formatSuperadminDate(item.created_at), clinica: item.clinic_name || item.clinic_id || "Plataforma", usuario: item.user_email || item.user_name || "", accion: superadminActionLabel(item.action), recurso: item.resource_type || "", resultado: item.result || "", origen: item.origin || "" }));
  }
  if (superadminActiveModule === "support") {
    return [
      ...visibleSuperadminAccessIssues().map((issue) => ({ tipo_registro: "incidencia", clinica: issue.clinic_name || "", usuario: issue.user_email || "", estado: "abierta", severidad: issue.severity, tipo: issue.issue_type, mensaje: issue.message, accion: issue.recommended_action })),
      ...(superadminData.supportTickets || []).map((ticket) => ({ tipo_registro: "ticket", clinica: ticket.clinic_name || "", usuario: ticket.user_email || "", estado: supportTicketStatusLabel(ticket.status), severidad: ticket.priority || "", tipo: ticket.issue_key || "", mensaje: ticket.title, accion: ticket.description || "" }))
    ];
  }
  if (superadminActiveModule === "subscriptions") {
    return (superadminData.plans || []).map((plan) => ({ plan: plan.name, precio: plan.price_eur, intervalo: plan.interval, stripe_price: plan.price_id || "", checkout: plan.checkout_enabled ? "si" : "no" }));
  }
  if (superadminActiveModule === "billing") {
    return (superadminData.backendClinics || []).map((clinic) => ({
      clinica: clinic.name,
      estado: superadminStatusLabel(clinic.subscription_status),
      plan: clinic.subscription_plan || "",
      renovacion: formatSuperadminDate(clinic.current_period_end || clinic.trial_ends_at),
      cancelacion_fin_periodo: clinic.cancel_at_period_end ? "si" : "no"
    }));
  }
  if (superadminActiveModule === "reports") {
    const backendClinics = superadminData.backendClinics || [];
    const activeClinics = backendClinics.filter((clinic) => clinic.subscription_status === "active");
    const trialClinics = backendClinics.filter((clinic) => ["trial", "trialing"].includes(String(clinic.subscription_status || "")));
    const payingPool = activeClinics.length + trialClinics.length + backendClinics.filter((clinic) => ["canceled", "past_due", "incomplete"].includes(String(clinic.subscription_status || ""))).length;
    return [
      { metrica: "Clinicas activas", valor: activeClinics.length },
      { metrica: "Clinicas de prueba", valor: trialClinics.length },
      { metrica: "Conversion prueba a pago", valor: `${payingPool ? Math.round((activeClinics.length / payingPool) * 100) : 0}%` },
      { metrica: "Usuarios activos", valor: (superadminData.users || []).filter((user) => user.active).length },
      { metrica: "Facturacion estimada mensual", valor: `${activeClinics.length * 50} EUR` },
      { metrica: "Eventos auditoria", valor: superadminData.audit.length },
      { metrica: "Incidencias acceso", valor: (superadminData.accessIssues || []).length }
    ];
  }
  if (superadminActiveModule === "system") {
    return Object.entries(superadminData.health || {}).map(([clave, valor]) => ({ clave, valor: typeof valor === "object" ? JSON.stringify(valor) : String(valor) }));
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

function setSuperadminBusy(isBusy, label = "Cargando...") {
  const refreshButton = $("#superadmin-refresh-button");
  const filterButton = $("#superadmin-filter-form button[type='submit']");
  if (refreshButton) {
    refreshButton.disabled = isBusy;
    refreshButton.textContent = isBusy ? label : "Actualizar";
  }
  if (filterButton) {
    filterButton.disabled = isBusy;
    filterButton.textContent = isBusy ? "Aplicando..." : "Aplicar filtros";
  }
}

async function superadminResetUserPassword(userId) {
  const user = superadminData.users.find((item) => item.id === userId);
  if (!user) return;
  const confirmed = await showConfirm({
    eyebrow: "Accion sensible",
    title: "Resetear clave",
    message: `Vas a generar una clave temporal para ${user.name}.`,
    detail: "La clave actual dejara de funcionar. Entregala por un canal seguro.",
    confirmLabel: "Generar clave",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const result = await backendRequest(`/superadmin/users/${encodeURIComponent(userId)}/reset-password`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    await loadSuperadminPanel();
    await showNotice(
      "Clave temporal generada",
      `Nueva clave para ${user.name}: ${result.temporary_password}`,
      { variant: "success" }
    );
  } catch (error) {
    showToast(`No se pudo resetear la clave: ${error.message}`, "error");
  }
}

async function superadminUpdateUser(userId, payload) {
  try {
    await backendRequest(`/superadmin/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify(payload)
    });
    await loadSuperadminPanel();
    showToast("Usuario actualizado.", "success");
  } catch (error) {
    showToast(`No se pudo actualizar el usuario: ${error.message}`, "error");
    await loadSuperadminPanel();
  }
}

async function superadminToggleUser(userId, activeValue) {
  const user = superadminData.users.find((item) => item.id === userId);
  if (!user) return;
  const nextActive = !activeValue;
  const confirmed = await showConfirm({
    eyebrow: "Accion sensible",
    title: nextActive ? "Activar usuario" : "Bloquear usuario",
    message: `${nextActive ? "Activar" : "Bloquear"} acceso de ${user.name}.`,
    detail: "La accion quedara registrada en auditoria.",
    confirmLabel: nextActive ? "Activar" : "Bloquear",
    variant: nextActive ? "primary" : "danger"
  });
  if (!confirmed) return;
  await superadminUpdateUser(userId, { active: nextActive });
}

async function superadminUpdateClinicStatus(clinicId, statusValue) {
  const clinic = clinicBySuperadminId(clinicId);
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden modificar clinicas persistidas en backend.", "warning");
    return;
  }
  const confirmed = await showConfirm({
    eyebrow: "Suscripcion",
    title: statusValue === "canceled" ? "Bloquear clinica" : "Reactivar clinica",
    message: `Cambiar estado de ${clinic.name} a ${statusValue}.`,
    detail: "Esto afecta al acceso funcional de la clinica y se auditara.",
    confirmLabel: statusValue === "canceled" ? "Bloquear" : "Reactivar"
  });
  if (!confirmed) return;
  try {
    await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}`, {
      method: "PATCH",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify({ subscription_status: statusValue })
    });
    await loadSuperadminPanel();
    showToast("Clinica actualizada.", "success");
  } catch (error) {
    showToast(`No se pudo actualizar la clinica: ${error.message}`, "error");
  }
}

function superadminPlanForInterval(interval) {
  const normalized = String(interval || "").toLowerCase();
  return (superadminData.plans || []).find((plan) => String(plan.interval || "").toLowerCase() === normalized)
    || (superadminData.plans || []).find((plan) => String(plan.id || "").toLowerCase().includes(normalized));
}

async function superadminExtendClinicTrial(clinicId) {
  const clinic = clinicBySuperadminId(clinicId);
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden modificar clinicas persistidas en backend.", "warning");
    return;
  }
  const currentTrial = String(clinic.trial_ends_at || "").slice(0, 10);
  const baseDate = currentTrial && currentTrial > todayIso() ? currentTrial : todayIso();
  const nextTrial = addMonthsIso(baseDate, 1);
  const confirmed = await showConfirm({
    eyebrow: "Gestion comercial",
    title: "Ampliar prueba 30 dias",
    message: `La prueba de ${clinic.name} pasara a finalizar el ${nextTrial}.`,
    detail: "Esto actualiza el estado interno de Klinia y queda auditado. No modifica una suscripcion de Stripe ya creada.",
    confirmLabel: "Ampliar prueba",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}`, {
      method: "PATCH",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify({
        subscription_status: "trialing",
        trial_ends_at: `${nextTrial}T23:59:59Z`
      })
    });
    await loadSuperadminPanel({ feedback: "Prueba ampliada.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo ampliar la prueba: ${error.message}`, "error");
  }
}

async function superadminApplyClinicPlan(clinicId, interval) {
  const clinic = clinicBySuperadminId(clinicId);
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden modificar clinicas persistidas en backend.", "warning");
    return;
  }
  const plan = superadminPlanForInterval(interval);
  if (!plan) {
    showToast(`No se ha recibido un plan ${interval} desde backend. Revisa configuracion de Stripe.`, "warning");
    return;
  }
  const confirmed = await showConfirm({
    eyebrow: "Gestion comercial",
    title: `Aplicar ${plan.name}`,
    message: `Actualizar ${clinic.name} a ${plan.name}.`,
    detail: "Esto actualiza el plan interno y el price_id visible en Klinia. No ejecuta cobro ni cambia una suscripcion activa en Stripe.",
    confirmLabel: "Aplicar plan",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}`, {
      method: "PATCH",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify({
        subscription_plan: plan.id || clinic.subscription_plan || "",
        stripe_price_id: plan.price_id || "",
        subscription_status: clinic.subscription_status === "archived" ? "trialing" : (clinic.subscription_status || "active")
      })
    });
    await loadSuperadminPanel({ feedback: "Plan actualizado.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo aplicar el plan: ${error.message}`, "error");
  }
}

async function superadminArchiveTestClinic(clinicId) {
  const clinic = clinicBySuperadminId(clinicId) || superadminData.clinics.find((item) => String(item.id) === String(clinicId));
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden archivar clinicas persistidas en backend.", "warning");
    return;
  }
  const hasRealSignals = Number(clinic.users_count || 0) > 1
    || ["active", "trialing", "past_due"].includes(String(clinic.subscription_status || "").toLowerCase());
  const confirmed = await showConfirm({
    eyebrow: "Accion sensible",
    title: "Archivar clinica de prueba",
    message: `Archivar ${clinic.name}.`,
    detail: hasRealSignals
      ? "Esta clinica tiene usuarios o estado comercial activo. No se borraran datos fisicos, pero sus usuarios quedaran desactivados. Confirma solo si es una simulacion."
      : "Se desactivaran sus usuarios y la clinica quedara marcada como archivada. La accion quedara auditada.",
    confirmLabel: "Archivar prueba",
    variant: "danger"
  });
  if (!confirmed) return;
  try {
    const updatedClinic = await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}/archive-test`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    superadminData.backendClinics = superadminData.backendClinics.map((item) => String(item.id) === String(updatedClinic.id) ? updatedClinic : item);
    superadminData.clinics = mergeSuperadminClinics(superadminData.backendClinics);
    selectedSuperadminClinicId = updatedClinic.id;
    await loadSuperadminPanel({ feedback: "Clinica archivada.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo archivar la clinica: ${error.message}`, "error");
  }
}

async function superadminRestoreClinic(clinicId) {
  const clinic = clinicBySuperadminId(clinicId) || superadminData.clinics.find((item) => String(item.id) === String(clinicId));
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden restaurar clinicas persistidas en backend.", "warning");
    return;
  }
  const confirmed = await showConfirm({
    eyebrow: "Restaurar clinica",
    title: "Restaurar clinica archivada",
    message: `Restaurar ${clinic.name}.`,
    detail: "La clinica volvera a estado de prueba y se reactivaran los usuarios de direccion. La accion quedara auditada.",
    confirmLabel: "Restaurar",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const updatedClinic = await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}/restore`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    selectedSuperadminClinicId = updatedClinic.id;
    await loadSuperadminPanel({ feedback: "Clinica restaurada.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo restaurar la clinica: ${error.message}`, "error");
  }
}

async function superadminDeleteClinicPermanently(clinicId) {
  const clinic = clinicBySuperadminId(clinicId) || superadminData.clinics.find((item) => String(item.id) === String(clinicId));
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden eliminar clinicas persistidas en backend.", "warning");
    return;
  }
  const firstConfirmed = await showConfirm({
    eyebrow: "Borrado permanente",
    title: "Eliminar clinica definitivamente",
    message: `Vas a borrar ${clinic.name} y todos sus datos asociados.`,
    detail: "Esta accion no es un archivo: elimina usuarios, pacientes, agenda, facturacion interna, auditoria asociada y datos operativos. Usa esta opcion solo para pruebas o simulaciones.",
    confirmLabel: "Continuar",
    variant: "danger"
  });
  if (!firstConfirmed) return;
  const secondConfirmed = await showConfirm({
    eyebrow: "Confirmacion final",
    title: "Borrado irreversible",
    message: `Confirmacion final para eliminar ${clinic.name}.`,
    detail: "Despues de confirmar no se podra recuperar desde Klinia.",
    confirmLabel: "Eliminar definitivamente",
    variant: "danger"
  });
  if (!secondConfirmed) return;
  try {
    await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}/delete-permanent`, {
      method: "POST",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify({ confirm_name: clinic.name, confirm_phrase: "ELIMINAR" })
    });
    removeLocalClinicReferencesForSuperadmin(clinic);
    selectedSuperadminClinicId = "";
    await loadSuperadminPanel({ feedback: "Clinica eliminada permanentemente.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo eliminar la clinica: ${error.message}`, "error");
  }
}

async function superadminResetOwnerForClinic(clinicId) {
  const owner = superadminData.users.find((user) => user.clinic_id === clinicId && user.role === "owner" && user.active);
  if (!owner) {
    await superadminRepairClinicAccess(clinicId);
    return;
  }
  await superadminResetUserPassword(owner.id);
}

async function superadminRepairClinicAccess(clinicId) {
  const clinic = clinicBySuperadminId(clinicId) || superadminData.clinics.find((item) => String(item.id) === String(clinicId));
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se pueden reparar accesos de clinicas persistidas en backend.", "warning");
    return;
  }
  const confirmed = await showConfirm({
    eyebrow: "Soporte de acceso",
    title: "Reparar acceso de direccion",
    message: `Se activara o recreara el usuario de direccion de ${clinic.name}.`,
    detail: "Se generara una clave temporal, se forzara cambio de clave y quedara auditado.",
    confirmLabel: "Reparar acceso",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const result = await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}/repair-access`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    await loadSuperadminPanel();
    await showNotice(
      "Acceso reparado",
      `Usuario direccion: ${result.user_email}\nClave temporal: ${result.temporary_password}\nDebe cambiarla al iniciar sesion.`,
      { variant: "success" }
    );
  } catch (error) {
    showToast(`No se pudo reparar el acceso: ${error.message}`, "error");
  }
}

async function superadminCreatePractitionerAccess(practitionerId) {
  const confirmed = await showConfirm({
    eyebrow: "Soporte de acceso",
    title: "Crear acceso de trabajador",
    message: "Se creara o reutilizara el usuario backend del trabajador y se generara una clave temporal.",
    detail: "Solo funciona si el trabajador tiene email guardado. La accion quedara auditada.",
    confirmLabel: "Crear acceso",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const result = await backendRequest(`/superadmin/practitioners/${encodeURIComponent(practitionerId)}/create-access`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    await loadSuperadminPanel();
    await showNotice(
      "Acceso de trabajador creado",
      `Usuario: ${result.user_email}\nClave temporal: ${result.temporary_password}\nDebe cambiarla al iniciar sesion.`,
      { variant: "success" }
    );
  } catch (error) {
    showToast(`No se pudo crear el acceso del trabajador: ${error.message}`, "error");
  }
}

async function superadminCreateSupportTicketFromIssue(issue, status = "open") {
  const ticket = await backendRequest("/superadmin/support-tickets", {
    method: "POST",
    token: superadminToken(),
    auth: false,
    body: JSON.stringify({
      clinic_id: issue.clinic_id || undefined,
      user_id: issue.user_id || undefined,
      issue_key: issue.id,
      title: issue.message || issue.issue_type || "Incidencia de soporte",
      description: issue.recommended_action || "",
      priority: issue.severity === "critical" ? "high" : "medium",
      status
    })
  });
  return ticket;
}

async function superadminResolveAccessIssue(issueId, status = "resolved") {
  const issue = (superadminData.accessIssues || []).find((item) => String(item.id) === String(issueId));
  if (!issue) return;
  const confirmed = await showConfirm({
    eyebrow: "Soporte",
    title: status === "closed" ? "Cerrar incidencia" : "Resolver incidencia",
    message: issue.message,
    detail: "Se creara trazabilidad en soporte y la incidencia quedara ocultada si no vuelve a detectarse como critica.",
    confirmLabel: status === "closed" ? "Cerrar" : "Resolver",
    variant: status === "closed" ? "danger" : "primary"
  });
  if (!confirmed) return;
  try {
    await superadminCreateSupportTicketFromIssue(issue, status);
    await loadSuperadminPanel({ feedback: status === "closed" ? "Incidencia cerrada." : "Incidencia resuelta.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo actualizar soporte: ${error.message}`, "error");
  }
}

async function superadminUpdateSupportTicketStatus(ticketId, statusValue) {
  const ticket = (superadminData.supportTickets || []).find((item) => String(item.id) === String(ticketId));
  if (!ticket) return;
  const confirmed = await showConfirm({
    eyebrow: "Soporte",
    title: statusValue === "closed" ? "Cerrar ticket" : "Resolver ticket",
    message: ticket.title,
    detail: "Se guardara en el historial del ticket y en auditoria.",
    confirmLabel: statusValue === "closed" ? "Cerrar" : "Resolver",
    variant: statusValue === "closed" ? "danger" : "primary"
  });
  if (!confirmed) return;
  try {
    await backendRequest(`/superadmin/support-tickets/${encodeURIComponent(ticket.id)}`, {
      method: "PATCH",
      token: superadminToken(),
      auth: false,
      body: JSON.stringify({ status: statusValue, note: statusValue === "closed" ? "Cerrado desde SUPERADMI" : "Resuelto desde SUPERADMI" })
    });
    await loadSuperadminPanel({ feedback: "Ticket actualizado.", loadingLabel: "Actualizando..." });
  } catch (error) {
    showToast(`No se pudo actualizar el ticket: ${error.message}`, "error");
  }
}

async function superadminShowSupportTicketHistory(ticketId) {
  const ticket = (superadminData.supportTickets || []).find((item) => String(item.id) === String(ticketId));
  if (!ticket) return;
  const history = Array.isArray(ticket.history) && ticket.history.length
    ? ticket.history.map((item) => `${formatSuperadminDate(item.at)} - ${item.by || "Sistema"} - ${item.action || "actualizado"}${item.note ? `: ${item.note}` : ""}`).join("\n")
    : "Sin historial detallado.";
  await showNotice("Historial de ticket", history, { variant: "success" });
}

async function superadminImpersonateClinic(clinicId) {
  const clinic = clinicBySuperadminId(clinicId);
  if (!clinic || clinic.source !== "backend") {
    showToast("Solo se puede impersonar una clinica persistida en backend.", "warning");
    return;
  }
  const confirmed = await showConfirm({
    eyebrow: "Impersonacion",
    title: "Entrar como clinica",
    message: `Entraras temporalmente en ${clinic.name}.`,
    detail: "El token caduca en 30 minutos y la accion quedara registrada en auditoria.",
    confirmLabel: "Impersonar",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const session = await backendRequest(`/superadmin/clinics/${encodeURIComponent(clinic.id)}/impersonation-token`, {
      method: "POST",
      token: superadminToken(),
      auth: false
    });
    const accountKey = slugifyClinicName(clinic.name || clinic.id);
    ensureClinicAccount({
      key: accountKey,
      name: clinic.name || "Clinica",
      email: clinic.email || "",
      phone: clinic.phone || "",
      paymentPlan: normalizeSaasPlanId(clinic.subscription_plan || "trial"),
      subscriptionStatus: clinic.subscription_status || session.subscription_status || "active",
      billingStatus: clinic.subscription_status || session.subscription_status || "active",
      backendToken: session.access_token,
      backendClinicId: clinic.id,
      ownerEmail: clinic.email || ""
    });
    enterPlatform("owner", accountKey);
    showToast(`Sesion temporal abierta en ${clinic.name}.`, "success");
  } catch (error) {
    showToast(`No se pudo impersonar la clinica: ${error.message}`, "error");
  }
}

async function superadminExportClinicAudit(clinicId) {
  const clinic = clinicBySuperadminId(clinicId);
  if (!clinic) {
    showToast("Selecciona una clinica primero.", "warning");
    return;
  }
  const filter = $("#superadmin-clinic-filter");
  if (clinic.source === "backend" && filter) {
    filter.value = clinic.id;
    await loadSuperadminPanel();
  }
  setSuperadminModule("audit");
  exportSuperadminCsv();
}

async function loadSuperadminPanel(options = {}) {
  const token = superadminToken();
  if (!token) return false;
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

  setSuperadminBusy(true, options.loadingLabel || "Actualizando...");
  try {
    const loadErrors = [];
    const safeSuperadminRequest = async (label, requestPromise, fallback) => {
      try {
        return await requestPromise;
      } catch (error) {
        if ([401, 403].includes(error.status)) {
          throw error;
        }
        loadErrors.push(`${label}: ${error.message}`);
        return fallback;
      }
    };
    const [overview, backendClinics, users, audit, accessIssues, supportTickets, plans, health] = await Promise.all([
      safeSuperadminRequest("Resumen", backendRequest("/superadmin/overview", { token, auth: false }), {}),
      safeSuperadminRequest("Clinicas", backendRequest("/superadmin/clinics", { token, auth: false }), []),
      safeSuperadminRequest("Usuarios", backendRequest(`/superadmin/users${clinicId ? `?clinic_id=${encodeURIComponent(clinicId)}` : ""}`, { token, auth: false }), []),
      safeSuperadminRequest("Auditoria", backendRequest(`/superadmin/audit-log${params.toString() ? `?${params.toString()}` : ""}`, { token, auth: false }), []),
      safeSuperadminRequest("Incidencias", backendRequest("/superadmin/access-issues", { token, auth: false }), []),
      safeSuperadminRequest("Tickets", backendRequest(`/superadmin/support-tickets${clinicId ? `?clinic_id=${encodeURIComponent(clinicId)}` : ""}`, { token, auth: false }), []),
      safeSuperadminRequest("Planes", backendRequest("/billing/plans", { auth: false }), []),
      safeSuperadminRequest("Health", backendRequest("/health", { auth: false }), null)
    ]);
    const clinics = mergeSuperadminClinics(backendClinics);
    const selectedBackendClinic = clinicId
      ? backendClinics.find((clinic) => String(clinic.id) === String(clinicId))
      : null;
    const visibleClinics = clinicId
      ? clinics.filter((clinic) => String(clinic.id) === String(clinicId))
      : clinics;
    const visibleBackendClinics = clinicId
      ? backendClinics.filter((clinic) => String(clinic.id) === String(clinicId))
      : backendClinics;
    const visibleAccessIssues = clinicId
      ? accessIssues.filter((issue) => String(issue.clinic_id || "") === String(clinicId))
      : accessIssues;
    const visibleOverview = clinicId
      ? {
          ...overview,
          total_clinics: selectedBackendClinic ? 1 : 0,
          total_users: users.length,
          active_clinics: selectedBackendClinic?.subscription_status === "active" ? 1 : 0,
          trialing_clinics: ["trial", "trialing"].includes(String(selectedBackendClinic?.subscription_status || "")) ? 1 : 0,
          past_due_clinics: ["past_due", "incomplete", "canceled", "archived", "blocked"].includes(String(selectedBackendClinic?.subscription_status || "")) ? 1 : 0,
          failed_logins_24h: audit.filter((item) => item.action === "login-failed").length,
          activity_24h: audit.length
        }
      : overview;
    const localClinics = clinics.filter((clinic) => clinic.source === "local");
    superadminData = {
      overview: visibleOverview,
      clinics: visibleClinics,
      backendClinics: visibleBackendClinics,
      users,
      audit,
      accessIssues: visibleAccessIssues,
      supportTickets,
      plans,
      health,
      loadErrors
    };
    if (clinicId) {
      selectedSuperadminClinicId = clinicId;
    } else if (!selectedSuperadminClinicId || !clinics.some((clinic) => String(clinic.id) === String(selectedSuperadminClinicId))) {
      selectedSuperadminClinicId = clinics[0]?.id || "";
    }
    const localSyncNote = $("#superadmin-local-sync-note");
    if (localSyncNote) {
      if (loadErrors.length) {
        localSyncNote.textContent = `Panel cargado parcialmente. Modulo Sistema muestra el detalle tecnico: ${loadErrors.join(" | ")}`;
        localSyncNote.classList.remove("hidden");
      } else if (localClinics.length) {
        localSyncNote.textContent = `${localClinics.length} clinica${localClinics.length === 1 ? "" : "s"} requiere${localClinics.length === 1 ? "" : "n"} revision de sincronizacion. Aparece${localClinics.length === 1 ? "" : "n"} para mantener visibilidad operativa, pero su auditoria completa empieza al quedar en backend.`;
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
    if (options.feedback) {
      showToast(options.feedback, "success");
    }
    return true;
  } catch (error) {
    if ([401, 403].includes(error.status)) {
      clearSuperadminSession();
      showPublicView("login", { updateHash: true, resetLogin: true });
      showLoginError("La sesion de superadmin ha caducado o no tiene permisos. Vuelve a iniciar sesion.", $("#login-form")?.elements?.center);
      return false;
    }
    showToast(`No se pudo cargar el panel superadmin: ${error.message}`, "error");
    return false;
  } finally {
    setSuperadminBusy(false);
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
  } catch (error) {
    if (backendRequiredForProduction()) {
      throw error;
    }
    // En desarrollo local se permite seguir probando aunque el backend no este enlazado.
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
    return "Faltan usuario o contraseña, o la app esta usando una version antigua. Actualiza la pagina y vuelve a intentarlo.";
  }
  if (error?.status === 429) {
    return "Se han hecho demasiados intentos de acceso. Espera unos minutos y vuelve a intentarlo.";
  }
  if (error?.network || String(error?.message || "").toLowerCase().includes("failed to fetch")) {
    return "No se pudo conectar con el servidor de Klinia. Revisa la conexion y actualiza la pagina.";
  }
  return error?.message || "No se pudo comprobar el acceso con el backend.";
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function canFallbackToLocalLogin(error, identifier) {
  if (!error) return true;
  if (!backendRequiredForProduction()) return true;
  return false;
}

function profileLoginIdentity(account, profile, practitioner = null) {
  if (!account) {
    return { email: "", password: "", label: "" };
  }
  if (profile === "owner") {
    return {
      email: ownerEmailForAccount(account),
      password: ownerPasswordForAccount(account),
      label: account.ownerName || "Direccion"
    };
  }
  if (profile === "staff") {
    return {
      email: account.staffEmail || "",
      password: account.staffPassword || "",
      label: "Recepcion / empleado"
    };
  }
  return {
    email: practitioner?.email || "",
    password: practitioner?.password || "",
    label: practitioner?.name || "Trabajador"
  };
}

function currentSessionAccessIdentity() {
  if (superadminSession?.user?.role === "superadmin") {
    return {
      label: "Superadmin",
      email: superadminSession.user.email || "",
      localPassword: "",
      backendUserId: superadminSession.user.id || null,
      role: "superadmin"
    };
  }
  const account = currentClinicAccount();
  if (isOwner()) {
    return {
      label: "Direccion",
      email: ownerEmailForAccount(account),
      localPassword: ownerPasswordForAccount(account),
      backendUserId: null,
      role: "owner"
    };
  }
  if (isStaff()) {
    return {
      label: "Recepcion",
      email: account.staffEmail || "",
      localPassword: account.staffPassword || "",
      backendUserId: null,
      role: "staff"
    };
  }
  const practitioner = currentPractitioner();
  return {
    label: practitioner?.name || "Trabajador",
    email: practitioner?.email || "",
    localPassword: practitioner?.password || "",
    backendUserId: practitioner?.userId || practitioner?.backendUserId || null,
    role: "practitioner"
  };
}

function updateLocalCurrentSessionPassword(nextPassword) {
  const account = currentClinicAccount();
  if (!account || account.key === demoClinicKey) return;
  if (isOwner()) {
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
      item.key === activeClinicKey ? { ...item, password: nextPassword, ownerPassword: nextPassword } : item
    )));
    saveClinicAccounts();
  } else if (isStaff()) {
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((item) => (
      item.key === activeClinicKey ? { ...item, staffPassword: nextPassword } : item
    )));
    saveClinicAccounts();
  } else if (currentSession.practitionerId) {
    practitioners = practitioners.map((item) => (
      item.id === currentSession.practitionerId ? { ...item, password: nextPassword } : item
    ));
    saveClinicState("practitioners", practitioners);
  }
  renderLoginProfiles();
}

function openChangePasswordDialog(options = {}) {
  const dialog = $("#change-password-dialog");
  const form = $("#change-password-form");
  if (!dialog || !form) return;
  form.reset();
  if (options.currentPassword && form.elements.currentPassword) {
    form.elements.currentPassword.value = options.currentPassword;
  }
  const identity = currentSessionAccessIdentity();
  const force = Boolean(options.force);
  dialog.dataset.forcePasswordChange = force ? "true" : "false";
  dialog.dataset.backendToken = options.backendToken || "";
  dialog.dataset.accountKey = options.accountKey || activeClinicKey || "";
  $$("[data-password-change-optional]").forEach((button) => {
    button.classList.toggle("hidden", force);
  });
  $("#change-password-help").textContent = options.force
    ? `Has entrado con una clave temporal como ${identity.label}. Debes cambiarla ahora para poder seguir usando Klinia con normalidad.`
    : `Cambia la clave de ${identity.label}${identity.email ? ` (${identity.email})` : ""}. No guardamos contrasenas reales en claro.`;
  $("#change-password-error").textContent = "";
  $("#change-password-error").classList.remove("visible");
  dialog.showModal();
}

async function submitPasswordChange(form) {
  const currentPassword = form.elements.currentPassword.value;
  const newPassword = form.elements.newPassword.value;
  const confirmPassword = form.elements.confirmPassword.value;
  const error = $("#change-password-error");
  error.classList.remove("visible");
  error.textContent = "";
  if (!currentPassword || !newPassword || !confirmPassword) {
    error.textContent = "Completa la clave actual y la nueva clave.";
    error.classList.add("visible");
    return;
  }
  const policyMessage = registerPasswordPolicyMessage(newPassword).replace("contrasena", "clave");
  if (policyMessage) {
    error.textContent = policyMessage;
    error.classList.add("visible");
    return;
  }
  if (newPassword !== confirmPassword) {
    error.textContent = "Las dos claves nuevas no coinciden.";
    error.classList.add("visible");
    return;
  }
  const identity = currentSessionAccessIdentity();
  const dialog = $("#change-password-dialog");
  const account = currentClinicAccount();
  const forcedBackendToken = dialog?.dataset.backendToken || "";
  const activeBackendToken = identity.role === "superadmin" ? superadminToken() : (forcedBackendToken || backendTokenForAccount(account));
  const hasBackend = Boolean(activeBackendToken);
  if (hasBackend) {
    try {
      await backendRequest("/me/password", {
        method: "POST",
        token: activeBackendToken,
        auth: false,
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
    } catch (backendError) {
      error.textContent = backendError.status === 401
        ? "La clave actual no es correcta."
        : `No se pudo actualizar la clave en backend: ${backendError.message}`;
      error.classList.add("visible");
      return;
    }
    if (dialog) {
      dialog.dataset.forcePasswordChange = "false";
      dialog.dataset.backendToken = "";
      dialog.dataset.accountKey = "";
    }
    $("#change-password-dialog")?.close();
    showToast(identity.role === "superadmin" ? "Clave de superadmin actualizada correctamente." : "Clave actualizada correctamente.", "success");
    return;
  }
  if (!hasBackend) {
    const identity = currentSessionAccessIdentity();
    if (identity.localPassword && currentPassword !== identity.localPassword) {
      error.textContent = "La clave actual no es correcta.";
      error.classList.add("visible");
      return;
    }
  }
  updateLocalCurrentSessionPassword(newPassword);
  if (dialog) {
    dialog.dataset.forcePasswordChange = "false";
    dialog.dataset.backendToken = "";
    dialog.dataset.accountKey = "";
  }
  $("#change-password-dialog")?.close();
  showToast("Clave actualizada correctamente.", "success");
}

async function tryBackendLogin(identifier, password, options = {}) {
  const cleanIdentifier = String(identifier || "").trim();
  if (!cleanIdentifier || !password) {
    return { handled: false, error: null };
  }
  const resolvedAccount = options.account || clinicAccountByClinicIdentifier(cleanIdentifier) || clinicAccountByLogin(cleanIdentifier);
  const backendEmail = cleanIdentifier;
  const backendClinicEmail = options.clinicEmail || resolvedAccount?.email || resolvedAccount?.name || "";
  try {
    const session = await backendRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: backendEmail,
        password,
        clinic_id: options.clinicId || resolvedAccount?.backendClinicId || undefined,
        clinic_email: backendClinicEmail || undefined
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
      openingStart: me?.clinic?.opening_start || options.account?.openingStart || "09:00",
      openingEnd: me?.clinic?.opening_end || options.account?.openingEnd || "20:00",
      workingDays: normalizeWorkingDays(me?.clinic?.working_days || options.account?.workingDays),
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
    if (session.force_password_change || me?.user?.force_password_change) {
      showToast("Has entrado con una clave temporal. Debes crear una clave nueva para continuar.", "warning");
      setTimeout(() => openChangePasswordDialog({
        force: true,
        currentPassword: password,
        backendToken: session.access_token,
        accountKey
      }), 300);
    }
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
    metadata_json: backendMetadataJson(patient, [
      "name",
      "firstName",
      "lastName",
      "phone",
      "email",
      "dni",
      "dniFileName",
      "dniFileData",
      "sex",
      "birthDate",
      "occupation",
      "municipality",
      "city",
      "postalCode",
      "alert",
      "status",
      "last"
    ])
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
    userId: practitioner.user_id || meta.userId || "",
    workerType: meta.workerType || "autonomo",
    accessRole: meta.accessRole || (meta.role === "staff" ? "staff" : "practitioner"),
    serviceCommissions: meta.serviceCommissions || {},
    attendanceRecords: Array.isArray(meta.attendanceRecords) ? meta.attendanceRecords : [],
    active: practitioner.active !== false
  };
}

function uiPractitionerToApi(practitioner) {
  return {
    name: practitioner.name,
    specialty: practitioner.specialty || null,
    color: practitioner.color || "#168776",
    commission_rate: 0,
    monthly_target_cents: Math.round(Number(practitioner.target || 0) * 100),
    availability_start: practitioner.availabilityStart || "08:00",
    availability_end: practitioner.availabilityEnd || "14:00",
    availability_start_2: practitioner.availabilityStart2 || null,
    availability_end_2: practitioner.availabilityEnd2 || null,
    active: practitioner.active !== false,
    metadata_json: backendMetadataJson(practitioner, [
      "name",
      "specialty",
      "color",
      "commissionRate",
      "target",
      "availabilityStart",
      "availabilityEnd",
      "availabilityStart2",
      "availabilityEnd2",
      "active",
      "password",
      "userId",
      "backendUserId",
      "attendanceRecords"
    ])
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
    metadata_json: backendMetadataJson(candidate, [
      "patientId",
      "practitionerId",
      "roomId",
      "serviceId",
      "date",
      "start",
      "end",
      "status",
      "internalNotes",
      "paymentStatus",
      "paymentMethod",
      "patientPackId",
      "plannedPatientPackId",
      "patientPackUsedAt",
      "invoiceGenerated",
      "invoiceGeneratedAt",
      "invoiceNumber",
      "groupAttendees",
      "outsideHours",
      "outsideHoursNotice",
      "createdBy",
      "movedAt",
      "movedBy",
      "cancelledBy",
      "cancelledAt"
    ])
  };
}

function apiManualBillingMovementToUi(item) {
  const meta = parseBackendMetadata(item.metadata_json);
  return {
    ...meta,
    id: item.id,
    type: item.type,
    date: item.date,
    amount: Number(item.amount_cents || 0) / 100,
    concept: item.concept || "",
    createdAt: item.created_at || "",
    createdBy: item.created_by_name || "",
    paymentMethod: meta.paymentMethod || "cash",
    source: meta.source || "",
    groupMonthlyKey: meta.groupMonthlyKey || ""
  };
}

function uiManualBillingMovementToApi(item) {
  return {
    type: item.type,
    date: item.date,
    amount_cents: Math.round(Number(item.amount || 0) * 100),
    concept: item.concept,
    created_by_name: item.createdBy || currentSessionName(),
    metadata_json: JSON.stringify({
      paymentMethod: item.paymentMethod || "cash",
      source: item.source || "",
      groupMonthlyKey: item.groupMonthlyKey || ""
    })
  };
}

function apiAttendanceRecordToUi(item) {
  return {
    id: item.id,
    practitionerId: item.practitioner_id,
    date: item.date,
    start: isoTimeLabel(item.clock_in_at),
    end: isoTimeLabel(item.clock_out_at),
    clockInAt: item.clock_in_at || "",
    clockOutAt: item.clock_out_at || "",
    createdAt: item.created_at || "",
    updatedAt: item.updated_at || ""
  };
}

function isoTimeLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(11, 16);
  }
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

async function savePatientToBackend(patient, previousId = "") {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para guardar pacientes.");
    }
    return patient;
  }
  const { method, path } = backendWriteTarget("/patients", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiPatientToApi(patient))
  });
  return apiPatientToUi(saved, patient);
}

async function deletePatientFromBackend(patientId) {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para eliminar pacientes.");
    }
    return;
  }
  if (!looksLikeBackendId(patientId)) return;
  await backendRequest(`/patients/${encodeURIComponent(patientId)}`, { method: "DELETE" });
}

async function savePractitionerToBackend(practitioner, previousId = "") {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para guardar trabajadores.");
    }
    return practitioner;
  }
  const { method, path } = backendWriteTarget("/practitioners", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiPractitionerToApi(practitioner))
  });
  return apiPractitionerToUi(saved, practitioner);
}

async function deletePractitionerFromBackend(practitionerId) {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para eliminar trabajadores.");
    }
    return;
  }
  if (!looksLikeBackendId(practitionerId)) return;
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
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para guardar citas.");
    }
    return appointment;
  }
  const { method, path } = backendWriteTarget("/appointments", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiAppointmentToApi(appointment))
  });
  return apiAppointmentToUi(saved, appointment);
}

async function saveClinicSettingsToBackend(nextClinic) {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para guardar configuracion.");
    }
    return nextClinic;
  }
  let saved;
  saved = await backendRequest("/clinic/settings", {
    method: "PATCH",
    body: JSON.stringify({
      name: nextClinic.name,
      email: nextClinic.email || undefined,
      phone: nextClinic.phone || "",
      working_days: normalizeWorkingDays(nextClinic.workingDays),
      opening_start: nextClinic.openingStart || "09:00",
      opening_end: nextClinic.openingEnd || "20:00"
    })
  });
  return {
    ...nextClinic,
    name: saved.name || nextClinic.name,
    email: saved.email || nextClinic.email,
    phone: saved.phone || nextClinic.phone,
    openingStart: saved.opening_start || nextClinic.openingStart,
    openingEnd: saved.opening_end || nextClinic.openingEnd,
    workingDays: normalizeWorkingDays(saved.working_days || nextClinic.workingDays)
  };
}

async function saveManualBillingMovementToBackend(movement, previousId = "") {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para guardar movimientos.");
    }
    return movement;
  }
  const { method, path } = backendWriteTarget("/manual-billing-movements", previousId);
  const saved = await backendRequest(path, {
    method,
    body: JSON.stringify(uiManualBillingMovementToApi(movement))
  });
  return apiManualBillingMovementToUi(saved);
}

async function deleteManualBillingMovementFromBackend(movementId) {
  if (!backendDataEnabled() || !looksLikeBackendId(movementId)) return;
  await backendRequest(`/manual-billing-movements/${encodeURIComponent(movementId)}`, { method: "DELETE" });
}

async function backendOptionalCollection(path) {
  try {
    const items = await backendRequest(path);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    if (error.status === 404) {
      return [];
    }
    throw error;
  }
}

function isEmptySyncedClinicData(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value && typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return value === null || value === undefined || value === "";
}

async function loadClinicDataFromBackend(key, fallback) {
  try {
    const payload = await backendRequest(`/clinic-data/${encodeURIComponent(key)}`);
    if (!payload || typeof payload.data_json !== "string") {
      return fallback;
    }
    const parsed = JSON.parse(payload.data_json);
    return parsed ?? fallback;
  } catch (error) {
    if (error.status === 404) {
      return fallback;
    }
    throw error;
  }
}

async function saveClinicDataToBackend(key, value) {
  if (!backendDataEnabled()) {
    return value;
  }
  await backendRequest(`/clinic-data/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ data_json: JSON.stringify(value ?? null) })
  });
  return value;
}

async function syncClinicDataCollection(key, localValue, fallback, normalizer = (value) => value) {
  const backendValue = await loadClinicDataFromBackend(key, fallback);
  const normalizedBackend = normalizer(backendValue ?? fallback);
  const normalizedLocal = normalizer(localValue ?? fallback);
  if (!isEmptySyncedClinicData(normalizedBackend)) {
    return normalizedBackend;
  }
  if (!isEmptySyncedClinicData(normalizedLocal)) {
    await saveClinicDataToBackend(key, normalizedLocal);
    return normalizedLocal;
  }
  return normalizer(fallback);
}

async function syncImportedClinicDataBlobsToBackend() {
  if (!backendDataEnabled()) {
    return { synced: 0, skipped: "backend-disabled" };
  }
  let synced = 0;
  for (const key of backendSyncedClinicDataKeys) {
    const localValue = loadClinicState(key, null);
    if (!isEmptySyncedClinicData(localValue)) {
      await saveClinicDataToBackend(key, localValue);
      synced += 1;
    }
  }
  return { synced };
}

async function deleteAppointmentFromBackend(appointmentId) {
  if (!backendDataEnabled()) {
    if (backendAuthoritativeMode()) {
      throw new Error("La sesion backend no esta activa. Vuelve a iniciar sesion para eliminar citas.");
    }
    return;
  }
  if (!looksLikeBackendId(appointmentId)) return;
  await backendRequest(`/appointments/${encodeURIComponent(appointmentId)}`, { method: "DELETE" });
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
  saveSyncedClinicState("group-session-overrides", groupSessionOverrides);
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

function isValidTimeValue(value) {
  return /^\d{2}:\d{2}$/.test(String(value || ""));
}

function clinicOpeningHours() {
  const start = isValidTimeValue(clinic?.openingStart) ? clinic.openingStart : "08:00";
  const end = isValidTimeValue(clinic?.openingEnd) ? clinic.openingEnd : "21:00";
  if (minutes(start) >= minutes(end)) {
    return { start: "08:00", end: "21:00" };
  }
  return { start, end };
}

function agendaHours() {
  const { start, end } = clinicOpeningHours();
  const result = [];
  for (let cursor = start; minutes(cursor) < minutes(end) && result.length < 24; cursor = addMinutes(cursor, 60)) {
    result.push(cursor);
  }
  return result.length ? result : [...defaultAgendaHours];
}

function slotStartForTime(time) {
  const slots = agendaHours();
  const value = minutes(time);
  return slots.slice().reverse().find((slot) => minutes(slot) <= value) || slots[0] || "08:00";
}

function startsInsideSlot(time, slotStart) {
  const value = minutes(time);
  const slotValue = minutes(slotStart);
  return value >= slotValue && value < slotValue + 60;
}

function appointmentStartsInsideSlot(appointment, slotStart) {
  return startsInsideSlot(appointment.start || "00:00", slotStart);
}

function groupStartsInsideSlot(group, slotStart) {
  return startsInsideSlot(group.start || "00:00", slotStart);
}

function applyTimedBlockStyle(element, start, end, slotStart) {
  const slotMinutes = 60;
  const offset = Math.max(0, Math.min(slotMinutes, minutes(start) - minutes(slotStart)));
  const duration = Math.max(15, minutesBetween(start, end));
  element.classList.add("timed-block");
  element.style.setProperty("--event-offset", `${(offset / slotMinutes) * 100}%`);
  element.style.setProperty("--event-height", `${(duration / slotMinutes) * 100}%`);
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

function canViewClinicAgenda() {
  return isOwner() || isStaff() || isPractitionerSession();
}

function appointmentVisibleToCurrentSession(appointment) {
  if (!appointment) return false;
  if (canViewClinicAgenda()) return true;
  return !isPractitionerSession() || appointment.practitionerId === currentSession.practitionerId;
}

function groupVisibleToCurrentSession(group) {
  if (!group) return false;
  if (canViewClinicAgenda()) return true;
  return !isPractitionerSession() || group.practitionerId === currentSession.practitionerId;
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
  if (canViewClinicAgenda()) {
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
  return addMinutes(appointment.start, Number(service?.duration || 0) || (appointment.end ? minutesBetween(appointment.start, appointment.end) : 60));
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

function appointmentIsCharged(appointment) {
  if (normalizeAppointmentStatus(appointment?.status) !== "confirmed") {
    return false;
  }
  if (appointment?.patientPackId) {
    return true;
  }
  return ["cash", "card"].includes(appointmentPaymentStatus(appointment));
}

function practitionerServiceConfig(practitioner) {
  const config = practitioner?.serviceCommissions;
  return config && typeof config === "object" && Object.keys(config).length ? config : null;
}

function practitionerCanPerformService(practitioner, serviceId) {
  const config = practitionerServiceConfig(practitioner);
  if (!config) {
    return true;
  }
  return Boolean(config[serviceId]?.enabled);
}

function practitionerCommissionRateForService(practitioner, service) {
  const config = practitionerServiceConfig(practitioner);
  const serviceConfig = service?.id ? config?.[service.id] : null;
  if (serviceConfig?.enabled) {
    return Math.max(0, Number(serviceConfig.rate || 0));
  }
  return 0;
}

function serviceCommissionAmount(appointment, practitioner) {
  const service = byId(services, appointment.serviceId);
  const revenue = appointmentRevenueAmount(appointment);
  if (!appointmentIsCharged(appointment) || !practitionerCanPerformService(practitioner, appointment.serviceId)) {
    return 0;
  }
  return Math.round(revenue * practitionerCommissionRateForService(practitioner, service));
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

function updatePatientPackRemainingPreview(form = $("#patient-pack-form")) {
  if (!form?.elements?.remaining) {
    return;
  }
  const sessions = Math.max(1, Number(form.elements.sessions?.value || 1));
  const requestedUsed = Math.max(0, Number(form.elements.used?.value || 0));
  const used = Math.min(sessions, requestedUsed);
  if (form.elements.used && requestedUsed !== used) {
    form.elements.used.value = used;
  }
  form.elements.remaining.value = Math.max(0, sessions - used);
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
    if (pack.usageSource === "manual-correction") {
      if (Number(pack.linkedAppointmentUses || 0) === actualUsed) {
        return pack;
      }
      changed = true;
      return { ...pack, linkedAppointmentUses: actualUsed, updatedAt: new Date().toISOString() };
    }
    if (Number(pack.used || 0) === actualUsed) {
      return pack;
    }
    changed = true;
    return { ...pack, used: actualUsed, updatedAt: new Date().toISOString(), usageSource: "appointments" };
  });
  if (changed && options.persist) {
    saveSyncedClinicState("patient-packs", patientPacks);
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
    saveSyncedClinicState("patient-packs", patientPacks);
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
  saveSyncedClinicState("patient-packs", patientPacks);
}

const weekDayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekDayLabels = { mon: "Lunes", tue: "Martes", wed: "Miercoles", thu: "Jueves", fri: "Viernes", sat: "Sabado", sun: "Domingo" };
const registerDayKeyMap = { lun: "mon", mar: "tue", mie: "wed", jue: "thu", vie: "fri", sab: "sat", dom: "sun" };
const defaultWorkingDays = ["mon", "tue", "wed", "thu", "fri"];

function normalizeWorkingDayKey(value) {
  const key = String(value || "").trim().toLowerCase();
  return registerDayKeyMap[key] || (weekDayLabels[key] ? key : "");
}

function normalizeWorkingDays(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  const normalized = source.map(normalizeWorkingDayKey).filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : [...defaultWorkingDays];
}

function clinicWorkingDays() {
  return normalizeWorkingDays(clinic?.workingDays);
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

function groupDateRangeLabel(group) {
  if (group?.dateFrom && group?.dateTo) {
    return `${formatShortDate(group.dateFrom)} a ${formatShortDate(group.dateTo)}`;
  }
  if (group?.dateFrom) {
    return `Desde ${formatShortDate(group.dateFrom)}`;
  }
  if (group?.dateTo) {
    return `Hasta ${formatShortDate(group.dateTo)}`;
  }
  return "Sin fecha fin";
}

function groupDateRangeIncludes(group, dateValue) {
  if (!dateValue) {
    return true;
  }
  if (group?.dateFrom && dateValue < group.dateFrom) {
    return false;
  }
  if (group?.dateTo && dateValue > group.dateTo) {
    return false;
  }
  return true;
}

function groupDateRangesOverlap(first, second) {
  const firstStart = first?.dateFrom || "0000-01-01";
  const firstEnd = first?.dateTo || "9999-12-31";
  const secondStart = second?.dateFrom || "0000-01-01";
  const secondEnd = second?.dateTo || "9999-12-31";
  return firstStart <= secondEnd && secondStart <= firstEnd;
}

function groupOccursOnDate(group, dateValue) {
  return group.active !== false
    && Array.isArray(group.days)
    && group.days.includes(dayKeyFor(dateValue))
    && groupDateRangeIncludes(group, dateValue);
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
  const service = groupService(group);
  const practitioner = byId(practitioners, group.practitionerId);
  const fixedCount = groupFixedPatients(group).length;
  const dropinCount = groupDropInsFor(group, dateValue).length;
  const attendees = fixedCount + dropinCount;
  const fixedMonthlyRevenue = fixedCount * pricing.monthlyPrice;
  const expectedSessionsInMonth = groupExpectedSessionsInMonth(group, dateValue);
  const fixedSessionRevenue = Math.round(fixedMonthlyRevenue / expectedSessionsInMonth);
  const dropinRevenue = dropinCount * pricing.dropInPrice;
  const revenue = fixedSessionRevenue + dropinRevenue;
  const payout = Math.round(revenue * practitionerCommissionRateForService(practitioner, service));
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
  saveSyncedClinicState("group-completions", groupCompletions);
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
  saveSyncedClinicState("group-session-overrides", groupSessionOverrides);
}

function clearGroupSessionOverride(groupId, dateValue) {
  groupSessionOverrides = groupSessionOverrides.filter((item) => !(item.groupId === groupId && item.date === dateValue));
  saveSyncedClinicState("group-session-overrides", groupSessionOverrides);
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

function findConflict(candidate, ignoredAppointmentId = "") {
  const service = byId(services, candidate.serviceId);
  const candidateEnd = addMinutes(candidate.start, service?.duration || 60);

  return appointments.find((appointment) => {
    if (String(appointment.id) === String(ignoredAppointmentId) || !isBlockingAppointmentStatus(appointment.status)) {
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
    return practitioners;
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
  if (isPractitionerSession() && !selectedPractitionerIds.includes("all")) {
    selectedPractitionerIds = ["all"];
    saveState("selected-practitioner-ids", selectedPractitionerIds);
  }
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
      <input type="checkbox" value="all" ${selectedPractitionerIds.includes("all") ? "checked" : ""} />
      <span>Todos</span>
    </label>
    ${practitioners.map((practitioner) => `
      <label class="filter-chip">
        <input type="checkbox" value="${practitioner.id}" ${selectedPractitionerIds.includes("all") || selectedPractitionerIds.includes(practitioner.id) ? "checked" : ""} />
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

function updateAppointmentDurationPreview(form = $("#appointment-form")) {
  const preview = $("#appointment-duration-preview");
  if (!preview || !form) return;
  const service = byId(services, form.elements.service?.value);
  const start = form.elements.start?.value || "";
  if (!service || !isValidTimeValue(start)) {
    preview.textContent = "";
    return;
  }
  const duration = Number(service.duration || 60);
  preview.textContent = `Duración del servicio: ${duration} min. La cita quedará ${start} - ${addMinutes(start, duration)}.`;
}

function updateAppointmentOutsideHoursWarning(form = $("#appointment-form")) {
  const warning = $("#appointment-outside-hours-warning");
  if (!warning) {
    return;
  }
  updateAppointmentDurationPreview(form);
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

  agendaHours().forEach((hour) => {
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
        .filter((group) => groupStartsInsideSlot(group, hour) && group.practitionerId === practitioner.id)
        .filter(groupPassesAgendaFilters);
      const hourAppointments = dayAppointments.filter((item) => appointmentStartsInsideSlot(item, hour) && item.practitionerId === practitioner.id && appointmentPassesAgendaFilters(item));

      if (hourGroups.length || hourAppointments.length) {
        hourGroups.forEach((group) => cell.append(renderGroupBlock(group, selectedDate, "day", hour)));
        hourAppointments.forEach((appointment) => cell.append(renderAppointment(appointment, hour)));
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
        .filter(appointmentVisibleToCurrentSession)
        .filter(appointmentPassesAgendaFilters).length;
      const groupCount = groupsForDate(dateValue)
        .filter(groupVisibleToCurrentSession)
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
      .filter(appointmentVisibleToCurrentSession)
      .filter(appointmentPassesAgendaFilters)
      .sort((a, b) => minutes(a.start) - minutes(b.start));
    const dayGroups = groupsForDate(day)
      .filter(groupVisibleToCurrentSession)
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
  const useTimedWeekBlocks = true;
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

  agendaHours().forEach((hour) => {
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
        .filter((item) => (item.date || selectedDate) === day && appointmentStartsInsideSlot(item, hour))
        .filter(appointmentVisibleToCurrentSession)
        .filter(appointmentPassesAgendaFilters)
        .sort((a, b) => {
          const aName = byId(practitioners, a.practitionerId)?.name || "";
          const bName = byId(practitioners, b.practitionerId)?.name || "";
          return aName.localeCompare(bName, "es");
        });
      const hourGroups = groupsForDate(day)
        .filter((group) => groupStartsInsideSlot(group, hour))
        .filter(groupVisibleToCurrentSession)
        .filter(groupPassesAgendaFilters)
        .sort((a, b) => {
          const aName = byId(practitioners, a.practitionerId)?.name || "";
          const bName = byId(practitioners, b.practitionerId)?.name || "";
          return aName.localeCompare(bName, "es");
        });

      if (hourAppointments.length || hourGroups.length) {
        const timedItems = [
          ...hourGroups.map((group) => ({
            start: group.start,
            end: groupEnd(group),
            render: () => renderGroupBlock(group, day, "week", hour, useTimedWeekBlocks)
          })),
          ...hourAppointments.map((appointment) => ({
            start: appointment.start,
            end: appointmentEnd(appointment),
            render: () => renderWeekAppointment(appointment, hour, useTimedWeekBlocks)
          }))
        ];
        if (useTimedWeekBlocks) {
          cell.classList.add("has-timed-items");
        }
        timedItems.forEach((item, index) => {
          const block = item.render();
          if (useTimedWeekBlocks) {
            const lane = weekTimedLaneFor(item, timedItems, index);
            applyWeekTimedLaneStyle(block, lane.index, lane.total);
          }
          cell.append(block);
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

function weekTimedLaneFor(item, items, index) {
  const overlappingItems = items
    .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
    .filter(({ candidate }) => overlappingMinutes(item.start, item.end, candidate.start, candidate.end) > 0);
  if (overlappingItems.length <= 1) {
    return { index: 0, total: 1 };
  }
  return {
    index: Math.max(0, overlappingItems.findIndex(({ candidateIndex }) => candidateIndex === index)),
    total: overlappingItems.length
  };
}

function applyWeekTimedLaneStyle(element, laneIndex = 0, laneTotal = 1) {
  if (!element || laneTotal <= 1) {
    return;
  }
  const laneWidth = 100 / laneTotal;
  element.style.setProperty("--event-left", `calc(${laneIndex * laneWidth}% + 4px)`);
  element.style.setProperty("--event-right", `calc(${(laneTotal - laneIndex - 1) * laneWidth}% + 4px)`);
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
  let movedAppointment = { ...appointment, date: dateValue, start: hour, end: addMinutes(hour, byId(services, appointment.serviceId)?.duration || 60), movedAt: new Date().toISOString(), movedBy: currentSessionName() };
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

function renderWeekAppointment(appointment, slotStart = slotStartForTime(appointment.start || "00:00"), useTimedBlock = true) {
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
  if (useTimedBlock) {
    applyTimedBlockStyle(button, appointment.start, appointmentEnd(appointment), slotStart);
  }
  setupAppointmentDrag(button, appointment);
  button.addEventListener("click", () => {
    if (Date.now() < suppressAppointmentClickUntil) return;
    openAppointmentDetail(appointment.id);
  });
  return button;
}

function renderAppointment(appointment, slotStart = slotStartForTime(appointment.start || "00:00")) {
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
    <strong><i></i>${appointment.start} - ${appointmentEnd(appointment)} - ${patient?.name || "Paciente no encontrado"}</strong>
    <span>${service?.name || "Servicio"} - ${room?.name || "Sala"} - ${statusLabel(appointment.status)}</span>
  `;
  applyTimedBlockStyle(button, appointment.start, appointmentEnd(appointment), slotStart);
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
    agendaHours().forEach((hour) => {
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
          .filter(appointmentVisibleToCurrentSession)
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

function renderGroupBlock(group, dateValue = selectedDate, mode = "day", slotStart = slotStartForTime(group.start || "00:00"), useTimedBlock = true) {
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
    <span>${dateValue} · ${group.start} - ${groupEnd(group)} - ${room?.name || "Sala"}</span>
    ${group.sessionOverride ? `<em class="session-exception-badge">Cambio puntual</em>` : ""}
  `;
  if (useTimedBlock) {
    applyTimedBlockStyle(card, group.start, groupEnd(group), slotStart);
  }
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
  if (completedButton) {
    completedButton.disabled = completed;
    completedButton.textContent = completed ? "Sesion completada" : "Marcar sesion completada";
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
      saveSyncedClinicState("groups", groups);
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
      saveSyncedClinicState("group-dropins", groupDropIns);
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
  $(".day-panel")?.classList.toggle("hidden", calendarMode !== "day");
  if (calendarMode !== "day") {
    updateTopbarChrome();
    return;
  }
  list.innerHTML = "";
  updateTopbarChrome();
  $(".day-panel h2").textContent = "Citas del dia";
  const range = calendarRange();
  const visibleGroups = [];
  for (let cursor = range.start; cursor <= range.end; cursor = addDaysIso(cursor, 1)) {
    groupsForDate(cursor)
      .filter(groupVisibleToCurrentSession)
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
          <span>${remaining} disponibles de ${item.sessions} (${Number(item.used || 0)} utilizadas) - ${expired ? "Caducado - " : remaining <= 0 ? "Agotado - " : ""}${item.price} EUR - ${packServiceLabel(item)} - ${patientPackExpiryLabel(item)} ${item.invoice ? "- Facturable" : ""}${item.invoiceGenerated ? ` - ${item.invoiceNumber || "Factura generada"}` : ""}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" data-edit-patient-pack="${item.id}">Editar</button>
          <button class="secondary-button compact-inline-button" type="button" data-invoice-patient-pack="${item.id}">${item.invoiceGenerated ? "Reimprimir" : "Facturar"}</button>
          <button class="danger-button compact-inline-button" type="button" data-delete-patient-pack="${item.id}">Eliminar</button>
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
        && !appointment.patientPackId
        && !appointment.plannedPatientPackId
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
    button.addEventListener("click", () => {
      const packId = button.dataset.invoicePatientPack || button.dataset.reprintPackInvoice;
      const pack = byId(patientPacks, packId);
      if (pack && !pack.paymentMethod) {
        openPatientPackDialog(packId);
        const error = $("#patient-pack-error");
        if (error) {
          error.textContent = "Selecciona efectivo o tarjeta antes de facturar el bono.";
          error.classList.add("visible");
        }
        return;
      }
      generateInvoiceForPatientPack(packId);
    });
  });
  $$("[data-delete-patient-pack]").forEach((button) => {
    button.addEventListener("click", () => deletePatientPackAssignment(button.dataset.deletePatientPack));
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
    saveSyncedClinicState("group-completions", groupCompletions);
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
  if (clinicForm.elements.openingStart) {
    clinicForm.elements.openingStart.value = clinic.openingStart || "09:00";
  }
  if (clinicForm.elements.openingEnd) {
    clinicForm.elements.openingEnd.value = clinic.openingEnd || "20:00";
  }
  const workingDays = new Set(clinicWorkingDays());
  $$("input[name='workingDays']", clinicForm).forEach((input) => {
    input.checked = workingDays.has(input.value);
  });
  if (clinicForm.elements.reminderMessageTemplate) {
    clinicForm.elements.reminderMessageTemplate.value = reminderSettings.reminderMessageTemplate || defaultReminderSettings().reminderMessageTemplate;
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
          <span>${practitioner.specialty} - ${practitionerAvailabilityLabel(practitioner)} - ${practitioner.workerType === "asalariado" ? "Empleado asalariado" : "Autonomo"}</span>
          <span>${practitioner.accessRole === "staff" ? "Acceso recepcion / administracion" : "Acceso trabajador sanitario"}</span>
          <span>${Object.values(practitioner.serviceCommissions || {}).filter((item) => item?.enabled).length || "Sin"} servicios con comisión configurada</span>
          <span>${practitioner.email || "Sin email de acceso"} - ${practitioner.password ? "Clave configurada" : "Sin clave configurada"}</span>
          ${practitioner.workerType === "asalariado" ? `
            <div class="attendance-actions">
              <small>${attendanceStatusForPractitioner(practitioner)}</small>
              <button class="secondary-button" type="button" data-clock-in="${practitioner.id}">Fichar entrada</button>
              <button class="secondary-button" type="button" data-clock-out="${practitioner.id}">Fichar salida</button>
            </div>
          ` : ""}
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
  $$("[data-clock-in]").forEach((button) => button.addEventListener("click", () => clockPractitioner(button.dataset.clockIn, "in")));
  $$("[data-clock-out]").forEach((button) => button.addEventListener("click", () => clockPractitioner(button.dataset.clockOut, "out")));

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
            <span>Mensual ${service.monthlyPrice || 0} EUR - Sesion suelta ${service.dropInPrice || service.price || 0} EUR - Comision por trabajador</span>
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
              <span>Periodo: ${groupDateRangeLabel(group)}</span>
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
                  ${patients.filter((patient) => !(group.patientIds || []).includes(patient.id)).map((patient) => `<option value="${escapeHtml(patient.name)}" label="${escapeHtml(`${patient.name} - ${patient.phone || "sin telefono"}`)}"></option>`).join("")}
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
        const typedLower = typed.toLowerCase();
        const typedPhone = typed.replace(/\D/g, "");
        const patient = patients.find((item) => (
          item.id === typed
          || item.name.toLowerCase() === typedLower
          || (typedPhone && String(item.phone || "").replace(/\D/g, "").includes(typedPhone))
        ));
        if (!patient) return;
        const group = groups.find((item) => item.id === groupId);
        if (!group) return;
        if ((group.patientIds || []).includes(patient.id)) return;
        if ((group.patientIds || []).length >= groupCapacity(group)) {
          showNotice("Grupo completo", "El grupo ya esta completo para esta fecha.", { variant: "warning" });
          return;
        }
        groups = groups.map((item) => item.id === groupId ? { ...item, patientIds: [...(item.patientIds || []), patient.id] } : item);
        saveSyncedClinicState("groups", groups);
        renderAll();
      });
    });
    $$("[data-config-remove-fixed]").forEach((button) => {
      button.addEventListener("click", () => {
        const [groupId, patientId] = button.dataset.configRemoveFixed.split(":");
        groups = groups.map((item) => item.id === groupId ? { ...item, patientIds: (item.patientIds || []).filter((id) => id !== patientId) } : item);
        saveSyncedClinicState("groups", groups);
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
            ? `Sesion grupal - ${service.dropInPrice || service.price || 0} EUR/sesion - ${service.monthlyPrice || 0} EUR/mes - comision por trabajador`
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

function billingFilterRange() {
  const mode = billingFilterState.mode || "current-month";
  if (mode === "day") {
    const day = billingFilterState.day || selectedDate || todayIso();
    return { start: day, end: day };
  }
  if (mode === "month") {
    const month = billingFilterState.month || todayIso().slice(0, 7);
    return { start: `${month}-01`, end: monthEndIso(`${month}-01`) };
  }
  if (mode === "range") {
    const start = billingFilterState.from || monthStartIso(todayIso());
    const end = billingFilterState.to || start;
    return start <= end ? { start, end } : { start: end, end: start };
  }
  const current = todayIso();
  return { start: monthStartIso(current), end: monthEndIso(current) };
}

function billingRowDate(row) {
  return String(row.sortKey || row.date || todayIso()).slice(0, 10);
}

function billingRowInRange(row, range) {
  const date = billingRowDate(row);
  return date >= range.start && date <= range.end;
}

function signedManualBillingAmount(row) {
  return row.type === "payment" ? -Math.abs(Number(row.amount || 0)) : Math.abs(Number(row.amount || 0));
}

function updateBillingFilterControls() {
  const mode = billingFilterState.mode || "current-month";
  $("#billing-filter-mode").value = mode;
  $("#billing-filter-day").value = billingFilterState.day || selectedDate || todayIso();
  $("#billing-filter-month").value = billingFilterState.month || todayIso().slice(0, 7);
  $("#billing-filter-from").value = billingFilterState.from || monthStartIso(todayIso());
  $("#billing-filter-to").value = billingFilterState.to || monthEndIso(todayIso());
  $("#billing-sort-order").value = billingFilterState.sort || "desc";
  updateBillingFilterFieldVisibility(mode);
}

function updateBillingFilterFieldVisibility(mode = $("#billing-filter-mode")?.value || "current-month") {
  $$("[data-billing-filter-field]").forEach((field) => {
    field.classList.toggle("is-hidden", field.dataset.billingFilterField !== mode);
  });
}

function renderBilling() {
  updateBillingFilterControls();
  const range = billingFilterRange();
  const billingMonth = range.start.slice(0, 7);
  const appointmentRows = appointments
    .filter((appointment) => byId(services, appointment.serviceId)?.type !== "group")
    .filter((appointment) => normalizeAppointmentStatus(appointment.status) === "confirmed")
    .filter((appointment) => !appointment.patientPackId && !appointment.plannedPatientPackId)
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
  const groupRows = groupBillingRows(billingMonth);
  const packRows = patientPacks
    .filter((pack) => pack.invoice)
    .map((pack) => {
      const rawDate = String(pack.invoiceGeneratedAt || pack.createdAt || "");
      const date = /^\d{4}-\d{2}-\d{2}/.test(rawDate) ? rawDate.slice(0, 10) : todayIso();
      return {
        id: pack.id,
        sortKey: `${date} 00:00`,
        concept: `Bono - ${pack.name} (${pack.sessions} sesiones)`,
        patient: byId(patients, pack.patientId)?.name || "Paciente no encontrado",
        practitioner: packServiceLabel(pack),
        status: pack.invoiceGenerated ? "confirmed" : "pending",
        statusText: pack.invoiceGenerated ? "Facturado" : "Pendiente",
        amount: Number(pack.price || 0),
        paymentStatus: pack.paymentMethod || "",
        paymentText: pack.invoiceGenerated
          ? paymentStatusLabel(pack.paymentMethod || "cash")
          : "Pendiente"
      };
    });
  const manualRows = manualBillingMovements
    .filter((movement) => movement.source !== "group-monthly-fee")
    .map((movement) => {
      const createdTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(String(movement.createdAt || ""))
        ? String(movement.createdAt).slice(11, 16)
        : "23:59";
      return {
        id: movement.id,
        sortKey: `${movement.date || todayIso()} ${createdTime}`,
        concept: movement.concept || (movement.type === "payment" ? "Pago manual" : "Cobro manual"),
        patient: "-",
        practitioner: "Movimiento manual",
        status: movement.type === "payment" ? "cancelled" : "confirmed",
        statusText: movement.type === "payment" ? "Pago" : "Cobro",
        amount: signedManualBillingAmount(movement),
        paymentStatus: movement.paymentMethod || "cash",
        paymentText: `${paymentStatusLabel(movement.paymentMethod || "cash")} - ${movement.type === "payment" ? "Resta" : "Suma"}`,
        manual: true,
        manualId: movement.id
      };
    });
  const allRows = [...appointmentRows, ...groupRows, ...packRows, ...manualRows].filter((row) => billingRowInRange(row, range));
  const paidAppointments = appointmentRows.filter((appointment) => appointment.status === "confirmed" && ["cash", "card"].includes(appointment.paymentStatus));
  const paid = paidAppointments
    .filter((row) => billingRowInRange(row, range))
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "completed" && billingRowInRange(row, range)).reduce((total, row) => total + row.amount, 0)
    + packRows.filter((row) => row.status === "confirmed" && billingRowInRange(row, range)).reduce((total, row) => total + row.amount, 0)
    + manualRows.filter((row) => billingRowInRange(row, range)).reduce((total, row) => total + row.amount, 0);
  const pending = appointmentRows
    .filter((appointment) => appointment.status === "confirmed" && appointment.paymentStatus === "unpaid" && billingRowInRange(appointment, range))
    .reduce((total, appointment) => total + appointment.amount, 0)
    + groupRows.filter((row) => row.status === "pending" && billingRowInRange(row, range)).reduce((total, row) => total + row.amount, 0)
    + packRows.filter((row) => row.status === "pending" && billingRowInRange(row, range)).reduce((total, row) => total + row.amount, 0);
  const lost = 0;
  const cash = paidAppointments
    .filter((appointment) => appointment.paymentStatus === "cash" && billingRowInRange(appointment, range))
    .reduce((total, appointment) => total + appointment.amount, 0)
    + manualRows
      .filter((row) => row.paymentStatus === "cash" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0)
    + groupRows
      .filter((row) => row.status === "completed" && row.paymentStatus === "cash" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0)
    + packRows
      .filter((row) => row.status === "confirmed" && (row.paymentStatus || "cash") === "cash" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0);
  const card = paidAppointments
    .filter((appointment) => appointment.paymentStatus === "card" && billingRowInRange(appointment, range))
    .reduce((total, appointment) => total + appointment.amount, 0)
    + manualRows
      .filter((row) => row.paymentStatus === "card" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0)
    + groupRows
      .filter((row) => row.status === "completed" && row.paymentStatus === "card" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0)
    + packRows
      .filter((row) => row.status === "confirmed" && row.paymentStatus === "card" && billingRowInRange(row, range))
      .reduce((total, row) => total + row.amount, 0);

  $("#billing-paid").textContent = `${paid} EUR`;
  $("#billing-pending").textContent = `${pending} EUR`;
  $("#billing-lost").textContent = `${lost} EUR`;
  $("#billing-cash").textContent = `${cash} EUR`;
  $("#billing-card").textContent = `${card} EUR`;
  const sortedRows = allRows
    .slice()
    .sort((a, b) => (billingFilterState.sort === "asc" ? 1 : -1) * a.sortKey.localeCompare(b.sortKey));
  lastBillingReport = {
    range,
    rows: sortedRows,
    totals: { paid, pending, cash, card, lost },
    sort: billingFilterState.sort || "desc",
    generatedAt: new Date().toISOString()
  };
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  billingFilterState.page = Math.min(Math.max(1, Number(billingFilterState.page || 1)), totalPages);
  saveState("billing-filter-state", billingFilterState);
  const pageRows = sortedRows.slice((billingFilterState.page - 1) * pageSize, billingFilterState.page * pageSize);
  $("#billing-table").innerHTML = pageRows
    .map((row) => `
      <tr>
        <td>${row.concept}</td>
        <td>${row.patient}</td>
        <td>${row.practitioner}</td>
        <td><span class="status-pill ${row.status}">${row.statusText}</span></td>
        <td>${row.paymentText || (row.invoiceGenerated ? "Facturado" : "Pendiente")}</td>
        <td>${row.amount} EUR</td>
        <td>
          ${row.appointmentId ? `<button class="secondary-button row-action" type="button" data-appointment-id="${row.appointmentId}">Abrir</button>` : ""}
          ${row.groupMonthlyKey && !row.collected ? `<button class="secondary-button row-action" type="button" data-collect-group-monthly="${row.groupMonthlyKey}">Cobrar</button>` : ""}
          ${row.manualId ? `
            <details class="item-menu table-item-menu">
              <summary aria-label="Opciones de movimiento">...</summary>
              <div class="item-menu-popover">
                <button type="button" data-edit-manual-billing="${row.manualId}">Editar</button>
                <button class="danger-menu-action" type="button" data-delete-manual-billing="${row.manualId}">Eliminar</button>
              </div>
            </details>
          ` : ""}
        </td>
      </tr>
    `)
    .join("") || `<tr><td colspan="7">No hay movimientos para el filtro seleccionado.</td></tr>`;

  $("#billing-pagination").innerHTML = `
    <span>${sortedRows.length} movimientos · pagina ${billingFilterState.page} de ${totalPages}</span>
    <button class="secondary-button" type="button" data-billing-page="prev" ${billingFilterState.page <= 1 ? "disabled" : ""}>Anterior</button>
    <button class="secondary-button" type="button" data-billing-page="next" ${billingFilterState.page >= totalPages ? "disabled" : ""}>Siguiente</button>
  `;
  $$("[data-billing-page]").forEach((button) => {
    button.addEventListener("click", () => {
      billingFilterState.page += button.dataset.billingPage === "next" ? 1 : -1;
      renderBilling();
    });
  });

  $$(".row-action").forEach((button) => {
    if (button.dataset.appointmentId) {
      button.addEventListener("click", () => openAppointmentDetail(button.dataset.appointmentId));
    }
    if (button.dataset.collectGroupMonthly) {
      button.addEventListener("click", () => openGroupMonthlyPaymentDialog(button.dataset.collectGroupMonthly));
    }
  });
  $$("[data-edit-manual-billing]").forEach((button) => {
    button.addEventListener("click", () => openManualBillingDialog(button.dataset.editManualBilling));
  });
  $$("[data-delete-manual-billing]").forEach((button) => {
    button.addEventListener("click", () => deleteManualBillingMovement(button.dataset.deleteManualBilling));
  });
}

function billingReportRangeLabel(report = lastBillingReport) {
  const range = report?.range || billingFilterRange();
  if (range.start === range.end) {
    return formatShortDate(range.start);
  }
  return `${formatShortDate(range.start)} - ${formatShortDate(range.end)}`;
}

function pdfText(value, maxLength = 120) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function pdfEscape(value) {
  return pdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildSimplePdf(lines) {
  const cleanLines = lines.map((line) => pdfText(line, 132));
  const pages = [];
  const maxLinesPerPage = 48;
  for (let index = 0; index < cleanLines.length; index += maxLinesPerPage) {
    pages.push(cleanLines.slice(index, index + maxLinesPerPage));
  }
  if (!pages.length) {
    pages.push(["Sin movimientos."]);
  }
  const pageIds = pages.map((_, index) => 4 + index * 2);
  const contentIds = pages.map((_, index) => 5 + index * 2);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  pages.forEach((pageLines, index) => {
    const content = [
      "BT",
      "/F1 10 Tf",
      "40 800 Td",
      "14 TL",
      ...pageLines.map((line) => `(${pdfEscape(line)}) Tj T*`),
      "ET"
    ].join("\n");
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentIds[index]} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefAt = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  return pdf;
}

function downloadBlobFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadBillingPdfReport() {
  if (!lastBillingReport) {
    renderBilling();
  }
  const report = lastBillingReport || { rows: [], totals: {}, range: billingFilterRange() };
  const totals = report.totals || {};
  const lines = [
    `Klinia - Informe de facturacion`,
    `Clinica: ${clinic.name || "Clinica"}`,
    `Periodo: ${billingReportRangeLabel(report)}`,
    `Generado: ${new Date().toLocaleString("es-ES")}`,
    `Orden: ${report.sort === "asc" ? "Mas antiguos" : "Mas recientes"}`,
    "",
    `Cobrado: ${Number(totals.paid || 0)} EUR`,
    `Pendiente: ${Number(totals.pending || 0)} EUR`,
    `Efectivo: ${Number(totals.cash || 0)} EUR`,
    `Tarjeta: ${Number(totals.card || 0)} EUR`,
    `Cancelado/no facturable: ${Number(totals.lost || 0)} EUR`,
    "",
    "Movimientos",
    "Fecha hora | Concepto | Paciente | Profesional | Cobro | Importe"
  ];
  if (!report.rows?.length) {
    lines.push("Sin movimientos para el filtro seleccionado.");
  } else {
    report.rows.forEach((row) => {
      lines.push(`${row.sortKey || ""} | ${row.concept || ""} | ${row.patient || ""} | ${row.practitioner || ""} | ${row.paymentText || row.statusText || ""} | ${row.amount || 0} EUR`);
    });
  }
  const pdf = buildSimplePdf(lines);
  const safeRange = `${report.range?.start || todayIso()}_${report.range?.end || report.range?.start || todayIso()}`.replace(/[^0-9_-]/g, "");
  downloadBlobFile(`facturacion-${safeRange}.pdf`, new Blob([pdf], { type: "application/pdf" }));
}

function groupBillingRows(currentMonth = selectedDate.slice(0, 7)) {
  const monthlyRows = groups.flatMap((group) => {
    const pricing = groupPricing(group);
    if (!pricing.monthlyPrice) {
      return [];
    }
    const practitioner = byId(practitioners, group.practitionerId)?.name || "Profesional";
    return groupFixedPatients(group).map((patient) => {
      const key = `group-monthly-${group.id}-${patient.id}-${currentMonth}`;
      const movement = manualBillingMovements.find((item) => item.groupMonthlyKey === key && item.type === "charge");
      return {
        id: key,
        sortKey: `${currentMonth}-01 ${group.start || "00:00"}`,
        concept: `Cuota mensual - ${group.name}`,
        patient: patient.name,
        practitioner,
        status: movement ? "completed" : "pending",
        statusText: movement ? "Cobrada" : "Cuota mensual",
        amount: pricing.monthlyPrice,
        paymentStatus: movement?.paymentMethod || "",
        paymentText: movement ? paymentStatusLabel(movement.paymentMethod || "cash") : "Pendiente",
        groupMonthlyKey: key,
        groupId: group.id,
        patientId: patient.id,
        month: currentMonth,
        collected: Boolean(movement)
      };
    });
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

function openGroupMonthlyPaymentDialog(groupMonthlyKey) {
  const month = String(groupMonthlyKey || "").slice(-7);
  const row = groupBillingRows(/^\d{4}-\d{2}$/.test(month) ? month : billingFilterRange().start.slice(0, 7))
    .find((item) => item.groupMonthlyKey === groupMonthlyKey);
  if (!row || row.collected) {
    showToast("La cuota ya está cobrada o no se ha encontrado.", "warning");
    return;
  }
  const form = $("#manual-billing-form");
  if (!form) return;
  form.reset();
  form.dataset.editingMovementId = "";
  form.dataset.groupMonthlyKey = groupMonthlyKey;
  form.dataset.source = "group-monthly-fee";
  form.elements.type.value = "charge";
  form.elements.type.disabled = true;
  form.elements.date.value = todayIso();
  form.elements.amount.value = Number(row.amount || 0);
  form.elements.concept.value = `${row.concept} - ${row.patient}`;
  $("#manual-billing-title").textContent = "Cobrar cuota grupal";
  $("#manual-billing-submit").textContent = "Guardar cobro";
  $("#manual-billing-error").classList.remove("visible");
  $("#manual-billing-error").textContent = "";
  $("#manual-billing-dialog").showModal();
}

function openManualBillingDialog(movementId = "") {
  const form = $("#manual-billing-form");
  if (!form) return;
  const movement = movementId ? manualBillingMovements.find((item) => String(item.id) === String(movementId)) : null;
  form.reset();
  form.dataset.editingMovementId = movement?.id || "";
  form.dataset.groupMonthlyKey = movement?.groupMonthlyKey || "";
  form.dataset.source = movement?.source || "";
  form.elements.type.disabled = Boolean(movement?.source === "group-monthly-fee");
  form.elements.type.value = movement?.type || "charge";
  form.elements.paymentMethod.value = movement?.paymentMethod || "";
  form.elements.date.value = movement?.date || todayIso();
  form.elements.amount.value = movement ? Number(movement.amount || 0) : "";
  form.elements.concept.value = movement?.concept || "";
  $("#manual-billing-title").textContent = movement ? "Editar pago o cobro" : "Añadir pago o cobro";
  $("#manual-billing-submit").textContent = movement ? "Guardar cambios" : "Guardar movimiento";
  $("#manual-billing-error").classList.remove("visible");
  $("#manual-billing-error").textContent = "";
  $("#manual-billing-dialog").showModal();
}

async function deleteManualBillingMovement(movementId) {
  const movement = manualBillingMovements.find((item) => String(item.id) === String(movementId));
  if (!movement) return;
  const confirmed = await showConfirm({
    title: "Eliminar movimiento",
    message: `Eliminar "${movement.concept}"?`,
    detail: "Se quitará de facturación y no se podrá recuperar.",
    confirmLabel: "Eliminar"
  });
  if (!confirmed) return;
  try {
    await deleteManualBillingMovementFromBackend(movement.id);
  } catch (error) {
    showToast(`No se pudo eliminar el movimiento: ${error.message}`, "error");
    return;
  }
  manualBillingMovements = manualBillingMovements.filter((item) => String(item.id) !== String(movement.id));
  saveClinicState("manual-billing-movements", manualBillingMovements);
  renderBilling();
  showToast("Movimiento eliminado.");
}

function billableAppointments() {
  return appointments.filter(appointmentIsCharged);
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
    targetProgress: Number(practitioner.target) > 0 ? Math.min(100, Math.round((revenue / practitioner.target) * 100)) : 0
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
    `;
    $("#owner-report-table").innerHTML = `<tr><td colspan="4">Sin trabajadores en esta clinica.</td></tr>`;
    return;
  }
  const workerReport = practitionerReport(selectedWorker);
  const allReports = practitioners.map(practitionerReport).sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = allReports.reduce((total, report) => total + report.revenue, 0);
  const totalAppointments = allReports.reduce((total, report) => total + report.appointments.length + (report.groupSessions?.length || 0), 0);
  const topReport = allReports[0];
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
    <article><span>Servicios con comisión</span><strong>${Object.values(selectedWorker.serviceCommissions || {}).filter((item) => item?.enabled).length}</strong></article>
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
  `;

  $("#owner-report-table").innerHTML = allReports.length
    ? allReports.map((report) => `
      <tr>
        <td><strong>${report.practitioner.name}</strong><br><span>${report.practitioner.specialty}</span></td>
        <td>${report.appointments.length + (report.groupSessions?.length || 0)}</td>
        <td>${report.revenue} EUR</td>
        <td>${report.averageTicket} EUR</td>
      </tr>
    `)
    .join("")
    : `<tr><td colspan="4">Sin trabajadores en esta clinica.</td></tr>`;
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
  const template = String(reminderSettings?.reminderMessageTemplate || defaultReminderSettings().reminderMessageTemplate);
  return template
    .replaceAll("{{paciente}}", patient?.name || "paciente")
    .replaceAll("{{nombre_paciente}}", patient?.name || "paciente")
    .replaceAll("{{fecha}}", reminder.date || "")
    .replaceAll("{{hora}}", reminder.start || "")
    .replaceAll("{{clinica}}", clinic?.name || "la clínica")
    .replaceAll("{{profesional}}", practitioner?.name || "tu profesional")
    .replaceAll("{{servicio}}", service?.name || "servicio");
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
  saveSyncedClinicState("reminder-actions", reminderActions);
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
      saveSyncedClinicState("reminder-actions", reminderActions);
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
  $("#reminders-mode-label").textContent = "Manual";
  $("#metric-reminders").textContent = metricCount;
  $("#metric-reminders-label").textContent = metricLabel;
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

}

function renderMetrics() {
  const visible = visibleAppointments();
  const revenueAppointments = visible.filter(appointmentIsCharged);
  const revenue = revenueAppointments.reduce((total, item) => total + appointmentRevenueAmount(item), 0);
  const occupancy = occupancyReportForRange(calendarRange());
  $("#metric-appointments").textContent = visible.length;
  if ($("#metric-occupancy")) {
    $("#metric-occupancy").textContent = `${occupancy.percent}%`;
  }
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
    const account = currentClinicAccount();
    if (backendTokenForAccount(account) && account.stripeCustomerId) {
      try {
        const session = await backendRequest("/billing/portal-session", {
          method: "POST",
          account,
          body: JSON.stringify({})
        });
        if (session?.url && session.demo_mode === false) {
          window.location.href = session.url;
          return;
        }
      } catch (error) {
        $("#saas-save-status").textContent = `No se pudo abrir el portal de pagos: ${error.message}`;
        return;
      }
    }
    const confirmed = await showConfirm({
      title: "Cancelar suscripcion",
      message: "Quieres marcar esta prueba o suscripcion local como cancelada?",
      detail: "Las suscripciones reales con Stripe se cancelan desde el portal de pagos. Esta accion solo afecta a cuentas sin cliente Stripe conectado.",
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
      saveSyncedClinicState("clinic-logo", clinicLogo);
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
    activeClinicKey = loadState("active-clinic-key", activeClinicKey);
    clinicAccounts = normalizeClinicAccounts(loadState("clinic-accounts", clinicAccounts));
    const syncedBackendBlobs = await syncImportedClinicDataBlobsToBackend().catch((error) => {
      console.warn("La copia se importo localmente, pero no se pudo sincronizar con backend", error);
      return { synced: 0, skipped: error.message };
    });
    appendAuditLog("import-backup", {
      keys: pendingImportAnalysis.totalKeys,
      clinicCount: pendingImportAnalysis.clinicCount,
      conflicts: pendingImportAnalysis.conflicts,
      backendBlobsSynced: syncedBackendBlobs.synced || 0
    });
    $("#import-preview-dialog")?.close();
    await showNotice(
      "Copia importada",
      syncedBackendBlobs.synced
        ? `La importación se ha completado y ${syncedBackendBlobs.synced} colecciones compartidas se han sincronizado con backend. La aplicación se recargará ahora.`
        : "La importación se ha completado con trazabilidad. Si la clínica usa backend y hay datos maestros importados, revisa la sincronización desde soporte antes de usarla en otro dispositivo.",
      { variant: "success" }
    );
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
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%*"];
  const alphabet = groups.join("");
  const bytes = new Uint8Array(12);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 255);
    });
  }
  const required = groups.map((group, index) => group[bytes[index] % group.length]);
  const rest = [...bytes.slice(required.length)].map((byte) => alphabet[byte % alphabet.length]);
  const raw = [...required, ...rest].sort(() => Math.random() - 0.5).join("");
  return `${raw.slice(0, 6)}-${raw.slice(6)}`;
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
  const localItems = accessRecoveryRequests
    .filter((request) => request.clinicKey === activeClinicKey && request.status !== "resolved")
    .map((request) => ({ ...request, source: "local" }));
  const backendItems = backendAccessRecoveryRequests
    .filter((request) => request.status !== "resolved")
    .map((request) => ({
      id: request.id,
      email: request.user_email || "",
      clinicKey: activeClinicKey,
      clinicName: clinic.name,
      profile: request.user_id || "backend",
      label: "Usuario backend",
      requestedAt: request.requested_at,
      status: request.status,
      source: "backend"
    }));
  return [...backendItems, ...localItems]
    .sort((a, b) => String(b.requestedAt || "").localeCompare(String(a.requestedAt || "")));
}

let accessRecoveryBackendSyncKey = "";

function syncBackendAccessRecoveryRequests() {
  const account = currentClinicAccount();
  if (!backendTokenForAccount(account) || !isOwner()) {
    backendAccessRecoveryRequests = [];
    return;
  }
  const syncKey = `${account.key}:${account.backendToken || ""}`;
  if (accessRecoveryBackendSyncKey === syncKey) {
    return;
  }
  accessRecoveryBackendSyncKey = syncKey;
  backendRequest("/access-recovery-requests", { account })
    .then((items) => {
      backendAccessRecoveryRequests = Array.isArray(items) ? items : [];
      renderAccessRecoveryRequests();
    })
    .catch(() => {
      backendAccessRecoveryRequests = [];
      renderAccessRecoveryRequests();
    });
}

function renderAccessRecoveryRequests() {
  const list = $("#access-recovery-requests");
  if (!list) {
    return;
  }
  syncBackendAccessRecoveryRequests();
  const requests = accessRecoveryRequestsForActiveClinic();
  list.innerHTML = requests.length
    ? requests.map((request) => `
      <article class="compact-item action-card access-recovery-card">
        <div>
          <strong>${escapeHtml(accessRecoveryLabel(request))}${request.source === "backend" ? " · backend" : ""}</strong>
          <span>${escapeHtml(request.email)} - solicitado ${new Date(request.requestedAt).toLocaleString("es-ES")}</span>
        </div>
        <div class="compact-actions">
          <button class="secondary-button compact-inline-button" type="button" ${request.source === "backend" ? `data-resolve-backend-access-request="${request.id}"` : `data-resolve-access-request="${request.id}"`}>Generar nueva clave</button>
          ${request.source === "local" ? `<button class="secondary-button compact-inline-button" type="button" data-dismiss-access-request="${request.id}">Cerrar</button>` : ""}
        </div>
      </article>
    `).join("")
    : `<article class="compact-item"><span>Sin solicitudes de recuperacion de clave pendientes.</span></article>`;

  $$("[data-resolve-backend-access-request]").forEach((button) => {
    button.addEventListener("click", () => resolveBackendAccessRecoveryRequest(button.dataset.resolveBackendAccessRequest));
  });
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

async function resolveBackendAccessRecoveryRequest(requestId) {
  const request = backendAccessRecoveryRequests.find((item) => item.id === requestId);
  if (!request) return;
  const confirmed = await showConfirm({
    eyebrow: "Recuperacion de acceso",
    title: "Generar clave temporal",
    message: `Vas a generar una clave temporal para ${request.user_email}.`,
    detail: "La clave actual dejara de funcionar, el usuario debera cambiarla al entrar y la accion quedara auditada.",
    confirmLabel: "Generar clave",
    variant: "primary"
  });
  if (!confirmed) return;
  try {
    const result = await backendRequest(`/access-recovery-requests/${encodeURIComponent(request.id)}/resolve`, {
      method: "POST",
      account: currentClinicAccount()
    });
    accessRecoveryBackendSyncKey = "";
    backendAccessRecoveryRequests = backendAccessRecoveryRequests.map((item) => (
      item.id === request.id ? { ...item, status: "resolved" } : item
    ));
    renderAccessRecoveryRequests();
    await showNotice(
      "Clave temporal generada",
      `Nueva clave para ${request.user_email}: ${result.temporary_password}. Entrégala por un canal seguro.`,
      { variant: "success" }
    );
  } catch (error) {
    await showNotice("No se pudo generar la clave", error.message, { variant: "danger" });
  }
}

async function resetPractitionerAccessKey(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  if (!practitioner || !canManageClinic()) {
    return;
  }
  const nextKey = generateAccessKey();
  let backendNotice = "";
  if (backendDataEnabled() && (practitioner.backendUserId || practitioner.userId)) {
    try {
      const result = await backendRequest(`/users/${encodeURIComponent(practitioner.backendUserId || practitioner.userId)}/reset-password`, {
        method: "POST",
        account: currentClinicAccount()
      });
      if (result?.temporary_password) {
        backendNotice = " Clave backend temporal generada y cambio obligatorio activado.";
        practitioners = practitioners.map((item) => (
          item.id === practitioner.id ? { ...item, password: result.temporary_password } : item
        ));
        saveClinicState("practitioners", practitioners);
        renderLoginProfiles();
        renderSettings();
        await showNotice(
          "Clave generada",
          `Nueva clave temporal para ${practitioner.name}: ${result.temporary_password}. Entrégala de forma segura.`,
          { variant: "success" }
        );
        return;
      }
    } catch (error) {
      backendNotice = ` No se pudo resetear en backend: ${error.message}.`;
    }
  }
  practitioners = practitioners.map((item) => (
    item.id === practitioner.id ? { ...item, password: nextKey } : item
  ));
  saveClinicState("practitioners", practitioners);
  if (backendDataEnabled() && practitioner.email && !(practitioner.backendUserId || practitioner.userId)) {
    try {
      const backendUser = await createBackendUserIfAvailable({
        name: practitioner.name,
        email: practitioner.email,
        password: nextKey,
        role: "practitioner",
        active: true,
        practitioner_id: practitioner.id
      });
      if (backendUser?.id) {
        practitioners = practitioners.map((item) => item.id === practitioner.id ? { ...item, backendUserId: backendUser.id, userId: backendUser.id } : item);
        saveClinicState("practitioners", practitioners);
        backendNotice = " Usuario backend creado.";
      }
    } catch (error) {
      backendNotice = ` No se pudo crear usuario backend: ${error.message}.`;
    }
  }
  renderLoginProfiles();
  renderSettings();
  await showNotice(
    "Clave generada",
    `Nueva clave para ${practitioner.name}: ${nextKey}.${practitioner.email ? "" : " Añade un email de acceso para que pueda iniciar sesion."}${backendNotice}`,
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
  list.innerHTML = [
    permissionRowHtml("staff", "Recepcion / administracion", permissionSettings.staff),
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

async function hydrateFromApi(options = {}) {
  if (!backendDataEnabled()) {
    return false;
  }

  try {
    let [apiMe, apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments, apiManualMovements, apiAttendanceRecords] = await Promise.all([
      backendRequest("/me"),
      backendRequest("/patients"),
      backendRequest("/practitioners"),
      backendRequest("/rooms"),
      backendRequest("/services"),
      backendRequest("/appointments"),
      backendOptionalCollection("/manual-billing-movements"),
      backendOptionalCollection("/attendance-records")
    ]);
    applyBackendClinicSnapshot(apiMe?.clinic);
    ({ apiPatients, apiPractitioners, apiRooms, apiServices, apiAppointments } = await bootstrapBackendDataIfNeeded({
      apiPatients,
      apiPractitioners,
      apiRooms,
      apiServices,
      apiAppointments
    }));
    if (!apiManualMovements.length && manualBillingMovements.length) {
      apiManualMovements = await Promise.all(manualBillingMovements.map((item) => saveManualBillingMovementToBackend(item)));
    }
    patients = apiPatients.map((patient) => apiPatientToUi(patient, byId(patients, patient.id)));
    practitioners = normalizePractitioners(apiPractitioners.map((practitioner) => apiPractitionerToUi(practitioner, byId(practitioners, practitioner.id))));
    rooms = apiRooms.map((room) => apiRoomToUi(room));
    services = normalizeServices(apiServices.map((service) => apiServiceToUi(service)));
    appointments = normalizeAppointments(apiAppointments.map((appointment) => apiAppointmentToUi(appointment, byId(appointments, appointment.id))));
    manualBillingMovements = apiManualMovements.map(apiManualBillingMovementToUi);
    attendanceRecords = apiAttendanceRecords.map(apiAttendanceRecordToUi);
    groups = normalizeGroups(await syncClinicDataCollection("groups", groups, [], normalizeGroups));
    clinicalNotes = await syncClinicDataCollection("clinical-notes", clinicalNotes, [], (value) => Array.isArray(value) ? value : []);
    groupDropIns = await syncClinicDataCollection("group-dropins", groupDropIns, [], (value) => Array.isArray(value) ? value : []);
    groupCompletions = await syncClinicDataCollection("group-completions", groupCompletions, [], (value) => Array.isArray(value) ? value : []);
    groupSessionOverrides = await syncClinicDataCollection("group-session-overrides", groupSessionOverrides, [], normalizeGroupSessionOverrides);
    sessionPacks = normalizeSessionPacks(await syncClinicDataCollection("session-packs", sessionPacks, [], normalizeSessionPacks));
    patientPacks = normalizePatientPacks(await syncClinicDataCollection("patient-packs", patientPacks, [], normalizePatientPacks));
    consentTemplates = await syncClinicDataCollection("consent-templates", consentTemplates, [], (value) => Array.isArray(value) ? value : []);
    patientConsents = await syncClinicDataCollection("patient-consents", patientConsents, [], (value) => Array.isArray(value) ? value : []);
    reminderActions = await syncClinicDataCollection("reminder-actions", reminderActions, [], (value) => Array.isArray(value) ? value : []);
    reminderSettings = {
      ...defaultReminderSettings(),
      ...(await syncClinicDataCollection("reminder-settings", reminderSettings, defaultReminderSettings(), (value) => value && typeof value === "object" && !Array.isArray(value) ? value : defaultReminderSettings()))
    };
    permissionSettings = normalizePermissionSettings(await syncClinicDataCollection("permissions", permissionSettings, defaultPermissionSettings, normalizePermissionSettings));
    availabilityBlocks = await syncClinicDataCollection("availability-blocks", availabilityBlocks, [], (value) => Array.isArray(value) ? value : []);
    clinicLogo = await syncClinicDataCollection("clinic-logo", clinicLogo, "", (value) => typeof value === "string" ? value : "");
    syncPatientPackUsageFromAppointments({ persist: true });
    selectedPatientId = patients.some((patient) => String(patient.id) === String(selectedPatientId))
      ? selectedPatientId
      : patients[0]?.id || null;
    saveClinicState("patients", patients);
    saveClinicState("practitioners", practitioners);
    saveClinicState("rooms", rooms);
    saveClinicState("services", services);
    saveClinicState("appointments", appointments);
    saveClinicState("clinical-notes", clinicalNotes);
    saveClinicState("manual-billing-movements", manualBillingMovements);
    saveClinicState("attendance-records", attendanceRecords);
    saveClinicState("groups", groups);
    saveClinicState("group-dropins", groupDropIns);
    saveSyncedClinicState("group-completions", groupCompletions);
    saveClinicState("group-session-overrides", groupSessionOverrides);
    saveClinicState("session-packs", sessionPacks);
    saveSyncedClinicState("patient-packs", patientPacks);
    saveClinicState("consent-templates", consentTemplates);
    saveClinicState("patient-consents", patientConsents);
    saveClinicState("reminder-actions", reminderActions);
    saveClinicState("reminder-settings", reminderSettings);
    saveClinicState("permissions", permissionSettings);
    saveSyncedClinicState("availability-blocks", availabilityBlocks);
    saveClinicState("clinic-logo", clinicLogo);
    backendLastSyncAt = Date.now();
    if (options.render !== false) {
      renderAppointmentFormOptions();
      renderLoginProfiles();
      renderAll();
    }
    return true;
  } catch (error) {
    console.warn("Klinia backend data unavailable, keeping local cache.", error);
    if (!options.silent) {
      showToast(`No se pudo sincronizar datos con backend: ${error.message}`, "warning");
    }
    return false;
  }
}

function shouldAutoSyncBackend(options = {}) {
  if (!isAuthenticated || isDemoClinic() || !backendDataEnabled()) {
    return false;
  }
  if (options.force) {
    return true;
  }
  if (document.querySelector("dialog[open]")) {
    return false;
  }
  return true;
}

async function syncCurrentClinicFromBackend(options = {}) {
  if (!shouldAutoSyncBackend(options) || backendAutoSyncInProgress) {
    return false;
  }
  const minInterval = Number(options.minIntervalMs ?? backendAutoSyncMinIntervalMs);
  if (!options.force && Date.now() - backendLastSyncAt < minInterval) {
    return false;
  }
  backendAutoSyncInProgress = true;
  try {
    return await hydrateFromApi({ silent: true });
  } finally {
    backendAutoSyncInProgress = false;
  }
}

function stopBackendAutoSync() {
  if (backendAutoSyncTimer) {
    window.clearInterval(backendAutoSyncTimer);
    backendAutoSyncTimer = null;
  }
}

function startBackendAutoSync() {
  stopBackendAutoSync();
  if (!shouldAutoSyncBackend({ force: true })) {
    return;
  }
  backendAutoSyncTimer = window.setInterval(() => {
    syncCurrentClinicFromBackend({ silent: true });
  }, backendAutoSyncIntervalMs);
}

function setupBackendAutoSyncTriggers() {
  window.addEventListener("focus", () => {
    syncCurrentClinicFromBackend({ minIntervalMs: 3000 });
  });
  window.addEventListener("online", () => {
    syncCurrentClinicFromBackend({ force: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      syncCurrentClinicFromBackend({ minIntervalMs: 3000 });
    }
  });
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
    input.disabled = false;
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
    if (!selectedPractitionerIds.length) {
      selectedPractitionerIds = ["all"];
      saveState("selected-practitioner-ids", selectedPractitionerIds);
    }
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
  startBackendAutoSync();
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
  hydrateFromApi({ silent: true });
}

function clearAuthenticatedSessionForBackend(message = "") {
  stopBackendAutoSync();
  isAuthenticated = false;
  saveState("authenticated", false);
  saveState("authenticated-at", 0);
  applyLoginState();
  showPublicView("login", { updateHash: true, resetLogin: true });
  showClinicLoginStep({ skipPublicView: true, allowSavedCredentials: false });
  if (message) {
    showLoginError(message, $("#login-form")?.elements?.center || null);
  }
}

async function restoreAuthenticatedSessionOnLoad() {
  if (!isAuthenticated) {
    stopBackendAutoSync();
    setActiveSection("agenda", false);
    return;
  }

  const account = currentClinicAccount();
  if (backendAuthoritativeMode(account) && !backendTokenForAccount(account)) {
    clearAuthenticatedSessionForBackend("La sesion guardada no esta enlazada al backend. Inicia sesion de nuevo.");
    return;
  }

  setEntrySection(true);

  if (!backendAuthoritativeMode(account)) {
    startBackendAutoSync();
    hydrateFromApi({ silent: true });
    return;
  }

  try {
    await backendRequest("/me", { account });
    startBackendAutoSync();
    await hydrateFromApi({ silent: true });
  } catch (error) {
    if ([401, 403].includes(error.status)) {
      clearAuthenticatedSessionForBackend("Tu sesion ha caducado. Inicia sesion de nuevo para cargar los datos reales.");
      return;
    }
    showToast(`No se pudo sincronizar con backend: ${error.message}`, "warning");
  }
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

function registerPasswordPolicyMessage(password) {
  const value = String(password || "");
  if (value.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[A-ZÁÉÍÓÚÜÑ]/.test(value)) {
    return "La contraseña debe incluir al menos una mayúscula.";
  }
  if (!/[a-záéíóúüñ]/.test(value)) {
    return "La contraseña debe incluir al menos una minúscula.";
  }
  if (!/[0-9\W_]/.test(value)) {
    return "La contraseña debe incluir al menos un número o símbolo.";
  }
  return "";
}

function registerBackendErrorMessage(error) {
  const detail = String(error?.message || "").toLowerCase();
  if (error?.status === 409) {
    return "Ya existe una clínica con ese email o NIF/CIF en el backend. Si acabas de crearla, entra con el email y contraseña que has elegido.";
  }
  if (detail.includes("password")) {
    return "La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula y un número o símbolo.";
  }
  if (error?.network || String(error?.message || "").toLowerCase().includes("failed to fetch")) {
    return "No se ha podido crear la clínica en el backend: no hay conexión con la API de Klinia. Revisa la conexión y vuelve a intentarlo.";
  }
  return `No se ha podido crear la clínica en el backend. Comprueba conexión/API y vuelve a intentarlo. Detalle: ${error?.message || "error desconocido"}`;
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
  const name = registerFieldValue("name", "Clínica Fisio Salud");
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
  delete form.dataset.registerSubmitting;
  setRegisterSubmitting(false);
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
    if (step === "account" && field.name === "password" && field.value) {
      field.setCustomValidity(registerPasswordPolicyMessage(field.value));
    }
    if (!field.checkValidity()) {
      const label = registerFieldLabel(field);
      const message = field.validity.valueMissing
        ? `Completa "${label}" antes de continuar.`
        : (field.validity.customError ? field.validationMessage : `Revisa "${label}" antes de continuar.`);
      showRegisterError(message, field);
      return false;
    }
    if (["email", "clinicEmail"].includes(field.name) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      showRegisterError(`Escribe un email valido en "${registerFieldLabel(field)}".`, field);
      return false;
    }
  }
  if (step === "account" && form.elements.password.value !== form.elements.confirmPassword.value) {
    showRegisterError("Las contraseñas no coinciden.", form.elements.confirmPassword);
    return false;
  }
  if (step === "operations" && !$$("#register-form input[name='days']:checked").length) {
    showRegisterError("Selecciona al menos un día de atención.");
    return false;
  }
  if (step === "operations") {
    const openingStart = form.elements.openingStart?.value || "";
    const openingEnd = form.elements.openingEnd?.value || "";
    if (isValidTimeValue(openingStart) && isValidTimeValue(openingEnd) && minutes(openingStart) >= minutes(openingEnd)) {
      showRegisterError("El horario de apertura debe ser anterior al horario de cierre.", form.elements.openingEnd);
      return false;
    }
  }
  syncRegisterDraftFromForm();
  clearRegisterError();
  return true;
}

function setRegisterSubmitting(isSubmitting) {
  const submitButton = $("#register-submit-button");
  const backButton = $("#register-back-button");
  if (submitButton) {
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Creando clínica..." : "Confirmar y crear clínica";
  }
  if (backButton) {
    backButton.disabled = isSubmitting;
  }
}

async function recoverRegisterSessionAfterDuplicate(form, account) {
  const ownerEmail = form.elements.email?.value.trim() || "";
  const password = form.elements.password?.value || "";
  if (!ownerEmail || !password) {
    return null;
  }
  try {
    const session = await backendRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: ownerEmail,
        password,
        clinic_email: form.elements.clinicEmail?.value.trim() || account.email || ownerEmail
      })
    });
    const me = await backendRequest("/me", { token: session.access_token, auth: false });
    if (!me?.clinic || !me?.user || me.user.role === "superadmin") {
      return null;
    }
    const backendClinicId = session.clinic_id || me.clinic.id || "";
    const existingLocal = clinicAccounts.find((item) => (
      (backendClinicId && item.backendClinicId === backendClinicId)
      || (ownerEmail && String(item.ownerEmail || item.email || "").trim().toLowerCase() === ownerEmail.toLowerCase())
    ));
    const key = existingLocal?.key || account.key || slugifyClinicName(me.clinic.name || backendClinicId || account.name);
    return {
      session,
      me,
      account: {
        ...(existingLocal || {}),
        ...account,
        key,
        name: me.clinic.name || account.name,
        email: me.clinic.email || account.email,
        backendToken: session.access_token,
        backendClinicId,
        subscriptionStatus: session.subscription_status || me.clinic.subscription_status || account.subscriptionStatus,
        billingStatus: session.subscription_status || me.clinic.subscription_status || account.billingStatus,
        openingStart: me.clinic.opening_start || account.openingStart || "09:00",
        openingEnd: me.clinic.opening_end || account.openingEnd || "20:00",
        workingDays: normalizeWorkingDays(me.clinic.working_days || account.workingDays),
        billingProfile: {
          ...(existingLocal?.billingProfile || account.billingProfile || {}),
          billingName: me.clinic.billing_name || account.billingProfile?.billingName || me.clinic.name || account.name,
          billingEmail: me.clinic.billing_email || account.billingProfile?.billingEmail || me.clinic.email || account.email,
          taxId: me.clinic.tax_id || account.billingProfile?.taxId || "",
          billingAddress: me.clinic.billing_address || account.billingProfile?.billingAddress || ""
        }
      }
    };
  } catch {
    return null;
  }
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

function resetDemoClinicData() {
  deleteClinicStorage(demoClinicKey);
  activeClinicKey = demoClinicKey;
  saveState("active-clinic-key", demoClinicKey);
  const seed = Date.now();
  const startOptions = ["08:00", "09:00", "10:00", "11:00", "12:00", "16:00", "17:00"];
  const practitionerOptions = defaultPractitioners.map((item) => item.id);
  const randomizedAppointments = defaultAppointments.map((appointment, index) => ({
    ...appointment,
    id: `demo-${seed}-${index + 1}`,
    date: addDaysIso(todayIso(), (index + seed) % 5),
    start: startOptions[(index + seed) % startOptions.length],
    practitionerId: practitionerOptions[(index + seed) % practitionerOptions.length],
    paymentStatus: index % 3 === 0 ? "cash" : (index % 3 === 1 ? "card" : "unpaid"),
    paymentMethod: index % 3 === 0 ? "cash" : (index % 3 === 1 ? "card" : "unpaid")
  }));
  saveClinicState("clinic", { ...defaultClinic, demoSessionStartedAt: new Date().toISOString() });
  saveClinicState("patients", defaultPatients);
  saveClinicState("appointments", randomizedAppointments);
  saveClinicState("clinical-notes", defaultClinicalNotes);
  saveClinicState("services", defaultServices);
  saveClinicState("practitioners", defaultPractitioners);
  saveClinicState("rooms", defaultRooms);
  saveClinicState("groups", defaultGroups);
  saveClinicState("availability-blocks", defaultAvailabilityBlocks);
  saveClinicState("manual-billing-movements", []);
  saveClinicState("attendance-records", []);
  saveClinicState("patient-packs", []);
}

async function requestDemoSession() {
  const clientId = loadState("demo-client-id", "");
  try {
    const session = await backendRequest("/demo/session", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ client_id: clientId || undefined })
    });
    if (session?.client_id) {
      saveState("demo-client-id", session.client_id);
      saveState("demo-expires-at", session.expires_at || "");
    }
    return session;
  } catch (error) {
    if (backendRequiredForProduction()) {
      throw error;
    }
    return null;
  }
}

async function enterDemoClinic() {
  try {
    await requestDemoSession();
  } catch (error) {
    setInlineError("#demo-login-error", error.status === 429
      ? "Has usado la demo varias veces hoy. Para seguir, crea una prueba gratuita o accede con tu clinica."
      : `No se pudo iniciar la demo: ${error.message}`);
    return;
  }
  setInlineError("#demo-login-error");
  resetDemoClinicData();
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
  $("#demo-login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await enterDemoClinic();
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
    const localQueued = createAccessRecoveryRequest(email);
    await backendRequest("/auth/recovery-request", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email })
    }).catch(() => null);
    $("#access-recovery-dialog")?.close();
    await showNotice(
      "Solicitud enviada",
      localQueued
        ? "Si el email existe en una clinica, direccion vera la solicitud en Configuracion > Trabajadores y podra generar una clave nueva."
        : "Si el email existe en backend, direccion o soporte podran revisar la solicitud y generar una clave nueva.",
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
    const password = form.elements.password.value.trim();
    if (!identifier || !password) {
      showLoginError("Escribe usuario y contraseña para entrar.", !identifier ? form.elements.center : form.elements.password);
      return;
    }
    const backendFirst = await tryBackendLogin(identifier, password);
    if (backendFirst.handled) {
      persistLoginCredentials(form, identifier, password);
      return;
    }
    if (backendFirst.error && !canFallbackToLocalLogin(backendFirst.error, identifier)) {
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

  $("#profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setInlineError("#profile-login-error");
    form.elements.password.removeAttribute("aria-invalid");
    const account = clinicAccountByKey(pendingClinicKey || demoClinicKey);
    const profile = form.elements.profile.value;
    const loginPractitioners = normalizePractitioners(loadClinicStateFor(account.key, "practitioners", account.key === demoClinicKey ? defaultPractitioners : []));
    const practitioner = byId(loginPractitioners, profile);
    const identity = profileLoginIdentity(account, profile, practitioner);
    const typedPassword = form.elements.password.value.trim();
    if (identity.email && typedPassword) {
      const backendProfileLogin = await tryBackendLogin(identity.email, typedPassword, { account });
      if (backendProfileLogin.handled) {
        return;
      }
      if (backendProfileLogin.error && !canFallbackToLocalLogin(backendProfileLogin.error, identity.email)) {
        showProfileLoginError(backendLoginMessage(backendProfileLogin.error), form.elements.password);
        return;
      }
    }
    if (backendAuthoritativeMode(account)) {
      showProfileLoginError("Este perfil debe entrar con un usuario backend valido. Revisa el acceso desde Direccion o Superadmin.", form.elements.password);
      return;
    }
    if (!identity.password) {
      showProfileLoginError(identity.email
        ? "Este perfil existe, pero no tiene clave local. Si se creo en backend, entra con su email directamente."
        : "Este perfil no tiene email ni contraseña propia configurada.", form.elements.password);
      return;
    }
    if (typedPassword !== identity.password) {
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
    if (form.dataset.registerSubmitting === "true") {
      return;
    }
    form.dataset.registerSubmitting = "true";
    setRegisterSubmitting(true);
    const name = form.elements.name.value.trim();
    const baseKey = slugifyClinicName(name);
    const clinicEmail = form.elements.clinicEmail?.value.trim() || form.elements.email?.value.trim() || "";
    const taxId = form.elements.taxId?.value.trim() || "";
    const duplicateAccount = clinicAccounts.find((account) => {
      const sameClinicEmail = clinicEmail && String(account.email || account.billingProfile?.billingEmail || "").trim().toLowerCase() === clinicEmail.toLowerCase();
      const sameOwnerEmail = form.elements.email?.value.trim() && String(account.ownerEmail || account.email || "").trim().toLowerCase() === form.elements.email.value.trim().toLowerCase();
      const sameTaxId = taxId && String(account.billingProfile?.taxId || account.taxId || "").trim().toLowerCase() === taxId.toLowerCase();
      return sameTaxId || sameClinicEmail || sameOwnerEmail;
    });
    if (duplicateAccount && !backendRequiredForProduction()) {
      const sameTaxId = taxId && String(duplicateAccount.billingProfile?.taxId || duplicateAccount.taxId || "").trim().toLowerCase() === taxId.toLowerCase();
      const sameEmail = clinicEmail && String(duplicateAccount.email || duplicateAccount.billingProfile?.billingEmail || "").trim().toLowerCase() === clinicEmail.toLowerCase();
      $("#register-error").textContent = sameTaxId
        ? "Ya existe una clínica con ese NIF/CIF. Revisa el dato o entra desde el selector de clínicas."
        : sameEmail
          ? "Ya existe una clínica con ese email. Revisa el dato o entra desde Login."
          : "Ya existe un usuario con ese email. Usa otro email o entra desde Login.";
      $("#register-error").classList.add("visible");
      delete form.dataset.registerSubmitting;
      setRegisterSubmitting(false);
      return;
    }
    let key = baseKey;
    if (clinicAccounts.some((account) => account.key === key)) {
      key = `${baseKey}-${Date.now().toString(36)}`;
    }

    const paymentPlan = form.elements.paymentPlan?.value || "trial";
    const clinicPhone = form.elements.clinicPhone?.value.trim() || form.elements.phone?.value.trim() || "";
    const registerWorkingDays = $$("#register-form input[name='days']:checked").map((item) => normalizeWorkingDayKey(item.value)).filter(Boolean);
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
      billingProfile,
      openingStart: form.elements.openingStart?.value || "09:00",
      openingEnd: form.elements.openingEnd?.value || "20:00",
      workingDays: registerWorkingDays
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
          billing_address: billingProfile.billingAddress,
          opening_start: form.elements.openingStart?.value || "09:00",
          opening_end: form.elements.openingEnd?.value || "20:00",
          working_days: registerWorkingDays
        })
      });
      account.backendToken = backendSession.access_token || "";
      account.backendClinicId = backendSession.clinic_id || "";
      account.subscriptionStatus = backendSession.subscription_status || account.subscriptionStatus;
      account.billingStatus = backendSession.subscription_status || account.billingStatus;
      account.checkoutUrl = backendSession.checkout_url || account.checkoutUrl;
    } catch (error) {
      const recovered = (error.status === 409 || error.network || error.timeout)
        ? await recoverRegisterSessionAfterDuplicate(form, account)
        : null;
      if (recovered?.account) {
        Object.assign(account, recovered.account);
        backendSession = recovered.session;
      } else if (error.status === 409 || backendRequiredForProduction()) {
        setRegisterStep("confirm");
        $("#register-error").textContent = registerBackendErrorMessage(error);
        $("#register-error").classList.add("visible");
        delete form.dataset.registerSubmitting;
        setRegisterSubmitting(false);
        return;
      }
    }
    try {
      ensureClinicAccount(account);
      const createdAccount = clinicAccountByKey(account.key) || account;

      activeClinicKey = account.key;
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
        country: form.elements.country?.value || "España",
        specialty: form.elements.specialty?.value || "",
        clinicType: form.elements.clinicType?.value || "",
        professionalsCount: form.elements.professionalsCount?.value || "",
        website: form.elements.website?.value.trim() || "",
        instagram: form.elements.instagram?.value.trim() || "",
        facebook: form.elements.facebook?.value.trim() || "",
        openingStart: form.elements.openingStart?.value || "09:00",
        openingEnd: form.elements.openingEnd?.value || "20:00",
        timezone: form.elements.timezone?.value || "(GMT+01:00) Madrid",
        workingDays: registerWorkingDays
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
      saveClinicState("reminder-settings", defaultReminderSettings());
      saveClinicState("manual-billing-movements", []);

      registerCreatedAccount = createdAccount;
      setRegisterStep("success");
      showToast("Clínica creada. Ya puedes iniciar sesión.");

      loadActiveClinicData(account.key).catch((error) => {
        console.warn("No se pudo hidratar la clínica recién creada", error);
      });
      renderLoginClinics();
      $("#login-clinic-select").value = account.name;
      renderLoginProfiles();
      $("#login-form").elements.password.value = "";
      $("#profile-form").elements.password.value = "";
      updateRegisterPlanChoice();
    } catch (localError) {
      console.error("La clínica se creó, pero falló la preparación local", localError);
      registerCreatedAccount = account;
      setRegisterStep("success");
      $("#register-error").textContent = "La clínica se ha creado correctamente. Si algún dato local tarda en aparecer, entra desde Login para cargarla desde backend.";
      $("#register-error").classList.add("visible");
    } finally {
      delete form.dataset.registerSubmitting;
      setRegisterSubmitting(false);
    }
  });

  $("#logout-button").addEventListener("click", () => {
    stopBackendAutoSync();
    isAuthenticated = false;
    saveState("authenticated", false);
    saveState("authenticated-at", 0);
    applyLoginState();
    showPublicView("landing", { updateHash: true });
    showClinicLoginStep({ skipPublicView: true });
  });

  $("#change-password-button")?.addEventListener("click", () => openChangePasswordDialog());
  $("#change-password-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitPasswordChange(event.currentTarget);
  });
  $("#change-password-dialog")?.addEventListener("cancel", (event) => {
    if (event.currentTarget.dataset.forcePasswordChange === "true") {
      event.preventDefault();
      setInlineError("#change-password-error", "Debes cambiar la clave temporal antes de continuar.");
    }
  });

  $("#superadmin-filter-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadSuperadminPanel({ feedback: "Filtros aplicados.", loadingLabel: "Filtrando..." });
  });
  $("#superadmin-refresh-button")?.addEventListener("click", () => loadSuperadminPanel({ feedback: "Panel actualizado.", loadingLabel: "Actualizando..." }));
  $$(".superadmin-nav [data-superadmin-module]").forEach((button) => {
    button.addEventListener("click", () => setSuperadminModule(button.dataset.superadminModule));
  });
  $("#superadmin-global-search")?.addEventListener("input", renderSuperadminViews);
  $("#superadmin-clinic-status-filter")?.addEventListener("change", renderSuperadminClinicsTable);
  $("#superadmin-user-role-filter")?.addEventListener("change", renderSuperadminUsersTable);
  $("#superadmin-user-status-filter")?.addEventListener("change", renderSuperadminUsersTable);
  $("#superadmin-export-button")?.addEventListener("click", exportSuperadminCsv);
  $("#superadmin-detail-open-audit")?.addEventListener("click", async () => {
    const clinic = clinicBySuperadminId();
    const filter = $("#superadmin-clinic-filter");
    if (clinic?.source === "backend" && filter) {
      filter.value = clinic.id;
      await loadSuperadminPanel({ loadingLabel: "Cargando auditoria..." });
    }
    setSuperadminModule("audit");
    showToast("Auditoria filtrada por clinica.", "success");
  });
  $("#superadmin-detail-impersonate")?.addEventListener("click", () => {
    const clinic = clinicBySuperadminId();
    if (!clinic) {
      showToast("Selecciona una clinica primero.", "warning");
      return;
    }
    superadminImpersonateClinic(clinic.id);
  });
  $(".superadmin-console")?.addEventListener("click", (event) => {
    const alertButton = event.target.closest("[data-superadmin-alert-module]");
    if (alertButton) {
      const action = alertButton.dataset.superadminAlertAction || "";
      if (action) {
        const actionInput = $("#superadmin-filter-form")?.elements?.action;
        if (actionInput) actionInput.value = action;
        loadSuperadminPanel();
      }
      setSuperadminModule(alertButton.dataset.superadminAlertModule || "dashboard");
      return;
    }
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
      superadminImpersonateClinic(selectedSuperadminClinicId);
      return;
    }
    const archiveTestClinicButton = event.target.closest("[data-superadmin-archive-test-clinic]");
    if (archiveTestClinicButton) {
      selectedSuperadminClinicId = archiveTestClinicButton.dataset.superadminArchiveTestClinic;
      superadminArchiveTestClinic(selectedSuperadminClinicId);
      return;
    }
    const restoreClinicButton = event.target.closest("[data-superadmin-restore-clinic]");
    if (restoreClinicButton) {
      selectedSuperadminClinicId = restoreClinicButton.dataset.superadminRestoreClinic;
      superadminRestoreClinic(selectedSuperadminClinicId);
      return;
    }
    const deleteClinicButton = event.target.closest("[data-superadmin-delete-clinic]");
    if (deleteClinicButton) {
      selectedSuperadminClinicId = deleteClinicButton.dataset.superadminDeleteClinic;
      superadminDeleteClinicPermanently(selectedSuperadminClinicId);
      return;
    }
    const resetUserButton = event.target.closest("[data-superadmin-reset-user]");
    if (resetUserButton) {
      superadminResetUserPassword(resetUserButton.dataset.superadminResetUser);
      return;
    }
    const toggleUserButton = event.target.closest("[data-superadmin-toggle-user]");
    if (toggleUserButton) {
      superadminToggleUser(toggleUserButton.dataset.superadminToggleUser, toggleUserButton.dataset.active === "true");
      return;
    }
    const repairAccessButton = event.target.closest("[data-superadmin-repair-access]");
    if (repairAccessButton) {
      superadminRepairClinicAccess(repairAccessButton.dataset.superadminRepairAccess);
      return;
    }
    const createPractitionerAccessButton = event.target.closest("[data-superadmin-create-practitioner-access]");
    if (createPractitionerAccessButton) {
      superadminCreatePractitionerAccess(createPractitionerAccessButton.dataset.superadminCreatePractitionerAccess);
      return;
    }
    const supportTicketStatusButton = event.target.closest("[data-superadmin-ticket-status]");
    if (supportTicketStatusButton) {
      superadminUpdateSupportTicketStatus(
        supportTicketStatusButton.dataset.superadminTicketStatus,
        supportTicketStatusButton.dataset.status
      );
      return;
    }
    const supportTicketHistoryButton = event.target.closest("[data-superadmin-ticket-history]");
    if (supportTicketHistoryButton) {
      superadminShowSupportTicketHistory(supportTicketHistoryButton.dataset.superadminTicketHistory);
      return;
    }
    const resolveAccessIssueButton = event.target.closest("[data-superadmin-resolve-access-issue]");
    if (resolveAccessIssueButton) {
      superadminResolveAccessIssue(resolveAccessIssueButton.dataset.superadminResolveAccessIssue, "resolved");
      return;
    }
    const closeAccessIssueButton = event.target.closest("[data-superadmin-close-access-issue]");
    if (closeAccessIssueButton) {
      superadminResolveAccessIssue(closeAccessIssueButton.dataset.superadminCloseAccessIssue, "closed");
      return;
    }
    const actionButton = event.target.closest("[data-superadmin-action]");
    if (actionButton) {
      const clinic = clinicBySuperadminId();
      if (!clinic) {
        showToast("Selecciona una clinica primero.", "warning");
        return;
      }
      if (actionButton.dataset.superadminAction === "impersonate-clinic") {
        superadminImpersonateClinic(clinic.id);
      } else if (actionButton.dataset.superadminAction === "toggle-clinic-status") {
        superadminUpdateClinicStatus(clinic.id, clinic.subscription_status === "canceled" ? "active" : "canceled");
      } else if (actionButton.dataset.superadminAction === "extend-trial") {
        superadminExtendClinicTrial(clinic.id);
      } else if (actionButton.dataset.superadminAction === "apply-monthly-plan") {
        superadminApplyClinicPlan(clinic.id, "month");
      } else if (actionButton.dataset.superadminAction === "apply-annual-plan") {
        superadminApplyClinicPlan(clinic.id, "year");
      } else if (actionButton.dataset.superadminAction === "reset-owner") {
        superadminResetOwnerForClinic(clinic.id);
      } else if (actionButton.dataset.superadminAction === "archive-test-clinic") {
        superadminArchiveTestClinic(clinic.id);
      } else if (actionButton.dataset.superadminAction === "restore-clinic") {
        superadminRestoreClinic(clinic.id);
      } else if (actionButton.dataset.superadminAction === "delete-clinic-permanent") {
        superadminDeleteClinicPermanently(clinic.id);
      } else if (actionButton.dataset.superadminAction === "export-audit") {
        superadminExportClinicAudit(clinic.id);
      }
    }
  });
  $(".superadmin-console")?.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    const alertButton = event.target.closest("[data-superadmin-alert-module]");
    if (alertButton) {
      event.preventDefault();
      alertButton.click();
    }
  });
  $(".superadmin-console")?.addEventListener("change", (event) => {
    const roleSelect = event.target.closest("[data-superadmin-role-user]");
    if (roleSelect) {
      superadminUpdateUser(roleSelect.dataset.superadminRoleUser, { role: roleSelect.value });
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
  $("#superadmin-change-password-button")?.addEventListener("click", () => openChangePasswordDialog());
}

function setupDialogCloseButtons() {
  $$(".dialog-close").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.dialogId);
      if (dialog?.id === "change-password-dialog" && dialog.dataset.forcePasswordChange === "true") {
        setInlineError("#change-password-error", "Debes cambiar la clave temporal antes de continuar.");
        return;
      }
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
    candidate.end = candidateEnd;
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
  const appointmentHasPack = Boolean(appointment.patientPackId || appointment.plannedPatientPackId);
  const productionAmount = appointmentRevenueAmount(appointment);
  $("#appointment-detail-title").textContent = `${patient?.name || "Paciente"} - ${appointment.start}`;
  fillSelect(form.elements.service, services.filter((item) => item.active || item.id === appointment.serviceId));
  fillSelect(form.elements.practitioner, practitioners);
  fillSelect(form.elements.room, rooms);
  form.elements.date.value = appointment.date || selectedDate;
  form.elements.start.value = appointment.start || "12:00";
  form.elements.service.value = appointment.serviceId || "";
  form.elements.practitioner.value = appointment.practitionerId || "";
  form.elements.room.value = appointment.roomId || "";
  $("#appointment-detail-data").innerHTML = `
    <dt>Día</dt>
    <dd>${appointment.date || selectedDate}</dd>
    <dt>Hora</dt>
    <dd>${appointment.start || ""}${appointmentEnd(appointment) ? ` - ${appointmentEnd(appointment)}` : ""}</dd>
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
  form.querySelector(".appointment-payment-field")?.classList.toggle("hidden", appointmentHasPack);
  const productionPanel = $("#appointment-production-panel");
  const productionText = $("#appointment-production-text");
  if (productionPanel) {
    productionPanel.classList.toggle("hidden", !appointmentHasPack);
  }
  if (productionText) {
    productionText.textContent = appointmentHasPack
      ? `Esta cita está cubierta por bono. No genera un nuevo cobro ni pendiente de facturación; al guardarla como confirmada cuenta como producción interna (${productionAmount} EUR) para rendimiento.`
      : "";
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
  updateAppointmentDetailDuration(form);
  const invoiceButton = $("#appointment-invoice-button");
  if (invoiceButton) {
    invoiceButton.textContent = appointmentHasPack ? "Facturar bono desde ficha" : (appointment.invoiceGenerated ? "Reimprimir factura" : "Generar factura");
    invoiceButton.disabled = appointmentHasPack || normalizeAppointmentStatus(appointment.status) === "cancelled";
  }
  const attendanceButton = $("#appointment-attendance-button");
  if (attendanceButton) {
    attendanceButton.disabled = normalizeAppointmentStatus(appointment.status) === "cancelled";
  }
  $("#appointment-detail-dialog").showModal();
}

function updateAppointmentDetailDuration(form = $("#appointment-detail-form")) {
  if (!form) return;
  const service = byId(services, form.elements.service?.value);
  const start = form.elements.start?.value || "00:00";
  const duration = Number(service?.duration || 60);
  const end = isValidTimeValue(start) ? addMinutes(start, duration) : "";
  const label = $("#appointment-detail-duration");
  if (label) {
    label.textContent = service
      ? `Duración del servicio: ${duration} min. La cita quedará ${start} - ${end}.`
      : "Selecciona un servicio para calcular la hora final.";
  }
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
    const invoiceSavedAt = new Date().toISOString();
    const updatedInvoiceAppointment = { ...appointment, ...invoiceAppointment, invoiceGenerated: true, invoiceGeneratedAt: invoiceSavedAt, invoiceNumber };
    if (backendDataEnabled()) {
      try {
        await saveAppointmentToBackend(updatedInvoiceAppointment, appointment.id);
      } catch (error) {
        showToast(`Factura generada, pero no se pudo sincronizar la cita: ${error.message}`, "warning");
      }
    }
    appointments = appointments.map((item) => item.id === appointment.id ? updatedInvoiceAppointment : item);
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
  ["date", "start", "service", "practitioner", "room"].forEach((fieldName) => {
    $("#appointment-detail-form")?.elements[fieldName]?.addEventListener("change", () => updateAppointmentDetailDuration());
    $("#appointment-detail-form")?.elements[fieldName]?.addEventListener("input", () => updateAppointmentDetailDuration());
  });
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
    if (!existingAppointment) {
      if (detailError) {
        detailError.textContent = "No se ha encontrado la cita.";
        detailError.classList.add("visible");
      }
      return;
    }
    const nextDate = form.elements.date?.value || existingAppointment.date || selectedDate;
    const nextStart = form.elements.start?.value || existingAppointment.start || "12:00";
    const nextServiceId = form.elements.service?.value || existingAppointment.serviceId;
    const nextPractitionerId = form.elements.practitioner?.value || existingAppointment.practitionerId;
    const nextRoomId = form.elements.room?.value || existingAppointment.roomId;
    const nextService = byId(services, nextServiceId);
    if (!nextDate || !isValidTimeValue(nextStart) || !nextServiceId || !nextPractitionerId || !nextRoomId) {
      if (detailError) {
        detailError.textContent = "Revisa día, hora, servicio, profesional y sala antes de guardar.";
        detailError.classList.add("visible");
      }
      return;
    }
    const scheduleCandidate = {
      ...existingAppointment,
      date: nextDate,
      start: nextStart,
      end: addMinutes(nextStart, nextService?.duration || 60),
      serviceId: nextServiceId,
      practitionerId: nextPractitionerId,
      roomId: nextRoomId,
      status: nextStatus
    };
    if (!finalStatusIsCancelled) {
      const availabilityBlock = availabilityBlockFor(nextPractitionerId, nextDate, scheduleCandidate.start, scheduleCandidate.end);
      const appointmentConflict = findConflict(scheduleCandidate, selectedAppointmentId);
      const groupConflict = groupsForDate(nextDate).find((group) => (
        (group.practitionerId === nextPractitionerId || group.roomId === nextRoomId)
          && overlaps(scheduleCandidate.start, scheduleCandidate.end, group.start, groupEnd(group))
      ));
      if (availabilityBlock || appointmentConflict || groupConflict) {
        const conflictText = availabilityBlock
          ? availabilityBlockLabel(availabilityBlock)
          : appointmentConflict
            ? `Conflicto con ${byId(patients, appointmentConflict.patientId)?.name || "otra cita"} a las ${appointmentConflict.start}.`
            : `Conflicto con la sesión grupal ${groupConflict.name} a las ${groupConflict.start}.`;
        if (detailError) {
          detailError.textContent = conflictText;
          detailError.classList.add("visible");
        }
        return;
      }
    }
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
      const consumeResult = usePatientPackForAppointment(scheduleCandidate, selectedPackId);
      if (!consumeResult.ok) {
        if (restoredExistingPack && existingAppointment?.patientPackId) {
          usePatientPackForAppointment(scheduleCandidate, existingAppointment.patientPackId);
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
      date: scheduleCandidate.date,
      start: scheduleCandidate.start,
      end: scheduleCandidate.end,
      serviceId: scheduleCandidate.serviceId,
      practitionerId: scheduleCandidate.practitionerId,
      roomId: scheduleCandidate.roomId,
      status: nextStatus,
      internalNotes: form.elements.internalNotes.value.trim(),
      paymentStatus: nextPatientPackId || nextPlannedPatientPackId
        ? "unpaid"
        : (form.elements.paymentStatus?.value || appointmentPaymentStatus(existingAppointment)),
      paymentMethod: nextPatientPackId || nextPlannedPatientPackId
        ? ""
        : (form.elements.paymentStatus?.value || appointmentPaymentStatus(existingAppointment)),
      patientPackId: nextPatientPackId,
      plannedPatientPackId: nextPlannedPatientPackId,
      patientPackUsedAt: nextPatientPackId ? (nextPatientPackUsedAt || consumedPatientPackAt || new Date().toISOString()) : "",
      outsideHours: !finalStatusIsCancelled && isOutsidePractitionerHours(byId(practitioners, nextPractitionerId), scheduleCandidate.start, scheduleCandidate.end, scheduleCandidate.date),
      outsideHoursNotice: !finalStatusIsCancelled && isOutsidePractitionerHours(byId(practitioners, nextPractitionerId), scheduleCandidate.start, scheduleCandidate.end, scheduleCandidate.date)
        ? "Está creando una cita fuera de horario"
        : "",
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
  if (form.elements.dateFrom) form.elements.dateFrom.value = todayIso();
  if (form.elements.dateTo) form.elements.dateTo.value = "";
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
  if (form.elements.dateFrom) form.elements.dateFrom.value = group.dateFrom || "";
  if (form.elements.dateTo) form.elements.dateTo.value = group.dateTo || "";
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
  saveSyncedClinicState("groups", groups);
  saveSyncedClinicState("group-dropins", groupDropIns);
  saveSyncedClinicState("group-completions", groupCompletions);
  saveSyncedClinicState("group-session-overrides", groupSessionOverrides);
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
    const dateFrom = form.elements.dateFrom?.value || "";
    const dateTo = form.elements.dateTo?.value || "";
    if (dateFrom && dateTo && dateFrom > dateTo) {
      $("#group-form-error").textContent = "La fecha desde no puede ser posterior a la fecha hasta.";
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
      dateFrom,
      dateTo,
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
      const sharesDateRange = groupDateRangesOverlap(existing, group);
      const sameResource = existing.roomId === group.roomId || existing.practitionerId === group.practitionerId;
      return sharesDay && sharesDateRange && sameResource && overlaps(group.start, groupEnd(group), existing.start, groupEnd(existing));
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
    saveSyncedClinicState("groups", groups);
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
    saveSyncedClinicState("group-completions", groupCompletions);
    renderGroupSessionPanel(group, dateValue);
    renderAll();
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
    saveSyncedClinicState("group-dropins", groupDropIns);
    syncGroupCompletionForSession(group, dateValue);
    renderGroupSessionPanel(group, dateValue);
    renderAll();
  });
}

function renderPractitionerServiceCommissionControls(form = $("#practitioner-form"), practitioner = {}) {
  const container = $("#practitioner-service-commissions");
  if (!container) return;
  const config = practitioner.serviceCommissions || {};
  container.innerHTML = services.length
    ? `
      <div class="service-commission-head" aria-hidden="true">
        <span>Servicio</span>
        <span>Comisión</span>
      </div>
      ${services.map((service) => {
        const item = config[service.id] || {};
        const enabled = item.enabled === true;
        const rate = Number.isFinite(Number(item.rate)) ? Math.round(Number(item.rate) * 10000) / 100 : "";
        return `
          <article class="service-commission-row ${enabled ? "selected" : ""}">
            <label class="service-commission-check">
              <input type="checkbox" data-service-enabled="${service.id}" ${enabled ? "checked" : ""} />
              <span>
                <strong>${service.name}</strong>
                <small>${serviceKindLabel(service)}</small>
              </span>
            </label>
            <label class="service-commission-rate">
              <span>Comisión</span>
              <input type="text" inputmode="decimal" data-service-commission="${service.id}" value="${rate}" placeholder="%" aria-label="Comisión de ${escapeHtml(service.name)}" />
            </label>
          </article>
        `;
      }).join("")}
    `
    : `<p class="form-help">Crea servicios antes para asignarlos al trabajador.</p>`;
  $$("[data-service-enabled]", container).forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      checkbox.closest(".service-commission-row")?.classList.toggle("selected", checkbox.checked);
    });
  });
  $$("[data-service-commission]", container).forEach((input) => {
    input.addEventListener("input", () => {
      const checkbox = $(`[data-service-enabled='${input.dataset.serviceCommission}']`);
      if (checkbox && String(input.value || "").trim()) {
        checkbox.checked = true;
        checkbox.closest(".service-commission-row")?.classList.add("selected");
      }
    });
  });
}

function collectPractitionerServiceCommissions() {
  const config = {};
  $$("[data-service-enabled]").forEach((checkbox) => {
    const serviceId = checkbox.dataset.serviceEnabled;
    const rateInput = $(`[data-service-commission='${serviceId}']`);
    const rateValue = parseDecimal(rateInput?.value || "", NaN);
    const hasRate = Number.isFinite(rateValue) && rateValue > 0;
    if (checkbox.checked || hasRate) {
      config[serviceId] = {
        enabled: true,
        rate: Number.isFinite(rateValue) ? Math.max(0, Math.min(100, rateValue)) / 100 : 0
      };
    }
  });
  return config;
}

function attendanceRecordsForPractitioner(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  const legacy = Array.isArray(practitioner?.attendanceRecords) ? practitioner.attendanceRecords : [];
  return [
    ...attendanceRecords.filter((record) => record.practitionerId === practitionerId),
    ...legacy.filter((record) => !attendanceRecords.some((item) => item.id === record.id))
  ];
}

function attendanceStatusForPractitioner(practitioner) {
  const records = attendanceRecordsForPractitioner(practitioner.id);
  const open = records.find((record) => record.date === todayIso() && record.start && !record.end);
  return open ? `Entrada ${open.start}` : "Sin fichaje abierto";
}

async function clockPractitioner(practitionerId, action) {
  if (backendDataEnabled()) {
    try {
      const saved = await backendRequest("/attendance-records/clock", {
        method: "POST",
        body: JSON.stringify({ practitioner_id: practitionerId, action })
      });
      const record = apiAttendanceRecordToUi(saved);
      attendanceRecords = [
        record,
        ...attendanceRecords.filter((item) => item.id !== record.id)
      ];
      saveClinicState("attendance-records", attendanceRecords);
      renderSettings();
      showToast(action === "in" ? "Entrada registrada." : "Salida registrada.");
      return;
    } catch (error) {
      showToast(`No se pudo registrar fichaje en backend: ${error.message}`, "error");
      return;
    }
  }
  if (backendAuthoritativeMode()) {
    showToast("Inicia sesion de nuevo para fichar con backend activo.", "error");
    return;
  }
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  const openIndex = attendanceRecords.findIndex((record) => record.practitionerId === practitionerId && record.date === todayIso() && record.start && !record.end);
  if (action === "in") {
    if (openIndex >= 0) {
      showToast("Ya hay un fichaje abierto.", "warning");
      return;
    }
    attendanceRecords = [{ id: `attendance-${Date.now()}`, practitionerId, date: todayIso(), start: time, end: "", createdBy: currentSessionName() }, ...attendanceRecords];
  } else if (openIndex >= 0) {
    attendanceRecords = attendanceRecords.map((record, index) => index === openIndex ? { ...record, end: time, closedBy: currentSessionName() } : record);
  } else {
    showToast("No hay una entrada abierta para cerrar.", "warning");
    return;
  }
  saveClinicState("attendance-records", attendanceRecords);
  renderSettings();
  showToast(action === "in" ? "Entrada registrada." : "Salida registrada.");
}

function resetPractitionerForm(form = $("#practitioner-form")) {
  form.reset();
  form.dataset.editingPractitionerId = "";
  form.querySelector(".modal-header h2").textContent = "Nuevo trabajador";
  form.querySelector('button[type="submit"]').textContent = "Guardar trabajador";
  form.elements.color.value = workerColorPalette[practitioners.length % workerColorPalette.length];
  form.elements.password.value = "";
  form.elements.commissionRate.value = "0";
  form.elements.target.value = 2500;
  form.elements.availabilityStart.value = "08:00";
  form.elements.availabilityEnd.value = "14:00";
  form.elements.availabilityStart2.value = "15:00";
  form.elements.availabilityEnd2.value = "20:00";
  if (form.elements.workerType) form.elements.workerType.value = "autonomo";
  if (form.elements.accessRole) form.elements.accessRole.value = "practitioner";
  renderPractitionerServiceCommissionControls(form);
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
  form.elements.commissionRate.value = "0";
  form.elements.target.value = practitioner.target || 0;
  form.elements.availabilityStart.value = practitioner.availabilityStart || "08:00";
  form.elements.availabilityEnd.value = practitioner.availabilityEnd || "20:00";
  form.elements.availabilityStart2.value = practitioner.availabilityStart2 || "";
  form.elements.availabilityEnd2.value = practitioner.availabilityEnd2 || "";
  if (form.elements.workerType) form.elements.workerType.value = practitioner.workerType || "autonomo";
  if (form.elements.accessRole) form.elements.accessRole.value = practitioner.accessRole || "practitioner";
  renderPractitionerServiceCommissionControls(form, practitioner);
  form.elements.color.value = practitioner.color || "#168776";
  form.querySelector(".modal-header h2").textContent = "Editar trabajador";
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  $("#practitioner-dialog").showModal();
}

async function deletePractitionerById(practitionerId) {
  const practitioner = byId(practitioners, practitionerId);
  if (!practitioner || !canManageClinic()) return;
  const activeAppointments = appointments.filter((appointment) => (
    appointment.practitionerId === practitionerId
      && normalizeAppointmentStatus(appointment.status) !== "cancelled"
  ));
  const cancelledAppointments = appointments.filter((appointment) => (
    appointment.practitionerId === practitionerId
      && normalizeAppointmentStatus(appointment.status) === "cancelled"
  ));
  const activeGroups = groups.filter((group) => group.practitionerId === practitionerId && group.active !== false);
  const activeOverrides = groupSessionOverrides.filter((override) => override.practitionerId === practitionerId);
  if (activeAppointments.length || activeGroups.length || activeOverrides.length) {
    await showNotice(
      "No se puede eliminar",
      `Este trabajador tiene ${activeAppointments.length} cita(s) activas, ${activeGroups.length} sesion(es) grupales o cambios puntuales vinculados. Cancela o reasigna esos elementos antes de eliminarlo.`,
      { variant: "warning" }
    );
    return;
  }
  const shouldArchive = cancelledAppointments.length > 0;
  const confirmed = await showConfirm({
    title: shouldArchive ? "Archivar trabajador" : "Eliminar trabajador",
    message: shouldArchive
      ? `${practitioner.name} solo tiene citas canceladas vinculadas. Se archivara para conservar trazabilidad.`
      : `Eliminar a ${practitioner.name}?`,
    detail: shouldArchive ? "Dejara de aparecer como trabajador activo, pero el historico cancelado queda protegido." : "Esta accion no se puede deshacer.",
    confirmLabel: shouldArchive ? "Archivar" : "Eliminar"
  });
  if (!confirmed) return;
  try {
    if (shouldArchive) {
      await savePractitionerToBackend({ ...practitioner, active: false }, practitionerId);
    } else {
      await deletePractitionerFromBackend(practitionerId);
    }
  } catch (error) {
    showToast(`No se pudo ${shouldArchive ? "archivar" : "eliminar"} en backend: ${error.message}`, "error");
    return;
  }
  practitioners = shouldArchive
    ? practitioners.map((item) => item.id === practitionerId ? { ...item, active: false } : item)
    : practitioners.filter((item) => item.id !== practitionerId);
  saveClinicState("practitioners", practitioners);
  renderFilters();
  renderLoginProfiles();
  renderAppointmentFormOptions();
  renderAll();
  showToast(shouldArchive ? "Trabajador archivado." : "Trabajador eliminado.");
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
  $("#clinic-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const workingDays = $$("input[name='workingDays']:checked", form)
      .map((input) => normalizeWorkingDayKey(input.value))
      .filter(Boolean);
    if (!workingDays.length) {
      $("#clinic-save-status").textContent = "Selecciona al menos un día de atención.";
      return;
    }
    const openingStart = form.elements.openingStart?.value || clinic.openingStart || "09:00";
    const openingEnd = form.elements.openingEnd?.value || clinic.openingEnd || "20:00";
    if (!isValidTimeValue(openingStart) || !isValidTimeValue(openingEnd)) {
      $("#clinic-save-status").textContent = "Revisa el horario de apertura y cierre.";
      $("#clinic-save-status").classList.add("error");
      return;
    }
    if (minutes(openingStart) >= minutes(openingEnd)) {
      $("#clinic-save-status").textContent = "El horario de apertura debe ser anterior al horario de cierre.";
      $("#clinic-save-status").classList.add("error");
      return;
    }
    const reminderMessageTemplate = form.elements.reminderMessageTemplate?.value.trim() || defaultReminderSettings().reminderMessageTemplate;
    const nextClinic = {
      ...clinic,
      name: form.elements.name.value.trim() || defaultClinic.name,
      email: form.elements.email?.value.trim() || "",
      phone: form.elements.phone.value.trim(),
      openingStart,
      openingEnd,
      workingDays
    };
    $("#clinic-save-status").textContent = "Guardando configuración...";
    $("#clinic-save-status").classList.remove("error");
    try {
      clinic = await saveClinicSettingsToBackend(nextClinic);
    } catch (error) {
      $("#clinic-save-status").textContent = `No se pudo guardar configuración: ${error.message}`;
      $("#clinic-save-status").classList.add("error");
      return;
    }
    clinic = { ...clinic };
    backendLastSyncAt = Date.now();
    $("#clinic-save-status").classList.remove("error");
    saveClinicState("clinic", clinic);
    reminderSettings = { ...reminderSettings, reminderMessageTemplate };
    saveSyncedClinicState("reminder-settings", reminderSettings);
    clinicAccounts = normalizeClinicAccounts(clinicAccounts.map((account) => (
      account.key === activeClinicKey
        ? { ...account, name: clinic.name, email: clinic.email, phone: clinic.phone, openingStart: clinic.openingStart, openingEnd: clinic.openingEnd, workingDays: clinic.workingDays }
        : account
    )));
    saveClinicAccounts();
    renderLoginClinics();
    $("#clinic-save-status").textContent = "Configuración guardada. Agenda actualizada.";
    window.setTimeout(() => {
      const status = $("#clinic-save-status");
      if (status && !status.classList.contains("error")) {
        status.textContent = "";
      }
    }, 3500);
    renderFilters();
    renderAppointmentFormOptions();
    renderAll();
  });

  $("#delete-clinic").addEventListener("click", async () => {
    if (isDemoClinic()) {
      const confirmed = await confirmClinicReset("Esto limpiará la demo local y la dejará con datos de ejemplo.");
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
      const confirmed = await confirmClinicReset(`Vas a resetear pacientes, citas, trabajadores, salas y servicios de ${clinic.name}. La clínica seguirá existiendo para poder entrar de nuevo.`);
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
    $("#clinic-save-status").textContent = "Clínica reseteada. La cuenta sigue disponible para entrar.";
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
    const requiredFields = ["name", "specialty", "availabilityStart", "availabilityEnd"];
    const missingField = requiredFields.map((name) => form.elements[name]).find((field) => !String(field.value || "").trim());
    if (missingField) {
      missingField.setCustomValidity("Completa este campo.");
      form.reportValidity();
      missingField.setCustomValidity("");
      return;
    }
    const hasSecondRange = Boolean(form.elements.availabilityStart2.value || form.elements.availabilityEnd2.value);
    if (hasSecondRange && (!form.elements.availabilityStart2.value || !form.elements.availabilityEnd2.value || form.elements.availabilityStart2.value >= form.elements.availabilityEnd2.value)) {
      form.elements.availabilityStart2.setCustomValidity("Completa la franja de tarde con una hora de inicio menor que la de fin.");
      form.reportValidity();
      form.elements.availabilityStart2.setCustomValidity("");
      return;
    }
    if (form.dataset.saving === "true") {
      return;
    }
    const editingPractitionerId = form.dataset.editingPractitionerId || "";
    const normalizedName = slugifyClinicName(form.elements.name.value.trim());
    const normalizedEmail = String(form.elements.email?.value || "").trim().toLowerCase();
    const typedPassword = form.elements.password.value || "";
    if (!editingPractitionerId && normalizedEmail && !typedPassword) {
      $("#practitioner-key-status").textContent = "Introduce una clave o genera una clave segura para activar el acceso del trabajador.";
      return;
    }
    const duplicatePractitioner = practitioners.find((item) => (
      item.id !== editingPractitionerId
        && (
          slugifyClinicName(item.name) === normalizedName
          || (normalizedEmail && String(item.email || "").trim().toLowerCase() === normalizedEmail)
        )
    ));
    if (duplicatePractitioner) {
      $("#practitioner-key-status").textContent = `Ya existe un trabajador con esos datos: ${duplicatePractitioner.name}.`;
      return;
    }
    form.dataset.saving = "true";
    form.querySelector('button[type="submit"]').disabled = true;
    const practitioner = {
      id: editingPractitionerId || `worker-${Date.now()}`,
      name: form.elements.name.value.trim(),
      specialty: form.elements.specialty.value.trim(),
      email: form.elements.email?.value.trim() || "",
      password: typedPassword || byId(practitioners, editingPractitionerId)?.password || "",
      color: form.elements.color.value,
      commissionRate: 0,
      target: Number(form.elements.target.value),
      availabilityStart: form.elements.availabilityStart.value,
      availabilityEnd: form.elements.availabilityEnd.value,
      availabilityStart2: form.elements.availabilityStart2.value,
      availabilityEnd2: form.elements.availabilityEnd2.value,
      workerType: form.elements.workerType?.value || "autonomo",
      accessRole: form.elements.accessRole?.value || "practitioner",
      serviceCommissions: collectPractitionerServiceCommissions(),
      attendanceRecords: byId(practitioners, editingPractitionerId)?.attendanceRecords || []
    };
    let savedPractitioner = practitioner;
    if (backendDataEnabled()) {
      try {
        savedPractitioner = await savePractitionerToBackend(practitioner, form.dataset.editingPractitionerId || "");
      } catch (error) {
        $("#practitioner-key-status").textContent = `No se pudo guardar el trabajador en backend: ${error.message}`;
        form.dataset.saving = "false";
        form.querySelector('button[type="submit"]').disabled = false;
        return;
      }
    }
    practitioners = editingPractitionerId
      ? practitioners.map((item) => item.id === editingPractitionerId ? savedPractitioner : item)
      : [...practitioners, savedPractitioner];
    if (savedPractitioner.email && typedPassword) {
      try {
        const accessRole = savedPractitioner.accessRole === "staff" ? "staff" : "practitioner";
        const backendUser = await createBackendUserIfAvailable({
          name: savedPractitioner.name,
          email: savedPractitioner.email,
          password: typedPassword,
          role: accessRole,
          active: true,
          practitioner_id: accessRole === "practitioner" ? savedPractitioner.id : undefined
        });
        if (backendUser?.id) {
          savedPractitioner = { ...savedPractitioner, backendUserId: backendUser.id, userId: backendUser.id };
          practitioners = practitioners.map((item) => item.id === savedPractitioner.id ? savedPractitioner : item);
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
    form.dataset.saving = "false";
    form.querySelector('button[type="submit"]').disabled = false;
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
    saveSyncedClinicState("patient-packs", patientPacks);
    renderPatientDetail();
  });

  $("#patient-pack-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const pack = byId(patientPacks, form.dataset.editingPatientPackId);
    if (!pack) return;
    updatePatientPackRemainingPreview(form);
    const sessions = Math.max(1, Number(form.elements.sessions.value || 1));
    const actualUsed = patientPackActualUsedCount(pack);
    const usedInput = Math.max(0, Number(form.elements.used.value || 0));
    const used = Math.min(sessions, usedInput);
    const name = form.elements.name.value.trim();
    if (!name) {
      $("#patient-pack-error").textContent = "El nombre del bono es obligatorio.";
      $("#patient-pack-error").classList.add("visible");
      return;
    }
    if (used < actualUsed) {
      const confirmed = await showConfirm({
        eyebrow: "Bono del paciente",
        title: "Sesiones vinculadas superiores",
        message: `Hay ${actualUsed} cita(s) vinculada(s) a este bono y quieres dejar ${used} sesion(es) usadas.`,
        detail: "Puedes guardar la correccion, pero conviene revisar esas citas para que saldo, agenda y rendimiento no queden descuadrados.",
        confirmLabel: "Guardar correccion",
        variant: "danger"
      });
      if (!confirmed) return;
    }
    const usageChanged = Number(pack.used || 0) !== used || used !== actualUsed;
    patientPacks = patientPacks.map((item) => item.id === pack.id
      ? {
          ...item,
          name,
          sessions,
          used,
          price: Math.max(0, Number(form.elements.price.value || 0)),
          expiresAt: form.elements.expiresAt?.value || "",
          serviceId: form.elements.serviceId.value || "",
          paymentMethod: form.elements.paymentMethod?.value || item.paymentMethod || "",
          invoice: form.elements.invoice.checked,
          usageSource: used === actualUsed ? "appointments" : "manual-correction",
          usageAdjustedAt: usageChanged ? new Date().toISOString() : item.usageAdjustedAt,
          usageAdjustedBy: usageChanged ? currentSessionName() : item.usageAdjustedBy,
          linkedAppointmentUses: actualUsed,
          updatedAt: new Date().toISOString()
        }
      : item
    );
    if (usageChanged) {
      appendAuditLog("adjust-patient-pack-usage", {
        patientPackId: pack.id,
        patientId: pack.patientId,
        previousUsed: pack.used || 0,
        nextUsed: used,
        linkedAppointmentUses: actualUsed
      });
    }
    saveSyncedClinicState("patient-packs", patientPacks);
    $("#patient-pack-dialog").close();
    renderPatientDetail();
    renderBilling();
  });
  ["sessions", "used"].forEach((fieldName) => {
    $("#patient-pack-form")?.elements?.[fieldName]?.addEventListener("input", () => {
      updatePatientPackRemainingPreview();
    });
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

async function deletePatientPackAssignment(packId) {
  const pack = byId(patientPacks, packId);
  if (!pack) {
    return;
  }
  const linkedAppointments = appointments.filter((appointment) => (
    String(appointment.patientPackId || "") === String(pack.id)
      || String(appointment.plannedPatientPackId || "") === String(pack.id)
  ));
  const confirmed = await showConfirm({
    eyebrow: "Bono asignado",
    title: "Eliminar bono del paciente",
    message: `¿Quieres eliminar "${pack.name}" de la ficha del paciente?`,
    detail: linkedAppointments.length
      ? `Hay ${linkedAppointments.length} cita(s) vinculada(s). Se quitará la relación con este bono para evitar que siga apareciendo como aplicado.`
      : "Esta acción solo retira el bono asignado a este paciente.",
    confirmLabel: "Eliminar bono"
  });
  if (!confirmed) {
    return;
  }
  patientPacks = patientPacks.filter((item) => String(item.id) !== String(pack.id));
  if (linkedAppointments.length) {
    appointments = appointments.map((appointment) => {
      if (String(appointment.patientPackId || "") !== String(pack.id) && String(appointment.plannedPatientPackId || "") !== String(pack.id)) {
        return appointment;
      }
      return {
        ...appointment,
        patientPackId: "",
        plannedPatientPackId: "",
        patientPackUsedAt: ""
      };
    });
    saveClinicState("appointments", appointments);
  }
  saveSyncedClinicState("patient-packs", patientPacks);
  renderAll();
  if (selectedPatientId) {
    renderPatientDetail(selectedPatientId);
  }
  showToast("Bono eliminado de la ficha del paciente.");
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
  updatePatientPackRemainingPreview(form);
  form.elements.price.value = Number(pack.price || 0);
  if (form.elements.expiresAt) {
    form.elements.expiresAt.value = pack.expiresAt || "";
  }
  if (form.elements.paymentMethod) {
    form.elements.paymentMethod.value = pack.paymentMethod || "";
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
  const form = $("#patient-pack-form");
  const selectedPaymentMethod = form?.dataset.editingPatientPackId === String(pack.id)
    ? (form.elements.paymentMethod?.value || pack.paymentMethod || "")
    : (pack.paymentMethod || "");
  if (!["cash", "card"].includes(selectedPaymentMethod)) {
    const error = $("#patient-pack-error");
    if (error) {
      error.textContent = "Selecciona si el bono se cobra en efectivo o tarjeta antes de facturarlo.";
      error.classList.add("visible");
    } else {
      showToast("Selecciona método de cobro del bono.", "warning");
    }
    return;
  }
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
    ? { ...item, invoice: true, invoiceGenerated: true, invoiceGeneratedAt: new Date().toISOString(), invoiceNumber, paymentMethod: selectedPaymentMethod }
    : item
  );
  saveSyncedClinicState("patient-packs", patientPacks);
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
  saveSyncedClinicState("clinical-notes", clinicalNotes);
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
    saveSyncedClinicState("clinical-notes", clinicalNotes);
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
    saveSyncedClinicState("clinical-notes", clinicalNotes);
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
    if (event.target.tagName !== "INPUT") {
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

function setupBillingControls() {
  const sync = () => {
    billingFilterState = {
      ...billingFilterState,
      mode: $("#billing-filter-mode")?.value || "current-month",
      day: $("#billing-filter-day")?.value || todayIso(),
      month: $("#billing-filter-month")?.value || todayIso().slice(0, 7),
      from: $("#billing-filter-from")?.value || monthStartIso(todayIso()),
      to: $("#billing-filter-to")?.value || monthEndIso(todayIso()),
      sort: $("#billing-sort-order")?.value || "desc",
      page: 1
    };
    saveState("billing-filter-state", billingFilterState);
    renderBilling();
  };
  $("#billing-filter-mode")?.addEventListener("change", () => updateBillingFilterFieldVisibility());
  $("#apply-billing-filters")?.addEventListener("click", sync);
  $("#add-manual-billing")?.addEventListener("click", () => {
    openManualBillingDialog();
  });
  $("#download-billing-pdf")?.addEventListener("click", () => {
    downloadBillingPdfReport();
  });
  $("#manual-billing-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const amount = Number(form.elements.amount.value || 0);
    const concept = form.elements.concept.value.trim();
    const paymentMethod = form.elements.paymentMethod?.value || "";
    if (!form.elements.date.value || !concept || amount <= 0 || !paymentMethod) {
      $("#manual-billing-error").textContent = "Indica fecha, concepto, método e importe mayor que cero.";
      $("#manual-billing-error").classList.add("visible");
      return;
    }
    const editingMovementId = form.dataset.editingMovementId || "";
    const existingMovement = editingMovementId ? manualBillingMovements.find((item) => String(item.id) === String(editingMovementId)) : null;
    let movement = {
      id: editingMovementId || `manual-billing-${Date.now()}`,
      type: form.elements.type.value,
      date: form.elements.date.value,
      amount,
      concept,
      paymentMethod,
      source: form.dataset.source || "",
      groupMonthlyKey: form.dataset.groupMonthlyKey || "",
      createdAt: existingMovement?.createdAt || new Date().toISOString(),
      createdBy: existingMovement?.createdBy || currentSessionName()
    };
    try {
      movement = await saveManualBillingMovementToBackend(movement, editingMovementId);
    } catch (error) {
      $("#manual-billing-error").textContent = `No se pudo guardar en backend: ${error.message}`;
      $("#manual-billing-error").classList.add("visible");
      return;
    }
    manualBillingMovements = [movement, ...manualBillingMovements.filter((item) => item.id !== movement.id && item.id !== editingMovementId)];
    saveClinicState("manual-billing-movements", manualBillingMovements);
    form.elements.type.disabled = false;
    form.dataset.editingMovementId = "";
    form.dataset.groupMonthlyKey = "";
    form.dataset.source = "";
    $("#manual-billing-dialog").close();
    renderBilling();
    showToast(editingMovementId ? "Movimiento actualizado." : "Movimiento de facturacion guardado.");
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
setupFormErrorClearing("#manual-billing-form", "#manual-billing-error");
setupSession();
setupDialog();
setupBackendAutoSyncTriggers();
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
setupBillingControls();
setupPerformance();
restoreAuthenticatedSessionOnLoad();
renderAll();


