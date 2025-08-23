// lib/useServiceWorkerUpdate.ts
import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export function useServiceWorkerUpdate() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // only enable in production
    if (process.env.NODE_ENV !== "production") return;

    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js'); // next-pwa default
      wb.addEventListener('waiting', () => {
        wb.messageSW({ type: 'SKIP_WAITING' });
      });
      wb.register().then((reg) => {
        if (reg && reg.waiting) setWaiting(reg.waiting);
      });
    }
  }, []);

  return {
    hasUpdate: !!waiting,
    refresh: () => window.location.reload(),
  };
}
