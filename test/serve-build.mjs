// Test-only static host: deliberately no SPA fallback or root-level asset aliases.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve("dist");
const prefix = "/_cm_1/";
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  if (!pathname.startsWith(prefix)) { response.writeHead(404).end(); return; }
  const file = resolve(root, pathname.slice(prefix.length));
  if (!file.startsWith(root + sep)) { response.writeHead(404).end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch { response.writeHead(404).end(); }
}).listen(4174, "127.0.0.1");
