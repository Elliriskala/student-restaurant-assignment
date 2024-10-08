import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf}'],
      },
      includeAssets: ['style.css', 'fonts/Roboto_Mono/static/RobotoMono-Regular.ttf'],
      manifest: {
        name: 'vite pwa example',
        short_name: 'vite-pwa',
        description: 'A Vite PWA plugin example',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/restaurant_icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/restaurant_icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
