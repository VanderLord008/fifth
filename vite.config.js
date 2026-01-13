import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/fifth/',  // GitHub Pages base path
  build: {
    outDir: 'docs',  // Build to docs folder for GitHub Pages from main branch
  },
})
