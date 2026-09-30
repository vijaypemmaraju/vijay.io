import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://vijay.io",
  redirects: {
    "/vijay": "/",
    "/daily-dungeon": "https://dailydungeon.net",
  },
});
