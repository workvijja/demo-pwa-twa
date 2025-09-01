"use client"

import { useEffect, useState, useCallback } from 'react';
import { Workbox } from 'workbox-window';

export function useServiceWorkerUpdate() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const isDev = process.env.NODE_ENV === 'development';

  const refresh = useCallback(() => {
    if (isDev) return;
    
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    } else if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [waiting, registration, isDev]);

  useEffect(() => {
    try {
      // Only run in the browser
      if (typeof window === 'undefined' || isDev) {
        console.log('Skipping service worker update in development mode');
        return;
      }

      if ('serviceWorker' in navigator) {
        const wb = new Workbox('/sw.js');

        const onWaiting = () => {
          console.log('A new service worker is waiting to activate');
          if (wb && wb.getSW) {
            wb.getSW().then(sw => {
              console.log('New service worker found:', sw);
              setWaiting(sw);
            });
          }
        };

        const onControlling = () => {
          console.log('New service worker is controlling the page');
          window.location.reload();
        };

        wb.addEventListener('waiting', onWaiting);
        wb.addEventListener('controlling', onControlling);

        // Register the service worker
        wb.register().then(reg => {
          console.log('Service worker registered:', reg);
          setRegistration(reg!);

          // Check for updates immediately
          reg?.update().then(() => {
            console.log('Checked for service worker update');
          });
        });

        // Check for updates every hour
        const updateInterval = setInterval(() => {
          if (registration) {
            registration.update().catch(console.error);
          }
        }, 60 * 60 * 1000);

        return () => {
          wb.removeEventListener('waiting', onWaiting);
          wb.removeEventListener('controlling', onControlling);
          clearInterval(updateInterval);
        };
      }
    } catch(e: Error) {
      console.error(e.message);
    }
  }, [isDev, registration]);

  return {
    hasUpdate: isDev ? false : (!!waiting || (registration?.waiting !== null && registration?.waiting !== undefined)),
    refresh,
  };
}
