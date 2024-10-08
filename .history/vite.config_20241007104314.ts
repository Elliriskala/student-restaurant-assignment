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
            src: 'icons/restaurant_icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/restaurant_icon.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/restaurant_icon.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/restaurant_icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
