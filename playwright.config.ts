import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  testIgnore: ["**/._*"],
  fullyParallel: true,
  reporter: "list",
  use: { browserName: "chromium", baseURL: "http://127.0.0.1:4174" },
  webServer: {
    command: "node test/serve-build.mjs",
    url: "http://127.0.0.1:4174/_cm_1/index.html",
    reuseExistingServer: false,
  },
});
