const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8001);
const apiPatientPacks = new Map();
const apiPatientPackLocks = new Set();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function patientPackRemaining(pack) {
  return Math.max(0, Number(pack?.sessions || 0) - Number(pack?.used || 0));
}

function validatePatientPackConsumption(pack, context = {}) {
  if (!pack) {
    return "El bono seleccionado no existe.";
  }
  if (context.patientId && pack.patientId !== context.patientId) {
    return "El bono seleccionado pertenece a otro paciente.";
  }
  if (context.serviceId && pack.serviceId && pack.serviceId !== context.serviceId) {
    return "El bono seleccionado no corresponde al servicio de la cita.";
  }
  const sessions = Math.max(0, Number(pack.sessions || 0));
  const used = Math.max(0, Number(pack.used || 0));
  if (sessions <= 0) {
    return "Este bono no tiene sesiones configuradas.";
  }
  if (used >= sessions) {
    return `El bono esta agotado: ${used}/${sessions} sesiones consumidas.`;
  }
  return "";
}

async function handleConsumePatientPack(request, response) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { ok: false, message: "JSON invalido." });
    return;
  }

  const inputPack = body.pack || {};
  const clinicKey = body.clinicKey || "default";
  const packId = body.packId || inputPack.id;
  if (!packId) {
    sendJson(response, 400, { ok: false, message: "Falta el identificador del bono." });
    return;
  }

  const storeKey = `${clinicKey}:${packId}`;
  if (apiPatientPackLocks.has(storeKey)) {
    sendJson(response, 409, { ok: false, code: "busy", message: "Ya hay un consumo de este bono en curso." });
    return;
  }

  apiPatientPackLocks.add(storeKey);
  try {
    const currentPack = apiPatientPacks.get(storeKey) || { ...inputPack, id: packId };
    const validationMessage = validatePatientPackConsumption(currentPack, body);
    if (validationMessage) {
      sendJson(response, 409, { ok: false, code: "blocked", message: validationMessage, pack: currentPack });
      return;
    }

    const used = Math.max(0, Number(currentPack.used || 0));
    const updatedAt = new Date().toISOString();
    const updatedPack = {
      ...currentPack,
      used: used + 1,
      updatedAt,
      lastConsumedAt: updatedAt,
      lastAppointmentId: body.appointmentId || currentPack.lastAppointmentId || ""
    };
    apiPatientPacks.set(storeKey, updatedPack);
    sendJson(response, 200, {
      ok: true,
      pack: updatedPack,
      remaining: patientPackRemaining(updatedPack)
    });
  } finally {
    apiPatientPackLocks.delete(storeKey);
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  if (request.method === "POST" && url.pathname === "/api/patient-packs/consume") {
    handleConsumePatientPack(request, response);
    return;
  }

  const requestPath = url.pathname === "/"
    ? "/index.html"
    : url.pathname.endsWith("/")
      ? `${url.pathname}index.html`
      : url.pathname;
  const safePath = path
    .normalize(requestPath)
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    });
    response.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Klinia disponible en este ordenador: http://localhost:${port}`);
  console.log(`Para demo en otros dispositivos de la misma WiFi: http://TU-IP-LOCAL:${port}`);
});

