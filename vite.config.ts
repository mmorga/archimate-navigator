import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/archimate-navigator",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // string shorthand:
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      "/archimate-navigator/*": {
        rewrite: (path) => path.replace(/^\/archimate-navigator/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    manifest: true,
  },
});
