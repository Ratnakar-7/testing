const http = require("http");
const { URL } = require("url");

const sampleProjects = [
  { name: "Recipe Radar", stack: "React + Node.js", type: "full-stack app" },
  { name: "Budget Bloom", stack: "Vue + Express", type: "dashboard app" },
  { name: "Travel Tiles", stack: "Svelte + API", type: "content app" },
  { name: "Focus Forge", stack: "Next.js", type: "productivity app" },
];

function json(res, statusCode, body) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function getRandomProject() {
  const index = Math.floor(Math.random() * sampleProjects.length);
  return sampleProjects[index];
}

function requestHandler(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") {
    return json(res, 200, { status: "ok" });
  }

  if (req.method === "GET" && url.pathname === "/api/public/projects/random") {
    return json(res, 200, { project: getRandomProject() });
  }

  if (req.method === "GET" && url.pathname === "/api/config") {
    return json(res, 200, { hasApiKey: Boolean(process.env.API_KEY) });
  }

  return json(res, 404, { error: "Not found" });
}

function createServer() {
  return http.createServer(requestHandler);
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  const server = createServer();
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

module.exports = { createServer, requestHandler, sampleProjects };
