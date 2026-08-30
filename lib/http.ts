// Shared upstream fetch helpers: browser-like UA, hard timeout, and an
// edge cache so a burst of page views (or a crawler sweep) becomes one
// upstream request per Cloudflare colo instead of one per render.

const FETCH_TIMEOUT_MS = 8_000;
export const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

type EdgeCache = {
  match(url: string): Promise<Response | undefined>;
  put(url: string, res: Response): Promise<void>;
};

// Workers expose the Cache API as `caches.default`; it is absent in Node.
function edgeCache(): EdgeCache | null {
  const c = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return c?.default ?? null;
}

async function fetchUpstream(url: string, accept: string, ttlSec: number): Promise<Response> {
  const cache = ttlSec > 0 ? edgeCache() : null;
  if (cache) {
    const hit = await cache.match(url).catch(() => undefined);
    if (hit) return hit;
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: accept },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  if (cache) {
    const copy = new Response(res.clone().body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/octet-stream",
        "Cache-Control": `public, max-age=${ttlSec}`,
      },
    });
    await cache.put(url, copy).catch(() => {});
  }
  return res;
}

/** GET JSON. `ttlSec` is how long the edge may reuse the upstream response. */
export async function fetchJson(url: string, ttlSec = 30): Promise<any> {
  const res = await fetchUpstream(url, "application/json", ttlSec);
  return res.json();
}

/** GET text (RSS, CSV). `ttlSec` is how long the edge may reuse the upstream response. */
export async function fetchText(url: string, ttlSec = 30): Promise<string> {
  const res = await fetchUpstream(url, "*/*", ttlSec);
  return res.text();
}
