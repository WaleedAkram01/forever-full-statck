import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Agrr hmm chchty jb open hoo tou iss sepecifc port prr hii open hoo tou yeh add karain gy.
  server: { port: 5173 },
});
