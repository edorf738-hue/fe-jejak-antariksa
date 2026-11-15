// Pulls the content from the backend API into src/data/api/*.json (the snapshot the site is built from).
// Runs before `next build`. If the API is not set or unreachable, the committed snapshot is kept, so the build still works.
import { mkdirSync, writeFileSync } from "node:fs";

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
const RESOURCES = ["chapters", "scene-objects", "source-catalog", "galleries"];

if (!API) {
  console.log("[sync-data] API_URL not set: using the committed snapshot in src/data/api");
  process.exit(0);
}
try {
  const out = {};
  for (const r of RESOURCES) {
    const res = await fetch(`${API}/api/v1/${r}?limit=500`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${r}: HTTP ${res.status}`);
    out[r] = (await res.json()).data;
  }
  mkdirSync("src/data/api", { recursive: true });
  for (const [r, data] of Object.entries(out)) writeFileSync(`src/data/api/${r}.json`, JSON.stringify(data, null, 2) + "\n");
  console.log(`[sync-data] snapshot updated from ${API}`);
} catch (e) {
  console.warn(`[sync-data] ${API} unreachable (${e.message}): using the committed snapshot`);
}
