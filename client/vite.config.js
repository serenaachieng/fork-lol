import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

let faviconURL = './favicon.svg'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    tailwindcss(),
    react(),

    VitePWA({
      includeAssets: [faviconURL],
      manifest: {
        theme_color: '#7A1A1A',
        icons: [
          {
            src: faviconURL,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: faviconURL,
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    }),

    babel({ presets: [reactCompilerPreset()] }),
  ],
})