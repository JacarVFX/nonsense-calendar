import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      manifest: false,
      includeAssets: ['icon-192.svg', 'icon-512.svg', 'manifest.json'],
      workbox: {
        navigateFallback: '/index.html',
        // No interceptar las páginas standalone — que se sirvan desde red
        navigateFallbackDenylist: [
          /^\/contratos?(\.html|\/|$|\?)/,
          /^\/contrato(\.html|\/|$|\?)/,
          /^\/llave(\.html|\/|$|\?)/,
          /^\/firmas\//,
        ],
        globPatterns: ['**/*.{js,css,html,svg,json,woff2}'],
        // No precachear los HTML standalone (siempre desde red)
        globIgnores: ['contratos.html', 'contrato.html', 'llave.html'],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      },
      devOptions: { enabled: false }
    })
  ],
  server: { port: 5173 }
})
