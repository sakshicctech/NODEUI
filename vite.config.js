import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,woff,woff2}'], // Include all asset types
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(js|css|html|png|jpg|jpeg|svg|ico|json|woff|woff2)$/,
            handler: 'StaleWhileRevalidate', // Better for UI assets
            options: {
              cacheName: 'all-assets',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: new RegExp('/*'), // Cache everything from your domain
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'all-content',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      
      devOptions: {
        enabled: true  // Enable PWA in development
      },
      manifest: {
        name: 'Port Management',
        short_name: 'Port Management',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      }
    })
  ]
})
