// Submit every sitemap URL to IndexNow (shared by Bing, Naver, Yandex, Seznam).
// Usage: node scripts/indexnow.mjs [site-origin]   (default https://pnl404.com)
import { readdirSync } from "node:fs";

const site = (process.argv[2] ?? "https://pnl404.com").replace(/\/$/, "");
const host = new URL(site).host;
const key = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(/\.txt$/, "");
if (!key) throw new Error("IndexNow key file not found in public/");

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`${urls.length} URLs in sitemap`);

for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${site}/${key}.txt`, urlList }),
  });
  console.log(`batch ${i / 10000 + 1}: ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
}
