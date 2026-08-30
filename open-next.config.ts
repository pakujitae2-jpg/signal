import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page is force-dynamic with its own in-memory caching, so no
// incremental cache (KV/R2) is needed.
//
// `buildCommand` calls the Next.js CLI directly. Without it OpenNext runs
// `npm run build`, which is this package's own Cloudflare build script and
// would recurse.
export default {
  ...defineCloudflareConfig(),
  buildCommand: "npx next build",
};
