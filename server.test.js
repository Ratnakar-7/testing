const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer, sampleProjects } = require("./server");

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("GET /api/health returns ok status", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok" });
  });
});

test("GET /api/public/projects/random returns a known sample project", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/public/projects/random`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.project);
    assert.ok(sampleProjects.some((project) => project.name === body.project.name));
  });
});

test("GET /api/config never exposes API_KEY raw value", async () => {
  process.env.API_KEY = "super-secret-key";

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/config`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { hasApiKey: true });
    assert.equal(JSON.stringify(body).includes("super-secret-key"), false);
  });
});
