import { defineConfig } from 'vite';

export default defineConfig({
  // Served from GitHub Pages at /virtual-office-starter/, so all asset
  // URLs must be relative to that subpath.
  base: '/virtual-office-starter/',
  worker: {
    // The formula worker is an ES module; 'iife' is not allowed together
    // with code-splitting, which the Univer bundles need.
    format: 'es',
  },
  server: {
    port: 5173,
  },
});
