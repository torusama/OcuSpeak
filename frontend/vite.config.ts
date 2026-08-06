import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/ocuspeak-192.png', 'icons/ocuspeak-512.png', 'favicon.svg'],
      manifest: {
        name: 'OcuSpeak Care',
        short_name: 'OcuSpeak',
        description: 'Gaze-first AAC communication and caregiver support interface.',
        theme_color: '#4C57A9',
        background_color: '#F8F5EC',
        display: 'standalone',
        start_url: '/care/dashboard',
        icons: [
          { src: '/icons/ocuspeak-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/ocuspeak-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-font-stylesheets' }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'google-font-webfonts', expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
