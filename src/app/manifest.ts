// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Demo PWA TWA',
    short_name: 'DemoPWA',
    description: 'POC for PWA and TWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#FCF0DB',
    theme_color: '#171F1E', // matches the blue placeholder icons
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  };
}
