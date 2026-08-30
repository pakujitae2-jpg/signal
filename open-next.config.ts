import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page is force-dynamic with its own in-memory caching, so no
// incremental cache (KV/R2) is needed.
export default defineCloudflareConfig();
