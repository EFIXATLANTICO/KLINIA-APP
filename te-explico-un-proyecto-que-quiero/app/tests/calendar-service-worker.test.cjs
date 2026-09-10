const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

async function run() {
  const handlers = {};
  const writes = [];
  const context = {
    URL,
    self: {
      location: { origin: "https://staging.example.test" },
      addEventListener: (name, handler) => { handlers[name] = handler; },
    },
    fetch: async () => ({ ok: true, clone: () => ({}) }),
    caches: {
      open: async () => ({ put: async (key) => { writes.push(key); } }),
      match: async () => null,
    },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8"), context);
  for (const route of ["/privacidad", "/terminos", "/reservar/clinica-test", "/portfolio/demo"]) {
    let response;
    handlers.fetch({
      request: { method: "GET", mode: "navigate", url: context.self.location.origin + route },
      respondWith: (promise) => { response = promise; },
    });
    assert.equal((await response).ok, true);
    assert.deepEqual(writes, [], route + " must not overwrite the app shell");
  }
  let response;
  handlers.fetch({
    request: { method: "GET", mode: "navigate", url: context.self.location.origin + "/" },
    respondWith: (promise) => { response = promise; },
  });
  await response;
  assert.deepEqual(writes, ["./index.html"]);
  console.log("Service worker public-route isolation: OK");
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
