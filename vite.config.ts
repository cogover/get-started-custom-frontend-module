import { defineConfig } from "vite";

export default defineConfig({
  // Cogover serves this module inside an assigned slot, not at the domain root.
  base: "./",
});
