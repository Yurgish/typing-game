import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "../api/src"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@repo/trpc": path.resolve(__dirname, "../../packages/trcp/src"),
      "@repo/database": path.resolve(__dirname, "../../packages/database/src"),
      // remake types
    },
  },
});
