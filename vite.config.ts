import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { tempo } from "tempo-devtools/dist/vite";

export default defineConfig({
  plugins: [react(), tempo()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  base: "/",
});
