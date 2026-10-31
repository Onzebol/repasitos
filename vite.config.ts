import { readFileSync, writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

// Sustituye __BUILD__ en dist/sw.js por la hora de compilación: así sw.js cambia en cada
// versión y las apps instaladas detectan que hay una nueva (ver src/swUpdate.ts)
const stampServiceWorker = (): Plugin => ({
  name: 'stamp-service-worker',
  apply: 'build',
  closeBundle() {
    const file = 'dist/sw.js'
    writeFileSync(file, readFileSync(file, 'utf-8').replace('__BUILD__', new Date().toISOString()))
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/repasitos/',
  plugins: [react(), stampServiceWorker()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
